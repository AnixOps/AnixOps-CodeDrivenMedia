import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from 'remotion';
import { Logo } from '../components/atoms/Logo';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

/**
 * TodoList应用封面图片组件
 * 专门用于生成宣传封面图片
 */
export const TodoListCover: React.FC = () => {
  const frame = useCurrentFrame();

  // 简单的入场动画，适合静态封面
  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const slideUp = interpolate(frame, [0, 30], [50, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 背景渐变 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.secondary} 50%, ${COLORS.accent} 100%)`,
          opacity: fadeIn,
        }}
      />

      {/* 装饰性图形 */}
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            top: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.accent}20 0%, transparent 70%)`,
            opacity: fadeIn * 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.secondary}30 0%, transparent 70%)`,
            opacity: fadeIn * 0.8,
          }}
        />
      </AbsoluteFill>

      {/* 主要内容区域 */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 80,
          transform: `translateY(${slideUp}px)`,
          opacity: fadeIn,
        }}
      >
        {/* Logo */}
        <div style={{ marginBottom: 60 }}>
          <Logo variant="full" size="xl" animate={false} />
        </div>

        {/* 主标题 */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontFamily: TYPOGRAPHY.fontFamily.primary,
              fontWeight: TYPOGRAPHY.fontWeight.bold,
              color: COLORS.text.primary,
              margin: 0,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              lineHeight: 1.1,
            }}
          >
            TodoList
          </h1>
          <h2
            style={{
              fontSize: 48,
              fontFamily: TYPOGRAPHY.fontFamily.primary,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.text.secondary,
              margin: '20px 0 0 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            智能任务管理
          </h2>
        </div>

        {/* 副标题/卖点 */}
        <div
          style={{
            textAlign: 'center',
            maxWidth: 800,
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontSize: 28,
              fontFamily: TYPOGRAPHY.fontFamily.secondary,
              color: COLORS.text.muted,
              lineHeight: 1.4,
              margin: 0,
              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            让效率成为习惯 • 让组织变得简单
          </p>
        </div>

        {/* 功能亮点 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 60,
            marginBottom: 50,
          }}
        >
          {[
            { icon: '✅', text: '智能提醒' },
            { icon: '📊', text: '数据分析' },
            { icon: '🔄', text: '云端同步' },
            { icon: '🎯', text: '目标追踪' },
          ].map((feature, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                opacity: interpolate(frame, [10 + index * 5, 40 + index * 5], [0, 1], {
                  extrapolateLeft: 'clamp',
                  extrapolateRight: 'clamp',
                }),
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                }}
              >
                {feature.icon}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontFamily: TYPOGRAPHY.fontFamily.secondary,
                  color: COLORS.text.secondary,
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                }}
              >
                {feature.text}
              </div>
            </div>
          ))}
        </div>

        {/* 底部信息 */}
        <div
          style={{
            textAlign: 'center',
            opacity: interpolate(frame, [40, 60], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontFamily: TYPOGRAPHY.fontFamily.secondary,
              color: COLORS.text.muted,
              margin: 0,
              fontWeight: TYPOGRAPHY.fontWeight.normal,
            }}
          >
            适用于 iOS • Android • Web • Windows • macOS
          </p>
        </div>
      </AbsoluteFill>

      {/* 版本信息 */}
      <div
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          fontSize: 16,
          fontFamily: TYPOGRAPHY.fontFamily.secondary,
          color: COLORS.text.muted,
          opacity: fadeIn * 0.7,
        }}
      >
        v2.0.0
      </div>
    </AbsoluteFill>
  );
};