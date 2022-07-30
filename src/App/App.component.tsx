import React, {useMemo, useState} from 'react';
import {Avatar} from 'src/components/Avatar';
import './App.scss';
import {Emotion} from "../components/Avatar/Avatar.component";

const emotions: Record<string, Emotion | undefined> = {
  z: undefined,
  a: {
    eyeWideLeft: 0.825,
    eyeWideRight: 0.5,
    jawOpen: 0.123,
    mouthFunnel: 0.442,
    browInnerUp: 0.6,
    mouthShrugLower: 0.385,
    browDownLeft: 0.842,
    browDownRight: 0.6
  },
  b: {
    mouthDimpleLeft: 0.48,
    mouthShrugLower: 0.385,
    eyeSquintLeft: 0.63,
    eyeSquintRight: 0.614,
    browDownLeft: 0.842,
    browDownRight: 0.56,
    noseSneerLeft: 0.3,
    noseSneerRight: 0.3
  },
  c: {
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.2,
    mouthSmileLeft: 0.37,
    mouthSmileRight: 0.36,
    mouthShrugUpper: 0.27,
    browInnerUp: 0.3,
    browOuterUpLeft: 0.37,
    browOuterUpRight: 0.49
  },
  d: {
    eyeSquintLeft: 0.6,
    eyeSquintRight: 0.53,
    jawOpen: 0.035,
    mouthSmileLeft: 0.5,
    mouthSmileRight: 0.5,
    mouthShrugUpper: 0.27,
    browInnerUp: 0.16,
    browOuterUpLeft: 0.45,
    browOuterUpRight: 0.35
  },
  e: {
    eyeWideLeft: 0.5,
    eyeWideRight: 0.4,
    mouthPucker: 0.19,
    mouthFrownLeft: 0.6,
    mouthFrownRight: 0.6,
    mouthRollLower: 0.33,
    mouthRollUpper: 0.02,
    mouthShrugLower: 0.4,
    browInnerUp: 0.78,
    noseSneerLeft: 0.115,
    noseSneerRight: 0.1
  }
};

const bgs = [
  undefined,
  "/rpm-bg-nature-02.jpg",
  "/rpm-bg-city-00.jpg",
  "/rpm-bg-simple-dark.jpg",
  "/rpm-bg-simple-light.jpg",
]

function App() {
  const [emotion, setEmotion] = useState<string>();
  const [bg, setBg] = useState<string | undefined>(bgs[0]);
  const blendShape = useMemo(() => emotions[emotion as string], [emotion])
  const [capture, setCapture] = useState(false)

  return (
    <div className="App">
      <div className="settings">
        <div className="wrapper">
          <h3 className="title">localhost playground</h3>
          <div className="content">
            <button onClick={() => setCapture(prevState => !prevState)}>Take Capture</button>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {Object.keys(emotions).map((key) => (
                <div
                  key={key}
                  style={{ color: emotion === key ? 'red' : "black" , padding: '10px', background: "grey", cursor: 'pointer'}}
                  onClick={() => setEmotion(key)}
                >
                  {key}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {bgs.map((it) => (
                <div
                  key={it}
                  style={{ color: emotion === it ? 'red' : "black" , padding: '10px', background: "grey", cursor: 'pointer'}}
                  onClick={() => setBg(it)}
                >
                  {it}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="card" style={{width: '100%'}}>
          <Avatar
            background={{
              src: bg,
              position: [0, 0.75, -2],
              scale: 3
            }}
            capture={capture}
            emotion={blendShape}
            modelUrl="https://d1a370nemizbjq.cloudfront.net/9f87424f-cb9b-415c-9742-15ece4bc05c5.glb"
            poseUrl="/male-pose-standing.glb"
            backgroundColor="#fafafa"
            shadows={false}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
