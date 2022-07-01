import { useEffect, FC } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Camera,
  Vector3,
  DirectionalLight,
  AmbientLight,
  SpotLight,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  SpotLightHelper,
  DirectionalLightHelper
} from 'three';
import { OrbitControls } from 'three-stdlib';
import { clamp, lerp } from 'src/services';
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
  }, [
    cameraInitialDistance,
    camera,
    controlsMinDistance,
    controlsMaxDistance,
    fallbackCameraTarget,
    gl.domElement,
    headScaleAdjustedMinDistance
  ]);

  useEffect(() => {
    if (!scene.getObjectByName('back-highlight')) {
      const dirLight = new DirectionalLight(dirLightColor, 5);
      dirLight.name = 'back-highlight';
      dirLight.position.set(dirLightPosition.x, dirLightPosition.y, dirLightPosition.z);
      dirLight.castShadow = true;
      dirLight.shadow.bias = -0.0001;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.blurSamples = 100;

      const helper = new DirectionalLightHelper(dirLight);

      const ambientLight = new AmbientLight(ambientLightColor, ambientLightIntensity);
      ambientLight.name = 'ambient-light';
      ambientLight.position.set(0, 0, 0);

      const spotLight = new SpotLight(spotLightColor, 1, 0, spotLightAngle, 0, 1);
      spotLight.name = 'spot-light';
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
      spotLight.distance = 20;

      const lightHelper = new SpotLightHelper(spotLight);

      const geometry = new SphereGeometry(0.2, 32, 16);
      const material = new MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new Mesh(geometry, material);
      sphere.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
      sphere.name = 'spot-light-sphere';

      scene.add(ambientLight);
      scene.add(dirLight);
      scene.add(sphere);
      camera.add(spotLight);
      scene.add(helper);
      camera.add(lightHelper);
      scene.add(camera);
    } else {
      const dirLight = scene.getObjectByName('back-highlight') as DirectionalLight;
      dirLight.color.set(dirLightColor);
      dirLight.position.set(dirLightPosition.x, dirLightPosition.y, dirLightPosition.z);

      const ambientLight = scene.getObjectByName('ambient-light') as AmbientLight;
      ambientLight.color.set(ambientLightColor);
      ambientLight.intensity = ambientLightIntensity;

      const spotLight = scene.getObjectByName('spot-light') as SpotLight;
      spotLight.color.set(spotLightColor);
      spotLight.angle = spotLightAngle;
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
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
