import React from 'react';
import { Composition, registerRoot } from 'remotion';
import BrandAnimation from './compositions/BrandAnimation';
import FeatureDemo from './compositions/Waiting-1';
import { TodoListPromo } from './compositions/TodoListPromo';

// 导入中文字体支持
import './styles/fonts.css';

// 视频配置
export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
};

// 注册视频组合
export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandAnimation"
        component={BrandAnimation}
        durationInFrames={5 * VIDEO_CONFIG.fps}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{
          logoVariant: 'full',
          animationType: 'elegant'
        }}
      />
      <Composition
        id="Wainting-1"
        component={FeatureDemo}
        durationInFrames={15 * VIDEO_CONFIG.fps}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={{
          features: [
            'React + TypeScript 全栈开发',
            '现代化 UI/UX 设计',
            '高性能系统架构',
            '代码驱动的创新方案'
          ]
        }}
      />
      <Composition
        id="TodoListPromo"
        component={TodoListPromo}
        durationInFrames={5400} // 45秒 * 120fps，保持紧凑节奏与高帧率
        fps={120}
        width={1920}
        height={1080}
        defaultProps={{}}
      />
    </>
  );
};

registerRoot(RemotionRoot);