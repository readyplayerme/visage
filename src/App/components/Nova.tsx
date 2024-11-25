import React, { useMemo } from 'react';
import { StatsGl } from '@react-three/drei';

import { Avatar, CAMERA } from 'src/components/Avatar';
import { emotions } from 'src/services/Stories.service';
import { SettingsPanel } from './SettingsPanel';

const idleUrl = 'https://readyplayerme-assets.s3.amazonaws.com/animations/nova-male-idle.glb';
const victoryUrl = 'https://readyplayerme-assets.s3.amazonaws.com/animations/nova-victory-03.glb';

const modelOneUrl =
  'https://avatars.readyplayer.me/673dc84d6874800e1db46095.glb?meshCompression=true&textureQuality=low&meshLOD=1&morphTargetsGroup=Basic expressions';
const modelTwoUrl =
  'https://avatars.readyplayer.me/673f109553f9ed9312fafe70.glb?meshCompression=true&textureQuality=low&meshLOD=1&morphTargetsGroup=Basic expressions';

const models: Record<string, string> = {
  one: modelOneUrl,
  two: modelTwoUrl
};

export const AvatarNova: React.FC = () => {
  const [activeAnimation, setActiveAnimation] = React.useState<string>('idle');
  const [modelSrc, setModelSrc] = React.useState<string>(models.one);

  const animations = useMemo(
    () => ({
      idle: idleUrl,
      victory: victoryUrl
    }),
    []
  );

  return (
    <>
      <SettingsPanel>
        <button type="button" onClick={() => setActiveAnimation('idle')}>
          Set idle animation
        </button>
        <button type="button" onClick={() => setActiveAnimation('victory')}>
          Set victory animation
        </button>
        <button type="button" onClick={() => setModelSrc(models.one)}>
          Set Model1
        </button>
        <button type="button" onClick={() => setModelSrc(models.two)}>
          Set Model2
        </button>
      </SettingsPanel>
      <Avatar
        modelSrc={modelSrc}
        emotion={emotions.smile}
        animations={animations}
        activeAnimation={activeAnimation}
        shadows
        style={{ background: 'rgb(9,20,26)' }}
        fov={45}
        cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
      >
        <StatsGl />
      </Avatar>
    </>
  );
};
