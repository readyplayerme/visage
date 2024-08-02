import React from 'react';
import { StatsGl } from '@react-three/drei';

import { Avatar, CAMERA } from 'src/components/Avatar';

import styles from './App.module.scss';

function App() {
  return (
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
            modelSrc="https://api.readyplayer.dev/v3/avatars/66a8c2c63577d83a8ee86378.glb"
            shadows
            style={{ background: 'rgb(9,20,26)' }}
            fov={45}
            effects={{
              ambientOcclusion: true
            }}
            cameraTarget={CAMERA.TARGET.FULL_BODY.FEMALE}
            cameraInitialDistance={CAMERA.CONTROLS.FULL_BODY.MAX_DISTANCE}
          >
            <StatsGl />
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default App;
