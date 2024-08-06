import React from 'react';

import styles from './App.module.scss';
import EditorComponent from './Editor.component';

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
          <EditorComponent/>
        </div>
      </div>
    </div>
  );
}

export default App;
