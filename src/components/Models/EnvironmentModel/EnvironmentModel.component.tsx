import React, { FC } from 'react';
import { useFallback, useGltfLoader, CustomNode, Transform } from 'src/services';
import { useGraph } from '@react-three/fiber';
import { BaseModelProps } from 'src/types';

export interface EnvironmentModelProps extends BaseModelProps {
  modelSrc: string | Blob;
  scale?: number;
}

export const EnvironmentModel: FC<EnvironmentModelProps> = ({ modelSrc, scale = 1, setModelFallback }) => {
  const { scene } = useGltfLoader(modelSrc);
  const { nodes } = useGraph(scene);

  useFallback(nodes, setModelFallback);
  const transform = new Transform();

  return (
    <group>
      {Object.keys(nodes).map((key) => {
        const node = nodes[key] as CustomNode;
        if (node.type === 'Mesh') {
          return (
            <mesh
              receiveShadow
              key={node.name}
              scale={scale}
              position={transform.position}
              rotation={transform.rotation}
              geometry={node.geometry}
              material={node.material}
              morphTargetInfluences={node.morphTargetInfluences || []}
            />
          );
        }

        return null;
      })}
    </group>
  );
};
