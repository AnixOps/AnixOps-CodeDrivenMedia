import React from 'react';
import { AbsoluteFill } from 'remotion';

/**
 * 最简单的测试组件
 */
export const TestCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#ff0000' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          fontSize: 72,
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Hello World
      </div>
    </AbsoluteFill>
  );
};