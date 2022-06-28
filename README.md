# Visage
A growing collection of react components for showcasing 3D on the web!

Built with [`three.js`](https://github.com/mrdoob/three.js), [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber), [`drei`](https://github.com/pmndrs/drei), [`three-stdlib`](https://github.com/pmndrs/three-stdlib)


## Installation

```
npm install @readyplayerme/visage
```

## Documentation

You can find all examples of components and their documentation on [our GitHub page](https://readyplayerme.github.io/visage/).

## Usage

```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Exhibit } from '@readyplayerme/visage';

function App() {
  return (
    <Exhibit modelUrl="/model.glb" />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

## Contributing
