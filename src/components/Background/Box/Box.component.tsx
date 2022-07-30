import React, {FC, useRef} from "react";
import {Mesh, TextureLoader} from "three";
import {useFrame, useLoader} from "@react-three/fiber";
import {Background} from "../../Avatar/Avatar.component";

const Box: FC<Background> = ({ src = '', ...baseProps }) => {
  const ref = useRef<Mesh>();
  const texture = useLoader(TextureLoader, src);

  useFrame( () => {
    if (ref && ref.current && ref.current.rotation && ref.current?.rotation.y) {
      ref.current.rotation.y += .01
    }
  });

  return (
    <mesh ref={ref} castShadow receiveShadow {...baseProps}>
      {/* @ts-ignore */}
      <boxBufferGeometry camera={{ position: [3, 3, 10] }}/>
      <meshPhysicalMaterial map={texture} />
      <axesHelper />
    </mesh>
  );
};

export default Box;