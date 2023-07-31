import {AnimationClip, Group} from "three";

import {FBXLoader, GLTFLoader} from "three-stdlib";

const MIXAMO_PREFIX = 'mixamorig';
const POSITION_SUFFIX = '.position';
const MIXAMO_SCALE = 0.01;
function normaliseFbxAnimation(fbx: Group, index: number = 0) {
    const {tracks} = fbx.animations[index];

    for (let i = 0; i < tracks.length; i += 1) {
        const hasMixamoPrefix = tracks[i].name.includes(MIXAMO_PREFIX)
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

const loadBlobFile = async (blob: Blob): Promise<Group> => {
    const fbxLoader = new FBXLoader();
    const gltfLoader = new GLTFLoader();

    try {
        const buffer = await blob.arrayBuffer();
        return (await gltfLoader.parseAsync(buffer, '')) as unknown as Group;
    } catch (e) {
        return (await fbxLoader.loadAsync(URL.createObjectURL(blob))) as unknown as Group;
    }
}

const loadPathFile = async (source: string): Promise<Group> => {
    const isFbx = source.endsWith('.fbx');
    const loader = isFbx ? new FBXLoader(): new GLTFLoader();

    return await loader.loadAsync(source) as Group;
}
export const loadAnimationClip = async (source: Blob | string):  Promise<AnimationClip> => {
    const isFbx = typeof source === 'string' && source.endsWith('.fbx');
    const animation = source instanceof Blob ? await loadBlobFile(source) : await loadPathFile(source);

    return isFbx ? normaliseFbxAnimation(animation) : animation.animations[0];
}
