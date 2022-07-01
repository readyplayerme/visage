import { useEffect, FC } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
  Camera,
  Vector3,
  DirectionalLight,
  AmbientLight,
  SpotLight,
  BufferGeometry,
  Line,
  LineBasicMaterial,
  SphereGeometry,
  MeshBasicMaterial,
  Mesh,
  EllipseCurve,
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

      const dirLightLineMaterial = new LineBasicMaterial({ color: 0x00ffff });
      const dirLightLinePoints = [];
      dirLightLinePoints.push(dirLightPosition);
      dirLightLinePoints.push(dirLight.target.position);
      const dirLightLineGeometry = new BufferGeometry().setFromPoints(dirLightLinePoints);
      const dirLightLine = new Line(dirLightLineGeometry, dirLightLineMaterial);
      dirLightLine.name = 'dir-light-line';

      const ambientLight = new AmbientLight(ambientLightColor, ambientLightIntensity);
      ambientLight.name = 'ambient-light';
      ambientLight.position.set(0, 0, 0);

      const spotLight = new SpotLight(spotLightColor, 1, 0, spotLightAngle, 0, 1);
      spotLight.name = 'spot-light';
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
      spotLight.distance = 20;
      // spotLight.castShadow = true;

      const lightHelper = new SpotLightHelper(spotLight);

      const spotLightLineMaterial = new LineBasicMaterial({ color: 0x0000ff });
      const spotLightLinePoints = [];
      spotLightLinePoints.push(spotLightPosition);
      spotLightLinePoints.push(new Vector3());
      const spotLightLineGeometry = new BufferGeometry().setFromPoints(spotLightLinePoints);
      const spotLightLine = new Line(spotLightLineGeometry, spotLightLineMaterial);
      spotLightLine.name = 'spot-light-line';
      const geometry = new SphereGeometry(0.2, 32, 16);
      const material = new MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new Mesh(geometry, material);
      sphere.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);
      sphere.name = 'spot-light-sphere';

      const spotLightBoxMaterial = new LineBasicMaterial({ color: 0x00ff00 });
      let boxLength = 2;
      if (spotLight.distance > 0) {
        boxLength = spotLight.distance;
      }
      const radius = boxLength * Math.tan(spotLight.angle);

      const boxLengthVector = new Vector3(boxLength, boxLength, boxLength);
      // const radiusVector = new Vector3(radius, radius, radius);
      const directionVector = new Vector3(0, 0, 0).sub(spotLightPosition.clone()).normalize();
      const startPos = spotLightPosition.clone();
      // startPos = new Vector3();
      const forwardPos = startPos.clone().add(directionVector.clone().multiply(boxLengthVector));

      const spotLightBoxPoints = [];
      spotLightBoxPoints.push(startPos.clone());
      spotLightBoxPoints.push(forwardPos.clone().multiply(boxLengthVector));
      // spotLightBoxPoints.push(startPos.clone());
      // spotLightBoxPoints.push(forwardPos.clone().multiply(boxLengthVector).add(startPos.clone().add(new Vector3(-directionVector.z, 0, directionVector.x)).multiply(radiusVector).multiply(boxLengthVector)));
      // spotLightBoxPoints.push(startPos.clone());
      // spotLightBoxPoints.push(forwardPos.clone().multiply(boxLengthVector).add(startPos.clone().add(new Vector3(-directionVector.z, 0, directionVector.x)).negate().multiply(radiusVector).multiply(boxLengthVector)));
      // spotLightBoxPoints.push(startPos.clone());
      // spotLightBoxPoints.push(forwardPos.clone().multiply(boxLengthVector).add(startPos.clone().add(new Vector3(directionVector.y, -directionVector.x, directionVector.z)).multiply(radiusVector).multiply(boxLengthVector)));
      // spotLightBoxPoints.push(startPos.clone());
      // spotLightBoxPoints.push(forwardPos.clone().multiply(boxLengthVector).add(startPos.clone().add(new Vector3(directionVector.y, -directionVector.x, directionVector.z)).negate().multiply(radiusVector).multiply(boxLengthVector)));
      const spotLightBoxGeometry = new BufferGeometry().setFromPoints(spotLightBoxPoints);
      const spotLightBox = new Line(spotLightBoxGeometry, spotLightBoxMaterial);
      spotLightBox.name = 'spot-light-box';

      const curve = new EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);

      const elipsePoints = curve.getPoints(50);
      const elipseGeometry = new BufferGeometry().setFromPoints(elipsePoints);
      const elipseMaterial = new LineBasicMaterial({ color: 0xff0000 });

      const ellipse = new Line(elipseGeometry, elipseMaterial);
      ellipse.position.set(forwardPos.x, forwardPos.y, forwardPos.z);
      ellipse.lookAt(new Vector3(startPos.x, startPos.y, startPos.z));
      ellipse.name = 'spot-light-ellipse';

      scene.add(ambientLight);
      scene.add(dirLight);
      // scene.add(dirLightLine);
      // scene.add(spotLightBox);
      // scene.add(ellipse);
      // scene.add(spotLightLine);
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
