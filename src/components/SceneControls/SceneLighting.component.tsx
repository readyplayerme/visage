import { useEffect, FC } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { SpotLight, SphereGeometry, MeshBasicMaterial, Mesh, SpotLightHelper } from 'three';
import { LightingPropsScene } from 'src/types';

type SceneLightingProps = Required<LightingPropsScene> & {};

export const SceneLighting: FC<SceneLightingProps> = ({
  spotLight1Position,
  spotLight1Color,
  spotLight1Angle,
  spotLight1Distance,
  showSpotLight1
}) => {
  const { scene } = useThree();
  useEffect(() => {
    if (!scene.getObjectByName('spot-light-1')) {
      const spotLight1 = new SpotLight(spotLight1Color, 1, 0, spotLight1Angle, 0, 1);
      spotLight1.name = 'spot-light-1';
      spotLight1.position.set(spotLight1Position.x, spotLight1Position.y, spotLight1Position.z);
      spotLight1.distance = spotLight1Distance;

      const spotLight1Helper = new SpotLightHelper(spotLight1);
      spotLight1Helper.name = 'spot-light-1-helper';

      const spotLight1SphereGeometry = new SphereGeometry(0.2, 32, 16);
      const spotLight1SphereMaterial = new MeshBasicMaterial({ color: spotLight1Color });
      const spotLight1Sphere = new Mesh(spotLight1SphereGeometry, spotLight1SphereMaterial);
      spotLight1Sphere.position.set(spotLight1.position.x, spotLight1.position.y, spotLight1.position.z);
      spotLight1Sphere.name = 'spot-light-1-sphere';
      scene.add(spotLight1);
      scene.add(spotLight1Helper);
      scene.add(spotLight1Sphere);
      if (showSpotLight1 === true) {
        spotLight1.visible = true;
        spotLight1Sphere.visible = true;
      } else {
        spotLight1.visible = false;
        spotLight1Sphere.visible = false;
      }
    } else {
      const spotLight1 = scene.getObjectByName('spot-light-1') as SpotLight;
      spotLight1.color.set(spotLight1Color);
      spotLight1.angle = spotLight1Angle;
      spotLight1.position.set(spotLight1Position.x, spotLight1Position.y, spotLight1Position.z);
      const spotLight1Sphere = scene.getObjectByName('spot-light-1-sphere') as Mesh;
      spotLight1Sphere.position.set(spotLight1.position.x, spotLight1.position.y, spotLight1.position.z);
      const spotLight1SphereMaterial = new MeshBasicMaterial({ color: spotLight1Color });
      spotLight1Sphere.material = spotLight1SphereMaterial;
      if (showSpotLight1 === true) {
        spotLight1.visible = true;
        spotLight1Sphere.visible = true;
      } else {
        spotLight1.visible = false;
        spotLight1Sphere.visible = false;
      }
    }
  }, [spotLight1Position, spotLight1Color, spotLight1Angle, scene]);

  useFrame(() => {
    const spotLight1 = scene.getObjectByName('spot-light-1') as SpotLight;
    const spotLight1Sphere = scene.getObjectByName('spot-light-1-sphere') as Mesh;
    const spotLight1Helper = scene.getObjectByName('spot-light-1-helper') as SpotLightHelper;
    if (showSpotLight1 === true) {
      spotLight1.visible = true;
      spotLight1Sphere.visible = true;
    } else {
      spotLight1.visible = false;
      spotLight1Sphere.visible = false;
    }
    spotLight1.angle = spotLight1Angle;
    spotLight1.distance = spotLight1Distance;
    spotLight1Helper.update();
  });

  return null;
};
