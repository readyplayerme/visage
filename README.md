# [Visage](https://readyplayerme.github.io/visage/) &middot; [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/readyplayerme/visage/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@readyplayerme/visage)](https://www.npmjs.com/package/@readyplayerme/visage)
Visage is a collection of components for showcasing Ready Player Me avatars and 3D on the web!

Built with [`three.js`](https://github.com/mrdoob/three.js), [`react-three-fiber`](https://github.com/pmndrs/react-three-fiber), [`drei`](https://github.com/pmndrs/drei), [`three-stdlib`](https://github.com/pmndrs/three-stdlib) and [`react`](https://github.com/facebook/react/).

# Installation

Visage is available as an [npm package](https://www.npmjs.com/package/@readyplayerme/visage).
```sh
npm install @readyplayerme/visage
```

Make sure to install peer-dependencies if your project doesn't already include them:
```sh
npm install @react-three/drei @react-three/fiber three three-stdlib suspend-react
```

# Documentation & examples

You can find all **code examples** of the components and their **documentation** on [our GitHub page](https://readyplayerme.github.io/visage/).

Here is the first one to get you started:
```typescript jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Avatar } from '@readyplayerme/visage';

const modelSrc = 'https://readyplayerme.github.io/visage/male.glb';

function App() {
  return (
    <Avatar modelSrc={modelSrc} />
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

### Validation
Props such as `modelSrc`, `animationSrc` and `poseSrc` are validated before rendering on the scene.

Supported resource formats are:
* URL resources
  * relative `/headwear.glb`
  * absolute `https://readyplayerme.github.io/visage/male.glb?queryParams=allowed`
* Base64 strings
  * `data:application/octet-stream;base64`
  * `data:model/gltf-binary;base64`
* Binary input as `model/gltf-binary`

## License

Visage is [MIT licensed](./LICENSE).
