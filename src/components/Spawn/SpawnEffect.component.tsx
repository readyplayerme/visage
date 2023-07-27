import React, {FC, useEffect, useMemo, useRef} from "react";
import {AnimationMixer, Group, LoopRepeat} from "three";
import {useFrame, useGraph} from "@react-three/fiber";
import {triggerCallback, useGltfLoader} from "../../services";
import {SpawnState} from "../Avatar/Avatar.component";

interface SpawnEffectProps {
    onSpawnEffectFinish: () => void;
    onMountEffect: SpawnState['onMountEffect']
}
export const SpawnEffect: FC<SpawnEffectProps> = ({onMountEffect, onSpawnEffectFinish}) => {
    const ref = useRef<Group>(null);

    const [effectRunning, setEffectRunning] = React.useState(true);

    const {scene: mountEffectScene} = useGltfLoader(onMountEffect?.src || '');
    const {nodes: mountEffectNode} = useGraph(mountEffectScene);

    const animationMountEffect = useGltfLoader(onMountEffect?.animationSrc || onMountEffect?.src|| '');


    useEffect(() => {
        if (!effectRunning) {
            triggerCallback(onSpawnEffectFinish)
        }
    }, [onSpawnEffectFinish, effectRunning])

    const spawnEffectMixer = useMemo(() => {

        const mixer = new AnimationMixer(mountEffectNode.Scene);
        const animation = mixer.clipAction(animationMountEffect.animations[0])

        animation.setLoop(LoopRepeat, onMountEffect?.loop || 1);
        animation.clampWhenFinished = true;

        animation.play();


        mixer.addEventListener('finished', () => {
            animation.fadeOut(0.5)
            setEffectRunning(false)
        })

        return mixer;
    }, [animationMountEffect.animations, mountEffectNode.Scene, onMountEffect?.loop]);

    useFrame((state, delta) => {
        spawnEffectMixer?.update(delta);
    });

    return (
        <>
            {effectRunning && <primitive modelRef={ref} object={mountEffectScene}/>}
        </>
    )
}
