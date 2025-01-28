// @ts-nocheck
/* eslint-disable */

import { useFrame } from '@react-three/fiber';
import React, { FC, useEffect } from 'react';
import { useGltfLoader } from 'src/services';
import { AnimationMixer, LoopRepeat, MeshStandardMaterial } from 'three';

export interface AnimatedMaterialModelProps {
  modelSrc: string | Blob;
  scale?: number;
}

export const AnimatedMaterialModel: FC<AnimatedMaterialModelProps> = ({
  modelSrc,
}) => {
  const { scene, animations } = useGltfLoader(modelSrc);
  const [mixer, setMixer] = React.useState<AnimationMixer | null>(null);

  console.log("render: ", {mixer: Boolean(mixer)});

  useEffect(() => {
    if(!animations) return;

    const customObjects = [];
    scene.traverse((object) => {
      if (object.isMesh && object.name === "custom") {
        customObjects.push(object);
      }
    });

    console.log("custom objects:", customObjects);

    const targetObject = customObjects[0];
    console.log("target object name:", targetObject.name);

    const mixer = new AnimationMixer(targetObject);

    const actions = animations.map((clip) => 
      mixer.clipAction(clip)
    );

    actions.forEach((action) => {     
      for(const propertyMixer of action._propertyBindings) {
        propertyMixer.binding.node = targetObject;
      }

      console.log("action:", action);

      action.setLoop(LoopRepeat);
      action.play();
    });

    setMixer(mixer);
  }, [animations]);

  useFrame((state, delta) => {
    if(!mixer) return;

    mixer.update(delta);

    /*
    scene.traverse((object) => {
        if (object.isMesh) {
            const material = object.material as MeshStandardMaterial;
            material.needsUpdate = true;    

            // console.log("material uv:", material.map?.offset);
        }
        });
        */
  });

  return (
    <group>
      <primitive object={scene}/>
    </group>
  );
};
