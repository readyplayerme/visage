import React, { useMemo, useState, FC } from 'react';
import { StatsGl } from '@react-three/drei';

import { Avatar, CAMERA } from 'src/components/Avatar';
// import { emotions } from 'src/services/Stories.service';
// import { Vector3 } from 'three';
import { SettingsPanel } from './SettingsPanel';

// const getAnimation = (name: string) => `https://readyplayerme-assets.s3.amazonaws.com/animations/${name}.glb`;
// const getAnimationNexus = (name: string) =>
//   `https://readyplayerme-assets.s3.amazonaws.com/nexus/animations/${name}.glb`;
// const LIGHT_INTENSITY = 50.0;
// const CAMERA_DISTANCE = 0.05;
const modelSrc = 'https://avatars.readyplayer.dev/675aa4ded65bc4b9fbc4808a.glb';

type AnimationKeys = 'idle' | 'land';

export const AvatarNova: FC = () => {
  const animations = useMemo(
    () => ({
      idle: {
        source: '/take_002_iddle_out.glb'
      },
      land: {
        source: '/take_002.glb',
        repeat: 1
      }
    }),
    []
  );

  const [activeAnimation, setActiveAnimation] = useState<AnimationKeys>('idle');

  return (
    <div style={{ width: '100%', height: '100%', background: '#444' }}>
      <SettingsPanel>
        {Object.keys(animations).map((name) => (
          <button key={name} type="button" onClick={() => setActiveAnimation(name as AnimationKeys)}>
            Set {name} animation
          </button>
        ))}
      </SettingsPanel>
      <Avatar
        controlsMinDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
        controlsMaxDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
        modelSrc={modelSrc}
        // emotion={emotions.smile}
        animations={animations}
        activeAnimation={activeAnimation}
        shadows
        animatedCameraSrc={activeAnimation === 'land' ? animations[activeAnimation].source : undefined}
        onAnimationEnd={() => setActiveAnimation('idle')}
        fov={45}
        cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
        effects={{
          ambientOcclusion: false
        }}
      >
        <StatsGl />
      </Avatar>
    </div>
  );
};
