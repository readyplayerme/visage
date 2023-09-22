import { AnimationClip, Group } from 'three';

import { FBXLoader, GLTFLoader } from 'three-stdlib';

interface ClipWithType {
  group: Group;
  isFbx: boolean;
}

const MIXAMO_PREFIX = 'mixamorig';
const POSITION_SUFFIX = '.position';
const MIXAMO_SCALE = 0.01;

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();

function normaliseFbxAnimation(fbx: Group, index: number = 0) {
  const { tracks } = fbx.animations[index];

  for (let i = 0; i < tracks.length; i += 1) {
    const hasMixamoPrefix = tracks[i].name.includes(MIXAMO_PREFIX);
    if (hasMixamoPrefix) {
      tracks[i].name = tracks[i].name.replace(MIXAMO_PREFIX, '');
    }
    if (tracks[i].name.includes(POSITION_SUFFIX)) {
      for (let j = 0; j < tracks[i].values.length; j += 1) {
        // Scale the bound size down to match the size of the model
        // eslint-disable-next-line operator-assignment
        tracks[i].values[j] = tracks[i].values[j] * MIXAMO_SCALE;
      }
    }
  }

  return fbx.animations[index];
}

const loadBlobFile = async (blob: Blob): Promise<ClipWithType> => {
  try {
    const buffer = await blob.arrayBuffer();
    return {
      group: (await gltfLoader.parseAsync(buffer, '')) as unknown as Group,
      isFbx: false
    };
  } catch (e) {
    return {
      group: (await fbxLoader.loadAsync(URL.createObjectURL(blob))) as unknown as Group,
      isFbx: true
    };
  }
};

const loadPathFile = async (source: string): Promise<ClipWithType> => {
  try {
    return {
      group: (await gltfLoader.loadAsync(source)) as unknown as Group,
      isFbx: false
    };
  } catch (e) {
    return {
      group: (await fbxLoader.loadAsync(source)) as Group,
      isFbx: true
    };
  }
};
export const loadAnimationClip = async (source: Blob | string): Promise<AnimationClip> => {
  const animation = source instanceof Blob ? await loadBlobFile(source) : await loadPathFile(source);

  return animation.isFbx ? normaliseFbxAnimation(animation.group) : animation.group.animations[0];
};
