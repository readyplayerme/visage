import React from 'react';
import { Sparkles, StatsGl } from '@react-three/drei';

import { Avatar } from 'src/components/Avatar';
import { EnvironmentModel } from 'src/components/Models';

import { SettingsPanel } from './SettingsPanel';

export const AvatarDevelop: React.FC = () => (
  <>
    <SettingsPanel />
    <Avatar
      modelSrc="https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?morphTargets=ARKit,Eyes Extra&textureAtlas=none&lod=0"
      shadows
      animationSrc="/male-idle-2.fbx"
      style={{ background: 'rgb(9,20,26)' }}
      fov={45}
      effects={{
        ambientOcclusion: true
      }}
    >
      <StatsGl />
      <EnvironmentModel environment="spaceStation" scale={1} />
      <Sparkles count={70} scale={3} size={3} speed={1} opacity={0.04} color="#ccff00" />
    </Avatar>
  </>
);