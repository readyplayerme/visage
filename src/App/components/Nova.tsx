import React from 'react';

import { Avatar, CAMERA } from 'src/components/Avatar';
import { SettingsPanel } from './SettingsPanel';

const idleUrl = 'https://readyplayerme-assets.s3.amazonaws.com/animations/nova-male-idle.glb';
const victoryUrl = 'https://readyplayerme-assets.s3.amazonaws.com/animations/nova-victory-03.glb';
const modelUrl = 'https://api.readyplayer.dev/v3/avatars/66e2cecfbd5d3e60f8cdbde5.glb';

const animations: Record<string, string> = {
  idle: idleUrl,
  victory: victoryUrl
};

export const AvatarNova: React.FC = () => {
  const [activeAnimation, setActiveAnimation] = React.useState<string>('idle');

  return (
    <>
      <SettingsPanel>
        <button type="button" onClick={() => setActiveAnimation('idle')}>
          Set idle animation
        </button>
        <button type="button" onClick={() => setActiveAnimation('victory')}>
          Set victory animation
        </button>
      </SettingsPanel>
      <Avatar
        modelSrc={modelUrl}
        animationSrc={animations[activeAnimation]}
        shadows
        style={{ background: 'rgb(9,20,26)' }}
        fov={45}
        cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
      />
    </>
  );
};