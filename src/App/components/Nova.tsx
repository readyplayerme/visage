import React, { useMemo, useState, FC } from 'react';
import { StatsGl } from '@react-three/drei';

import { Avatar, CAMERA } from 'src/components/Avatar';
import { emotions } from 'src/services/Stories.service';
import { SettingsPanel } from './SettingsPanel';

const getAnimation = (name: string) => `https://readyplayerme-assets.s3.amazonaws.com/animations/${name}.glb`;
const getAnimationNexus = (name: string) =>
  `https://readyplayerme-assets.s3.amazonaws.com/nexus/animations/${name}.glb`;

const modelSrc = 'https://avatars.readyplayer.dev/673b3cf27b275e2ca5be2800.glb';

export const AvatarNova: FC = () => {
  const [activeAnimation, setActiveAnimation] = useState<string>('idle');

  const animations = useMemo(
    () => ({
      idle: getAnimation('nova-male-idle'),
      victory: getAnimation('nova-victory-03'),
      idle5: getAnimationNexus('compressed_idle_nova_5'),
      idle53: getAnimationNexus('compressed_idle_nova_53'),
      idle7: getAnimationNexus('compressed_idle_nova_7'),
      idle80: getAnimationNexus('compressed_idle_nova_80'),
      top: getAnimation('novamale_changetopwear_v001'),
      bottom: getAnimation('novamale_changebottomwear_01_v001'),
      foot: getAnimation('NovaMale_ChangeFootwear_v002')
    }),
    []
  );

  return (
    <>
      <SettingsPanel>
        {Object.keys(animations).map((name) => (
          <button key={name} type="button" onClick={() => setActiveAnimation(name)}>
            Set {name} animation
          </button>
        ))}
      </SettingsPanel>
      <Avatar
        modelSrc={modelSrc}
        emotion={emotions.smile}
        animations={animations}
        activeAnimation={activeAnimation}
        shadows
        onAnimationEnd={(action) => action}
        style={{ background: 'rgb(9,20,26)' }}
        fov={45}
        cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
      >
        <StatsGl />
      </Avatar>
    </>
  );
};
