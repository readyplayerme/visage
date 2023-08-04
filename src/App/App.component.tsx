import React from 'react';
import { Avatar } from 'src/components/Avatar';
import { Sparkles } from '@react-three/drei';
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
            onLoaded={() => console.log('male avatar loaded')}
          />
        </div>
        <div className={styles.card}>
          <Avatar
            modelSrc="/female.glb"
            poseSrc="/female-pose-standing.glb"
            shadows={false}
            animationSrc="/female-animation-catwalk.glb"
            onLoadedEffect={{
              src: '/spawn-effect.glb',
              loop: 13
            }}
            onLoadedAnimation={{
              src: '/female-animation-chicken.glb'
            }}
            onLoaded={() => console.log('female avatar loaded')}
          >
            <Sparkles count={70} scale={3} size={3} speed={1} opacity={0.1} />
          </Avatar>
        </div>
      </div>
    </div>
  );
}

export default App;
