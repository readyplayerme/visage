import React from 'react';
import { Avatar } from 'src/components/Avatar';
import { Sparkles, StatsGl } from '@react-three/drei';
import {EffectComposer, SSAO} from "@react-three/postprocessing";
import {BlendFunction} from "postprocessing";
import { EnvironmentModel } from '../components/Models';
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
            modelSrc="/male.glb"
            shadows
            animationSrc="/M_Standing_Idle_Variations_002.fbx"
            style={{ background: 'red' }}
            onLoaded={() => console.log('female avatar loaded')}
            fov={45}
            ambientLightIntensity={0}

            effectComposer={<SSAO
                blendFunction={BlendFunction.NORMAL} // blend mode
                samples={30} // amount of samples per pixel (shouldn't be a multiple of the ring count)
                rings={1} // amount of rings in the occlusion sampling pattern
                intensity={1} worldDistanceThreshold={10} worldDistanceFalloff={10} worldProximityThreshold={10}
                worldProximityFalloff={20}
            />}
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
