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
  cameraSpotLightPosition,
  cameraSpotLightColor,
  cameraSpotLightAngle,
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

      const dirLightHelper = new DirectionalLightHelper(dirLight);
      dirLightHelper.name = 'dir-light-helper';

      const dirLightSphereGeometry = new SphereGeometry(0.2, 32, 16);
      const dirLightSphereMaterial = new MeshBasicMaterial({ color: 0x00fffff });
      const dirLightSphere = new Mesh(dirLightSphereGeometry, dirLightSphereMaterial);
      dirLightSphere.position.set(dirLight.position.x, dirLight.position.y, dirLight.position.z);
      dirLightSphere.name = 'dir-light-sphere';

      const ambientLight = new AmbientLight(ambientLightColor, ambientLightIntensity);
      ambientLight.name = 'ambient-light';
      ambientLight.position.set(0, 0, 0);

      const cameraSpotLight = new SpotLight(cameraSpotLightColor, 1, 0, cameraSpotLightAngle, 0, 1);
      cameraSpotLight.name = 'camera-spot-light';
      cameraSpotLight.position.set(cameraSpotLightPosition.x, cameraSpotLightPosition.y, cameraSpotLightPosition.z);
      cameraSpotLight.distance = 20;

      const cameraSpotLightHelper = new SpotLightHelper(cameraSpotLight);
      cameraSpotLightHelper.name = 'camera-spot-light-helper';

      const cameraSpotLightSphereGeometry = new SphereGeometry(0.2, 32, 16);
      const cameraSpotLightSphereMaterial = new MeshBasicMaterial({ color: 0xff0000 });
      const cameraSpotLightSphere = new Mesh(cameraSpotLightSphereGeometry, cameraSpotLightSphereMaterial);
      cameraSpotLightSphere.position.set(
        cameraSpotLight.position.x,
        cameraSpotLight.position.y,
        cameraSpotLight.position.z
      );
      cameraSpotLightSphere.name = 'camera-spot-light-sphere';

      scene.add(dirLight);
      scene.add(dirLightHelper);
      scene.add(dirLightSphere);
      scene.add(ambientLight);
      camera.add(cameraSpotLight);
      camera.add(cameraSpotLightHelper);
      camera.add(cameraSpotLightSphere);
      scene.add(camera);
    } else {
      const dirLight = scene.getObjectByName('back-highlight') as DirectionalLight;
      dirLight.color.set(dirLightColor);
      dirLight.position.set(dirLightPosition.x, dirLightPosition.y, dirLightPosition.z);
      const dirLightSphere = scene.getObjectByName('dir-light-sphere') as Mesh;
      dirLightSphere.position.set(dirLight.position.x, dirLight.position.y, dirLight.position.z);

      const ambientLight = scene.getObjectByName('ambient-light') as AmbientLight;
      ambientLight.color.set(ambientLightColor);
      ambientLight.intensity = ambientLightIntensity;

      const cameraSpotLight = scene.getObjectByName('camera-spot-light') as SpotLight;
      cameraSpotLight.color.set(cameraSpotLightColor);
      cameraSpotLight.angle = cameraSpotLightAngle;
      cameraSpotLight.position.set(cameraSpotLightPosition.x, cameraSpotLightPosition.y, cameraSpotLightPosition.z);
      const cameraSpotLightSphere = scene.getObjectByName('camera-spot-light-sphere') as Mesh;
      cameraSpotLightSphere.position.set(
        cameraSpotLight.position.x,
        cameraSpotLight.position.y,
        cameraSpotLight.position.z
      );
    }
  }, [
    ambientLightColor,
    ambientLightIntensity,
    dirLightPosition,
    dirLightColor,
    cameraSpotLightPosition,
    cameraSpotLightColor,
    cameraSpotLightAngle,
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
