# Visage
Visage is a collection of components for showcasing Ready Player Me avatars and 3D on the web!

Built with [`three.js`](https://github.com/mrdoob/three.js), [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber), [`drei`](https://github.com/pmndrs/drei), [`three-stdlib`](https://github.com/pmndrs/three-stdlib) and [`react`](https://github.com/facebook/react/).

# Installation

Visage is available as an [npm package](https://www.npmjs.com/package/@readyplayerme/visage).
```sh
npm install @readyplayerme/visage
```

Make sure to install peer-dependencies if your project doesn't already include them:
```sh
npm install @react-three/drei @react-three/fiber three three-stdlib
```

# Documentation & examples

You can find all **code examples** of the components and their **documentation** on [our GitHub page](https://readyplayerme.github.io/visage/).

Here is the first one to get you started:
```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Exhibit } from '@readyplayerme/visage';

const modelUrl = 'https://readyplayerme.github.io/visage/male.glb'; // this can be a relative or absolute URL

function App() {
  return (
    <Exhibit modelUrl={modelUrl} />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

## License

Visage is [MIT licensed](./LICENSE).
