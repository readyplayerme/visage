import { FC, useEffect, useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { AnimationMixer, Object3D } from 'three';

type AnimatedCameraProps = {
  animatedCameraSrc: string;
};

export const AnimatedCamera: FC<AnimatedCameraProps> = ({ animatedCameraSrc }) => {
  const { camera } = useThree();
  const { scene, animations } = useGLTF(animatedCameraSrc);
  const mixerRef = useRef<AnimationMixer | null>(null);
  const [animatedCamera, setAnimatedCamera] = useState<Object3D | null>(null);
  // const [animatedArmature, setAnimatedArmature] = useState<Object3D | null>(null);

  useEffect(() => {
    if (animations.length > 0) {
      mixerRef.current = new AnimationMixer(scene);
      animations.forEach((clip) => {
        const action = mixerRef.current!.clipAction(clip);
        action.play();
      });
    }

    const cam = scene.getObjectByName('camera') as Object3D;
    if (cam) setAnimatedCamera(cam);

    // const armature = scene.getObjectByName('Armature') as Object3D;
    // if (armature) setAnimatedArmature(armature);

  }, [scene, animations]);

  useFrame((_, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }

    if (animatedCamera) {
      camera.position.copy(animatedCamera.position);
      camera.quaternion.copy(animatedCamera.quaternion);
      camera.rotateZ(Math.PI);
    }
  });

  return null;
};
