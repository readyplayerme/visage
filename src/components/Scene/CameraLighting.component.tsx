import { useEffect, FC, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Camera, Vector3, DirectionalLight, AmbientLight, SpotLight } from 'three';
import { OrbitControls } from 'three-stdlib';
import { clamp, lerp } from 'src/services';
import { LightingProps, Required } from 'src/types';

type CameraLightingProps = Required<LightingProps> & {
  // eslint-disable-next-line react/no-unused-prop-types
  fullBody?: boolean;
  headScale?: number;
  cameraTarget?: number;
  cameraInitialDistance?: number;
  /**
   * Handles camera movement on the Z-axis.
   */
  cameraZoomTarget?: Vector3;
  controlsMinDistance?: number;
  controlsMaxDistance?: number;
  /**
   * Enables camera moving on Y-axis while zooming in-out.
   */
  updateCameraTargetOnZoom?: boolean;
};

let controls: any;
let progress = Number.POSITIVE_INFINITY;

const updateCameraFocus = (camera: Camera, delta: number, target?: Vector3) => {
  if (target && progress <= 1) {
    camera.position.setX(lerp(camera.position.x, target.x, progress));
    camera.position.setZ(lerp(camera.position.z, target.z, progress));
    progress += delta;
  }
};

const updateCameraTarget = (camera: Camera, target: number, minDistance: number, maxDistance: number) => {
  if (controls) {
    let distance = controls.target.distanceTo(camera.position);
    distance = clamp(distance, maxDistance, minDistance);
    const pivot = (distance - minDistance) / (maxDistance - minDistance);

    controls.target.set(0, target - 0.6 * pivot, 0);
  }
};

export const CameraLighting: FC<CameraLightingProps> = ({
  cameraTarget,
  cameraInitialDistance,
  cameraZoomTarget,
  headScale = 1,
  ambientLightColor,
  ambientLightIntensity,
  dirLightPosition,
  dirLightColor,
  dirLightIntensity,
  spotLightPosition,
  spotLightColor,
  spotLightAngle,
  spotLightIntensity,
  controlsMinDistance = 0.4,
  controlsMaxDistance = 2.5,
  updateCameraTargetOnZoom = false
}) => {
  const cameraZoomTargetRef = useRef(cameraZoomTarget);
  const { camera, gl, scene } = useThree();
  const fallbackCameraTarget = cameraTarget || 1.475 + headScale / 10;
  const headScaleAdjustedMinDistance = controlsMinDistance + headScale / 10;

  useEffect(() => {
    if (
      cameraZoomTargetRef.current?.x !== cameraZoomTarget?.x ||
      cameraZoomTargetRef.current?.y !== cameraZoomTarget?.y ||
      cameraZoomTargetRef.current?.z !== cameraZoomTarget?.z
    ) {
      cameraZoomTargetRef.current = cameraZoomTarget;
      progress = 0;
    }

    controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;

    controls.minDistance = headScaleAdjustedMinDistance;
    controls.maxDistance = controlsMaxDistance;
    controls.minPolarAngle = 1.4;
    controls.maxPolarAngle = 1.4;

    controls.target.set(0, fallbackCameraTarget, 0);
    controls.update();

    // TODO: Look for a better distance initialiser, without progress value check it conflicts with cameraZoomTarget which also can update camera position.z
    if (cameraInitialDistance && progress === Number.POSITIVE_INFINITY) {
      camera.position.z = cameraInitialDistance;
      controls.update();
    }

    return () => {
      controls.dispose();
    };
  }, [
    cameraInitialDistance,
    camera,
    controlsMinDistance,
    controlsMaxDistance,
    fallbackCameraTarget,
    gl.domElement,
    headScaleAdjustedMinDistance,
    cameraZoomTarget
  ]);

  useEffect(() => {
    if (!scene.getObjectByName('back-highlight')) {
      const dirLight = new DirectionalLight(dirLightColor, dirLightIntensity);
      dirLight.name = 'back-highlight';
      dirLight.position.set(dirLightPosition.x, dirLightPosition.y, dirLightPosition.z);
      dirLight.castShadow = true;
      dirLight.shadow.bias = -0.0001;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.blurSamples = 100;

      const ambientLight = new AmbientLight(ambientLightColor, ambientLightIntensity);
      ambientLight.name = 'ambient-light';
      ambientLight.position.set(0, 0, 0);

      const spotLight = new SpotLight(spotLightColor, spotLightIntensity, 0, spotLightAngle, 0, 1);
      spotLight.name = 'spot-light';
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);

      camera.add(ambientLight);
      camera.add(spotLight);
      camera.add(dirLight);
      scene.add(camera);
    } else {
      const dirLight = scene.getObjectByName('back-highlight') as DirectionalLight;
      dirLight.color.set(dirLightColor);
      dirLight.intensity = dirLightIntensity;
      dirLight.position.set(dirLightPosition.x, dirLightPosition.y, dirLightPosition.z);

      const ambientLight = scene.getObjectByName('ambient-light') as AmbientLight;
      ambientLight.color.set(ambientLightColor);
      ambientLight.intensity = ambientLightIntensity;

      const spotLight = scene.getObjectByName('spot-light') as SpotLight;
      spotLight.color.set(spotLightColor);
      spotLight.intensity = spotLightIntensity;
      spotLight.angle = spotLightAngle;
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
    }
  }, [
    ambientLightColor,
    ambientLightIntensity,
    dirLightPosition,
    dirLightColor,
    dirLightIntensity,
    spotLightPosition,
    spotLightColor,
    spotLightIntensity,
    spotLightAngle,
    camera,
    scene
  ]);

  useFrame((_, delta) => {
    if (updateCameraTargetOnZoom) {
      updateCameraTarget(camera, fallbackCameraTarget, headScaleAdjustedMinDistance, controlsMaxDistance);
    }
    updateCameraFocus(camera, delta, cameraZoomTarget);
    if (controls) {
      controls.update();
    }
  });

  return null;
};
