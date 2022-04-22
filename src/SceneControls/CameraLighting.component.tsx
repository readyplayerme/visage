import { useEffect, FC } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Camera, Vector3, DirectionalLight, AmbientLight, SpotLight } from 'three';
import { OrbitControls } from 'three-stdlib';
import { clamp, lerp } from 'src/helpers';
import { GeneralLightingProps, Required } from 'src/types';

type CameraLightingProps = Required<GeneralLightingProps> & {
  fullBody?: boolean;
  gender?: string;
  headScale?: number;
  camTarget?: BodyTypeNumber;
  initialCamDistance?: BodyTypeNumber;
};

interface BodyTypeNumber {
  halfBody: number;
  fullBody: number;
}

let fullBodyMinDist = 0.5;
const fullBodyMaxDist = 2.5;

const halfBodyMinDist = 0.5;
const halfBodyMaxDist = 1.4;

let controls: any;
let progress = Number.POSITIVE_INFINITY;

const bodyZoomFullbody = new Vector3(-0.51, 0, 2.41);

const updateCameraFocus = (camera: Camera, delta: number) => {
  const target = bodyZoomFullbody;

  if (progress <= 1) {
    camera.position.setX(lerp(camera.position.x, target.x, progress));
    camera.position.setZ(lerp(camera.position.z, target.z, progress));
    progress += delta;
  }
};

const updateCameraTarget = (camera: Camera, target: number, fullBody?: boolean) => {
  if (controls && fullBody) {
    let distance = controls.target.distanceTo(camera.position);
    distance = clamp(distance, fullBodyMaxDist, fullBodyMinDist);
    const pivot = (distance - fullBodyMinDist) / (fullBodyMaxDist - fullBodyMinDist);

    controls.target.set(0, target - 0.6 * pivot, 0);
  }
};

export const CameraLighting: FC<CameraLightingProps> = ({
  fullBody,
  gender,
  camTarget,
  initialCamDistance,
  headScale = 1,
  ambientLightColor,
  ambientLightIntensity,
  dirLightPosition,
  dirLightColor,
  secondaryDirLightPosition,
  secondaryDirLightColor,
  spotLightPosition,
  spotLightColor,
  spotLightAngle
}) => {
  const { camera, gl, scene } = useThree();
  const camTargetValue = camTarget?.fullBody || 1.475 + headScale / 10;
  const fullbodyCamTarget = gender === 'male' ? camTargetValue + 0.075 : camTargetValue;

  useEffect(() => {
    controls = new OrbitControls(camera, gl.domElement);
    controls.enablePan = false;

    fullBodyMinDist += headScale / 10;

    controls.minDistance = fullBody ? fullBodyMinDist : halfBodyMinDist;
    controls.maxDistance = fullBody ? fullBodyMaxDist : halfBodyMaxDist;

    controls.minPolarAngle = 1.4;
    controls.maxPolarAngle = 1.4;

    const sceneHasLighting = scene.getObjectByName('DirectionalLight') as DirectionalLight;

    if (!sceneHasLighting) {
      const dirLight = new DirectionalLight(dirLightColor, 0.001);
      dirLight.name = 'front-highlight';
      dirLight.shadow.bias = -0.0001;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.castShadow = true;
      dirLight.position.set(dirLightPosition?.x, dirLightPosition?.y, dirLightPosition?.z);
      dirLight.shadow.camera.far = 50;
      dirLight.shadow.camera.left = -10;
      dirLight.shadow.camera.right = 10;
      dirLight.shadow.camera.top = 10;
      dirLight.shadow.camera.bottom = -10;

      const backDirLight = new DirectionalLight(secondaryDirLightColor, 5);
      backDirLight.name = 'back-highlight';
      backDirLight.position.set(secondaryDirLightPosition.x, secondaryDirLightPosition.y, secondaryDirLightPosition.z);
      backDirLight.castShadow = true;
      backDirLight.shadow.bias = -0.0001;
      backDirLight.shadow.mapSize.height = 1024;
      backDirLight.shadow.mapSize.width = 1024;
      backDirLight.shadow.blurSamples = 100;

      const ambientLight = new AmbientLight(ambientLightColor, ambientLightIntensity);
      ambientLight.position.set(0, 0, 0);

      const spotLight = new SpotLight(spotLightColor, 1, 0, spotLightAngle, 0, 1);
      spotLight.position.set(spotLightPosition.x, spotLightPosition.y, spotLightPosition.z);

      camera.add(ambientLight);
      camera.add(spotLight);
      camera.add(dirLight);
      camera.add(backDirLight);

      scene.add(camera);
    }

    controls.target.set(0, fullbodyCamTarget, 0);
    controls.update();

    if (initialCamDistance) {
      camera.position.z = initialCamDistance.fullBody;
      controls.update();
    }

    return () => {
      controls.dispose();
    };
  }, [fullBody, gender]);

  useFrame((_, delta) => {
    updateCameraTarget(camera, fullbodyCamTarget, fullBody);
    updateCameraFocus(camera, delta);
    controls.update();
  });

  return null;
};
