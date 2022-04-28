import { useEffect, FC } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Camera, Vector3, DirectionalLight, AmbientLight, SpotLight } from 'three';
import { OrbitControls } from 'three-stdlib';
import { clamp, lerp } from 'src/helpers';
import { LightingProps, Required } from 'src/types';

type CameraLightingProps = Required<LightingProps> & {
  fullBody?: boolean;
  headScale?: number;
  cameraTarget?: number;
  cameraInitialDistance?: number;
  cameraZoomTarget?: Vector3;
  controlsMinDistance?: number;
  controlsMaxDistance?: number;
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
  spotLightPosition,
  spotLightColor,
  spotLightAngle,
  controlsMinDistance = 0.4,
  controlsMaxDistance = 2.5,
  updateCameraTargetOnZoom = false
}) => {
  const { camera, gl, scene } = useThree();
  const fallbackCameraTarget = cameraTarget || 1.475 + headScale / 10;
  const headScaleAdjustedMinDistance = controlsMinDistance + headScale / 10;

  useEffect(() => {
    controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;

    controls.minDistance = headScaleAdjustedMinDistance;
    controls.maxDistance = controlsMaxDistance;
    controls.minPolarAngle = 1.4;
    controls.maxPolarAngle = 1.4;

    controls.target.set(0, fallbackCameraTarget, 0);
    controls.update();

    if (cameraInitialDistance) {
      camera.position.z = cameraInitialDistance;
      controls.update();
    }

    return () => {
      controls.dispose();
    };
  }, [cameraInitialDistance]);

  useEffect(() => {
    const sceneHasLighting = scene.getObjectByName('DirectionalLight') as DirectionalLight;

    if (!sceneHasLighting) {
      const dirLight = new DirectionalLight(dirLightColor, 5);
      dirLight.name = 'back-highlight';
      dirLight.position.set(dirLightPosition.x, dirLightPosition.y, dirLightPosition.z);
      dirLight.castShadow = true;
      dirLight.shadow.bias = -0.0001;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.blurSamples = 100;

      const ambientLight = new AmbientLight(ambientLightColor, ambientLightIntensity);
      ambientLight.position.set(0, 0, 0);

      const spotLight = new SpotLight(spotLightColor, 1, 0, spotLightAngle, 0, 1);
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);

      camera.add(ambientLight);
      camera.add(spotLight);
      camera.add(dirLight);
      scene.add(camera);
    }
  }, [
    ambientLightColor,
    ambientLightIntensity,
    dirLightPosition,
    dirLightColor,
    spotLightPosition,
    spotLightColor,
    spotLightAngle,
    camera,
    scene
  ]);

  useFrame((_, delta) => {
    if (updateCameraTargetOnZoom) {
      updateCameraTarget(camera, fallbackCameraTarget, headScaleAdjustedMinDistance, controlsMaxDistance);
    }
    updateCameraFocus(camera, delta, cameraZoomTarget);
    controls.update();
  });

  return null;
};
