import React from 'react';
import { requireNativeComponent, ViewProps } from 'react-native';

interface ReelsNativeVideoProps extends ViewProps {
    src?: string;
    paused?: boolean;
}

const NativeReelsVideo = requireNativeComponent<ReelsNativeVideoProps>('ReelsNativeVideo');

export const ReelsNativeVideo: React.FC<ReelsNativeVideoProps> = (props) => {
    return <NativeReelsVideo {...props} />;
};
