import React, { FC } from "react";
import { Color, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { Transform } from "src/services";

export type RadialGradientProps = {
  startColor: string;
  endColor: string;
}

export const RadialGradient: FC<RadialGradientProps> = ({ startColor, endColor }) => {
  const transform = new Transform();
  const backgroundGeometry = new PlaneGeometry(2, 2);
  const backgroundMaterial = new ShaderMaterial({
    uniforms: {
      color1: { value: new Color(startColor) },
      color2: { value: new Color(endColor) },
      ratio: { value: window.innerWidth / window.innerHeight }
    },
    vertexShader: `varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position, 1.);
      }`,
    fragmentShader: `varying vec2 vUv;
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float ratio;
        void main(){
        	vec2 uv = (vUv - 0.5) * vec2(ratio, 1.);
          gl_FragColor = vec4( mix( color1, color2, length(uv)), 1. );
        }`
  })

  const backgroundMesh = new Mesh(backgroundGeometry, backgroundMaterial);

  return (
    <mesh
      receiveShadow
      scale={1}
      position={transform.position}
      rotation={transform.rotation}
      geometry={backgroundMesh.geometry}
      material={backgroundMesh.material}
      morphTargetInfluences={backgroundMesh.morphTargetInfluences || []}
    />
  )
}
