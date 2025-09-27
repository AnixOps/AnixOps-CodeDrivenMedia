import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';

/**
 * 待办事项列表(TodoList)中文版封面组件
 * 对标苹果设计风格 - 简约、优雅、专业
 */
export const TodoListCoverCn: React.FC = () => {
  const frame = useCurrentFrame();

  // 动画时间处理，确保在动画结束后内容保持显示状态
  const fadeIn = frame >= 70 ? 1 : interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const slideUp = frame >= 70 ? 0 : interpolate(frame, [0, 45], [80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const scaleIn = frame >= 70 ? 1 : interpolate(frame, [0, 60], [0.9, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      {/* 苹果风格渐变背景 */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(0, 122, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(52, 199, 89, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(255, 149, 0, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #1c1c1e 100%)
          `,
          opacity: fadeIn,
        }}
      />

      {/* 网格背景 - 苹果风格 */}
      <AbsoluteFill>
        <svg
          width="100%"
          height="100%"
          style={{
            opacity: fadeIn * 0.03,
            transform: `scale(${scaleIn})`,
          }}
        >
          <defs>
            <pattern
              id="grid-cn" // ID 已修改为中文版
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-cn)" />
        </svg>
      </AbsoluteFill>

      {/* 主要内容区域 */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 120,
          transform: `translateY(${slideUp}px)`,
          opacity: fadeIn,
        }}
      >
        {/* Logo区域 - 简化版本 */}
        <div 
          style={{ 
            marginBottom: 80,
            transform: `scale(${scaleIn})`,
            width: 120,
            height: 120,
            borderRadius: '24px',
            backgroundColor: '#007AFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 'bold',
            color: 'white',
            fontFamily: 'PingFang SC, sans-serif', // 适配中文字体
            boxShadow: '0 20px 40px rgba(0, 122, 255, 0.3)',
          }}
        >
          📝
        </div>

        {/* 主标题 - 苹果风格 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 40,
            transform: `scale(${scaleIn})`,
          }}
        >
          <h1
            style={{
              fontSize: 96,
              // 优先使用苹方字体，提供备用字体
              fontFamily: 'PingFang SC, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 700,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em',
              lineHeight: 1.1, // 调整行高以适应中文
              background: 'linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 20px rgba(255,255,255,0.1)',
            }}
          >
            AnixOps-TodoList
          </h1>
        </div>

        {/* 产品定位 - 苹果风格简洁描述 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 60,
            opacity: interpolate(frame, [30, 60], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <h2
            style={{
              fontSize: 32,
              fontFamily: 'PingFang SC, SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.9)',
              margin: 0,
              letterSpacing: '0.01em',
              lineHeight: 1.3,
            }}
          >
            极致的生产力搭档
          </h2>
        </div>

        {/* 核心功能 - 苹果风格图标展示 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 80,
            marginBottom: 80,
          }}
        >
          {[
            { icon: '✓', text: '智能列表', color: '#007AFF' },
            { icon: '⚡', text: 'AI 洞察(敬请期待)', color: '#34C759' },
            { icon: '☁', text: '全平台同步', color: '#FF9500' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: interpolate(frame, [20 + index * 8, 60 + index * 8], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
                transform: `translateY(${interpolate(frame, [20 + index * 8, 60 + index * 8], [30, 0], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                })})`,
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 16,
                  backgroundColor: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  marginBottom: 16,
                  boxShadow: `0 8px 32px ${feature.color}40`,
                }}
              >
                {feature.icon}
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: 'PingFang SC, SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 500,
                  textAlign: 'center',
                }}
              >
                {feature.text}
              </div>
            </div>
          ))}
        </div>

        {/* 平台支持 - 苹果风格 */}
        <div
          style={{
            textAlign: 'center',
            opacity: interpolate(frame, [50, 80], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <p
            style={{
              fontSize: 18,
              fontFamily: 'PingFang SC, SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: 0,
              fontWeight: 400,
            }}
          >
            支持 iPhone、iPad、Mac (稍后上线) 及网页版
          </p>
        </div>
      </AbsoluteFill>

      {/* 品牌标识 - 右下角 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          right: 40,
          fontSize: 14,
          fontFamily: 'SF Pro Text, -apple-system, BlinkMacSystemFont, sans-serif',
          color: 'rgba(255, 255, 255, 0.4)',
          opacity: fadeIn * 0.8,
        }}
      >
        AnixOps-Studio
      </div>

      {/* 环境光效果 */}
      <AbsoluteFill
        style={{
          background: `
            radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.1) 100%)
          `,
          opacity: fadeIn * 0.5,
        }}
      />
    </AbsoluteFill>
  );
};