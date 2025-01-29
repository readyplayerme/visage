// @ts-nocheck
/* eslint-disable */

import { useFrame } from '@react-three/fiber';
import React, { FC, useEffect } from 'react';
import { useGltfLoader } from 'src/services';
import { AnimationMixer, LoopRepeat, MeshStandardMaterial, PropertyBinding } from 'three';

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

    // WIP index 0 track and only one animation in the list
    const material = PropertyBinding.findNode(scene, animations[0].tracks[0].name);

    const targetObjects = [];
    scene.traverse((object) => {
      if (object.isMesh && object.material === material) {
        targetObjects.push(object);
      } 
    });

    const targetObject = targetObjects[0];

    const mixer = new AnimationMixer(targetObject);
    const actions = animations.map((clip) => mixer.clipAction(clip));

    actions.forEach((action) => {
      for(const propertyMixer of action._propertyBindings) {
        propertyMixer.binding.node = propertyMixer.binding.rootNode;
      }

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
