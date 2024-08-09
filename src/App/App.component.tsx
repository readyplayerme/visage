import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { Avatar, CAMERA } from 'src/components/Avatar';

import { Sparkles, StatsGl } from '@react-three/drei';
import { EnvironmentModel } from 'src/components/Models';
import styles from './App.module.scss';

const AvatarDevelop: React.FC = () => (
  <div className={styles.app}>
    <div className={styles.settings}>
      <div className={styles.wrapper}>
        <h3 className={styles.title}>localhost playground</h3>
        <div className={styles.content}>
          Drop your content in there to test the avatar props without shrinking the canvas
        </div>
      </div>
    </div>
    <div className={styles.container}>
      <div className={styles.card}>
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
      </div>
    </div>
  </div>
);

const AvatarTest: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const modelUrl = urlParams.get('modelUrl')
    ? decodeURIComponent(urlParams.get('modelUrl') || '')
    : 'https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?morphTargets=ARKit,Eyes Extra&textureAtlas=none&lod=0';
  const zoomLevel = urlParams.get('zoomLevel')
    ? parseFloat(urlParams.get('zoomLevel') || '1')
    : CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE;

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <div className={styles.card}>
          <Avatar
            modelSrc={modelUrl}
            shadows
            style={{ background: 'rgb(9,20,26)' }}
            fov={45}
            cameraInitialDistance={zoomLevel}
            effects={{
              ambientOcclusion: true
            }}
          />
        </div>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <AvatarDevelop />
  },
  {
    path: '/test',
    element: <AvatarTest />
  }
]);

const App: React.FC = () => <RouterProvider router={router} />;

export default App;
