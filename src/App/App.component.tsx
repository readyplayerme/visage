import React from 'react';
import { Avatar } from 'src/components/Avatar';
import { Sparkles, Stats, StatsGl } from '@react-three/drei';
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
            poseSrc="/male-pose-standing.glb"
            animationSrc="/male-idle.glb"
            shadows={false}
            onLoadedEffect={{
              src: '/spawn-effect.glb',
              loop: 13
            }}
            onLoadedAnimation={{
              src: '/male-spawn-animation.fbx'
            }}
            style={{ background: 'rgb(9,20,26)' }}
            onLoaded={() => console.log('male avatar loaded')}
          >
            <Stats showPanel={2} />
            <StatsGl className={styles.stats} />
          </Avatar>
        </div>
        <div className={styles.card}>
          <Avatar
            modelSrc="/female.glb"
            poseSrc="/female-pose-standing.glb"
            shadows={false}
            animationSrc="/female-animation-catwalk.glb"
            style={{ background: 'rgb(9,20,26)' }}
            onLoaded={() => console.log('female avatar loaded')}
          >
            <Sparkles count={70} scale={3} size={3} speed={1} opacity={0.04} color="#ccff00" />
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default App;
