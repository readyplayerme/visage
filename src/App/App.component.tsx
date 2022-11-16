import React from 'react';
import { Avatar } from 'src/components/Avatar';
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
            shadows={false}
            onLoaded={() => console.log('male avatar loaded')}
          />
        </div>
        <div className={styles.card}>
          <Avatar
            modelSrc="/female.glb"
            poseSrc="/female-pose-standing.glb"
            shadows={false}
            onLoaded={() => console.log('female avatar loaded')}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
