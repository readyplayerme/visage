import React, { useState } from 'react';
import { Avatar } from 'src/components/Avatar';
import { Sparkles, StatsGl } from '@react-three/drei';
import { EnvironmentModel } from '../components/Models';
import styles from './App.module.scss';

function App() {
  const [model, setModel] = useState('64d61e9e17883fd73ebe5eb7');
  const models = ['64d61e9e17883fd73ebe5eb7', '64b650ef27e920b1c5ff9416'];
  const getRandomValueFromArray = (arr: string | any[]) => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };

  setInterval(() => {
    const newModel = getRandomValueFromArray(models);
    console.log(newModel);
    setModel(newModel);
  }, 5000);
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
            modelSrc={`https://models.readyplayer.me/${model}.glb?morphTargets=ARKit,Eyes Extra&textureAtlas=none&lod=0`}
            shadows
            animationSrc="/male-idle-2.fbx"
            style={{ background: 'rgb(9,20,26)' }}
            onLoaded={() => console.log('female avatar loaded')}
            fov={45}
            ambientLightIntensity={0}
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
}

export default App;
