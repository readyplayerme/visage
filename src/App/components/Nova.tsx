import React from 'react';
import { StatsGl } from '@react-three/drei';

import { Avatar, CAMERA } from 'src/components/Avatar';
import { emotions } from 'src/services/Stories.service';
import { SettingsPanel } from './SettingsPanel';

const idleUrl = 'https://readyplayerme-assets.s3.amazonaws.com/animations/nova-male-idle.glb';
const victoryUrl = 'https://readyplayerme-assets.s3.amazonaws.com/animations/nova-victory-03.glb';

const animations: Record<string, string> = {
  idle: idleUrl,
  victory: victoryUrl
};

const modelOneUrl =
  'https://api.readyplayer.dev/v3/avatars/66fa76b8fdea89a183c01341.glb?meshCompression=true&textureQuality=low&meshLOD=1&morphTargetsGroup=Basic expressions';
const modelTwoUrl =
  'https://api.readyplayer.dev/v3/avatars/66fa77cbfdea89a183c0134d.glb?meshCompression=true&textureQuality=low&meshLOD=1&morphTargetsGroup=Basic expressions';

const models: Record<string, string> = {
  one: modelOneUrl,
  two: modelTwoUrl
};

export const AvatarNova: React.FC = () => {
  const [activeAnimation, setActiveAnimation] = React.useState<string>('idle');
  const [modelSrc, setModelSrc] = React.useState<string>(models.one);

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
