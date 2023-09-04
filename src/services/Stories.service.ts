import { getStoryAssetPath } from './Models.service';

const disableTable = { table: { disable: true } };

const keysToIgnore = [
  'modelSrc',
  'animationSrc',
  'poseSrc',
  'halfBody',
  'shadows',
  'cameraTarget',
  'cameraInitialDistance',
  'style',
  'idleRotation',
  'emotion',
  'background',
  'capture',
  'loader',
  'dpr',
  'className',
  'headMovement',
  'cameraZoomTarget',
  'bloom',
  'onLoadedEffect',
  'onLoadedAnimation',
  'children',
  'environment',
  'ambientLightColor',
  'dirLightColor',
  'spotLightColor',
  'ambientLightIntensity',
  'dirLightIntensity',
  'spotLightIntensity',
  'spotLightAngle',
  'onLoaded'
];
export const ignoreArgTypesOnExamples = keysToIgnore.reduce(
  (acc, key) => {
    acc[key] = disableTable;
    return acc;
  },
  {} as Record<string, typeof disableTable>
);

export const modelPresets = {
  one: 'https://models.readyplayer.me/64d61e9e17883fd73ebe5eb7.glb?lod=0&morphTargets=Default,ARKit&textureAtlas=none',
  two: 'https://models.readyplayer.me/64d61f67f0367d07504924be.glb?lod=0&morphTargets=Default,ARKit&textureAtlas=none',
  three: 'https://models.readyplayer.me/64d62255f0367d0750492913.glb?lod=0&morphTargets=Default,ARKit&textureAtlas=none',
  five: 'https://models.readyplayer.me/64d6235e2d3bea6e4267b01d.glb?lod=0&morphTargets=Default,ARKit&textureAtlas=none',
  six: 'https://models.readyplayer.me/64d5d4eb651a0d350005c672.glb?lod=0&morphTargets=Default,ARKit&textureAtlas=none'
};

export const animationPresets = {
  one: getStoryAssetPath('M_Standing_Idle_Variations_002.fbx'),
  two: getStoryAssetPath('M_Standing_Idle_001.fbx')
};

export const emotions = {
  smile: {
    eyeSquintLeft: 0.4,
    eyeSquintRight: 0.2,
    mouthSmileLeft: 0.37,
    mouthSmileRight: 0.36,
    mouthShrugUpper: 0.27,
    browInnerUp: 0.3,
    browOuterUpLeft: 0.37,
    browOuterUpRight: 0.49
  }
};
