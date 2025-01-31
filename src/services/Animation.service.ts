import { AnimationClip, AnimationMixer, Group, LoopRepeat, Mesh, PropertyBinding, Scene } from 'three';

import { FBXLoader, GLTFLoader } from 'three-stdlib';
import { suspend } from 'suspend-react';
import { MeshoptDecoder } from './meshopt_decoder';
import { AnimationsT } from '../types';

interface ClipWithType {
  group: Group;
  isFbx: boolean;
}

const MIXAMO_PREFIX = 'mixamorig';
const POSITION_SUFFIX = '.position';
const MIXAMO_SCALE = 0.01;

const fbxLoader = new FBXLoader();
const gltfLoader = new GLTFLoader();
gltfLoader.setMeshoptDecoder(MeshoptDecoder);

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

export const playAssetIdleAnimation = (scene: Scene, animations: Array<AnimationClip>): AnimationMixer | null => {
  if(!scene || !animations.length) {
    console.log('No scene or animations found');
    return null;
  }

  const idleAnimations = animations.filter((animation) => animation.name === 'idle');

  if(!idleAnimations.length) { 
    console.error('No idle animations found');
    return null;
  }

  const defaultIdleAnimation = idleAnimations[0];

  if(!defaultIdleAnimation.tracks.length) { 
    console.error('No tracks found');
    return null;
  }

  const defaultIdleAnimationTrack = defaultIdleAnimation.tracks[0];
  const encodedPropertyPath = defaultIdleAnimationTrack.name;

  const animatedMaterial = PropertyBinding.findNode(scene, encodedPropertyPath);

  if(!animatedMaterial) { 
    console.error('No animated material found');
    return null;
  }
  const targetMeshes: Array<Mesh> = [];

  scene.traverse((object) => {
    const mesh = object as Mesh;

    if (mesh.isMesh && mesh.material === animatedMaterial) {
      targetMeshes.push(mesh);
    } 
  });

  if(!targetMeshes.length) {
    console.error('No target meshes found');
    return null;
  }
  const animatedMesh = targetMeshes[0];

  const assetMixer = new AnimationMixer(animatedMesh);               
  const defaultIdleAction = assetMixer.clipAction(defaultIdleAnimation);

  // @ts-expect-error property binding exists
  // eslint-disable-next-line no-underscore-dangle 
  const propertyMixers = defaultIdleAction._propertyBindings as unknown as Array<PropertyMixer>;
  if(!propertyMixers.length) {
    console.error('No property mixers found');
    return null;
  } 

  const defaultPropertyMixer = propertyMixers[0];
  defaultPropertyMixer.binding.node = defaultPropertyMixer.binding.rootNode;

  defaultIdleAction.setLoop(LoopRepeat, Infinity);
  defaultIdleAction.play();

  return assetMixer;             
}

export const useAnimations = (animations: AnimationsT) =>
  suspend(async (): Promise<Record<string, AnimationClip>> => {
    const clips: Record<string, AnimationClip> = {};

    await Promise.all(
      Object.keys(animations).map(async (name) => {
        const newClip = await loadAnimationClip(animations[name].source);
        newClip.name = name;
        clips[name] = newClip;
      })
    );

    return clips;
  }, [animations]);
