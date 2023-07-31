import {useFrame, useGraph} from "@react-three/fiber";
import React, {useMemo, useEffect, FC} from "react";
import {AnimationMixer, Group, LoopRepeat} from "three";
import {triggerCallback} from "../../services";
import {SpawnState} from "../Avatar/Avatar.component";
import {loadAnimationClip} from "../../services/Animation.service";

interface SpawnAnimationProps {
    avatar: Group;
    onSpawnAnimationFinish?: () => void;
    onMountAnimation: SpawnState['onMountAnimation']
}

export const SpawnAnimation: FC<SpawnAnimationProps> = ({avatar, onSpawnAnimationFinish, onMountAnimation}) => {
    const [animationRunning, setAnimationRunning] = React.useState(true);

    useEffect(() => {
        if (!animationRunning) {
            triggerCallback(onSpawnAnimationFinish)
        }
    }, [onSpawnAnimationFinish, animationRunning])

    const {nodes: avatarNode} = useGraph(avatar);

    const animationMixerAvatar = useMemo(async () => {
        if (onMountAnimation?.src === '') {
            return null;
        }
        const mixer = new AnimationMixer(avatarNode.Armature);
        if (!avatarNode.Armature) {
            return mixer;
        }
        const animationClip = await loadAnimationClip(onMountAnimation?.src || '');

        const animation = mixer.clipAction(animationClip)

        animation.setLoop(LoopRepeat,  onMountAnimation?.loop || 1);
        animation.clampWhenFinished = true;

        animation.play();

        mixer.addEventListener('finished', () => {
            animation.fadeOut(0.5)
            setAnimationRunning(false)
        })

        return mixer;
    }, [avatarNode.Armature, onMountAnimation?.loop, onMountAnimation?.src]);

    useFrame(async (state, delta) => {
        (await animationMixerAvatar)?.update(delta);
    });

    return (
      <></>
    )

}