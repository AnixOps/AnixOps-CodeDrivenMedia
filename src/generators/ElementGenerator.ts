import React from 'react';
import { ElementConfig, ThemeConfig, PositionConfig, StyleConfig } from '../types/config';
// Note: Remotion hooks cannot be used in class methods
// import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

/**
 * 元素生成器 - 根据配置生成各种UI元素
 */
export class ElementGenerator {
  
  /**
   * 生成元素组件
   */
  generateElement(config: ElementConfig, theme?: ThemeConfig): React.ReactElement {
    const elementStyle = this.generateElementStyle(config, theme);
    const animationProps = this.generateAnimationProps(config);

    switch (config.type) {
      case 'text':
        return this.generateTextElement(config, elementStyle, animationProps);
      case 'logo':
        return this.generateLogoElement(config, elementStyle, animationProps);
      case 'image':
        return this.generateImageElement(config, elementStyle, animationProps);
      case 'button':
        return this.generateButtonElement(config, elementStyle, animationProps);
      case 'shape':
        return this.generateShapeElement(config, elementStyle, animationProps);
      default:
        return this.generateDefaultElement(config, elementStyle, animationProps);
    }
  }

  /**
   * 生成元素代码字符串
   */
  generateElementCode(config: ElementConfig): string {
    switch (config.type) {
      case 'text':
        return this.generateTextElementCode(config);
      case 'logo':
        return this.generateLogoElementCode(config);
      case 'image':
        return this.generateImageElementCode(config);
      case 'button':
        return this.generateButtonElementCode(config);
      default:
        return this.generateDefaultElementCode(config);
    }
  }

  /**
   * 生成文本元素
   */
  private generateTextElement(
    config: ElementConfig, 
    style: React.CSSProperties, 
    animationProps: any
  ): React.ReactElement {
    return React.createElement('div', {
      key: config.id,
      style: {
        ...style,
        ...animationProps.style
      }
    }, config.content.text || '');
  }

  /**
   * 生成Logo元素
   */
  private generateLogoElement(
    config: ElementConfig, 
    style: React.CSSProperties, 
    animationProps: any
  ): React.ReactElement {
    return React.createElement('div', {
      key: config.id,
      style: {
        ...style,
        ...animationProps.style,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, config.content.text || 'LOGO');
  }

  /**
   * 生成图片元素
   */
  private generateImageElement(
    config: ElementConfig, 
    style: React.CSSProperties, 
    animationProps: any
  ): React.ReactElement {
    return React.createElement('img', {
      key: config.id,
      src: config.content.src,
      alt: config.content.alt || '',
      style: {
        ...style,
        ...animationProps.style,
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain'
      }
    });
  }

  /**
   * 生成按钮元素
   */
  private generateButtonElement(
    config: ElementConfig, 
    style: React.CSSProperties, 
    animationProps: any
  ): React.ReactElement {
    return React.createElement('button', {
      key: config.id,
      style: {
        ...style,
        ...animationProps.style,
        border: 'none',
        borderRadius: '8px',
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '16px'
      }
    }, config.content.text || 'Button');
  }

  /**
   * 生成形状元素
   */
  private generateShapeElement(
    config: ElementConfig, 
    style: React.CSSProperties, 
    animationProps: any
  ): React.ReactElement {
    const shapeStyle = {
      ...style,
      ...animationProps.style
    };

    switch (config.content.shape) {
      case 'circle':
        shapeStyle.borderRadius = '50%';
        break;
      case 'rectangle':
        shapeStyle.borderRadius = '0';
        break;
      case 'rounded':
        shapeStyle.borderRadius = '8px';
        break;
    }

    return React.createElement('div', {
      key: config.id,
      style: shapeStyle
    });
  }

  /**
   * 生成默认元素
   */
  private generateDefaultElement(
    config: ElementConfig, 
    style: React.CSSProperties, 
    animationProps: any
  ): React.ReactElement {
    return React.createElement('div', {
      key: config.id,
      style: {
        ...style,
        ...animationProps.style
      }
    }, config.content.text || config.type);
  }

  /**
   * 生成元素样式
   */
  private generateElementStyle(config: ElementConfig, theme?: ThemeConfig): React.CSSProperties {
    const style: React.CSSProperties = {
      position: 'absolute',
      ...this.convertPosition(config.position)
    };

    // 应用自定义样式
    if (config.style) {
      Object.assign(style, this.convertStyleConfig(config.style, theme));
    }

    return style;
  }

  /**
   * 转换位置配置
   */
  private convertPosition(position: PositionConfig): React.CSSProperties {
    return {
      left: typeof position.x === 'string' ? position.x : `${position.x}px`,
      top: typeof position.y === 'string' ? position.y : `${position.y}px`,
      width: position.width ? (typeof position.width === 'string' ? position.width : `${position.width}px`) : 'auto',
      height: position.height ? (typeof position.height === 'string' ? position.height : `${position.height}px`) : 'auto',
      zIndex: position.zIndex || 1
    };
  }

  /**
   * 转换样式配置
   */
  private convertStyleConfig(styleConfig: StyleConfig, theme?: ThemeConfig): React.CSSProperties {
    const style: React.CSSProperties = { ...styleConfig };

    // 应用主题色彩
    if (theme) {
      if (styleConfig.color === 'primary') style.color = theme.primary;
      if (styleConfig.color === 'secondary') style.color = theme.secondary;
      if (styleConfig.backgroundColor === 'primary') style.backgroundColor = theme.primary;
      if (styleConfig.backgroundColor === 'secondary') style.backgroundColor = theme.secondary;
    }

    return style;
  }

  /**
   * 生成动画属性
   */
  private generateAnimationProps(config: ElementConfig): { style: React.CSSProperties } {
    // 这里需要使用 Remotion hooks，但在类方法中无法使用
    // 实际实现中需要重构为函数组件或使用不同的架构
    const style: React.CSSProperties = {};

    if (config.animation.type === 'fadeIn') {
      // 占位实现，实际需要在组件中使用 useCurrentFrame
      style.opacity = 1;
    }

    return { style };
  }

  // 生成代码字符串的方法
  private generateTextElementCode(config: ElementConfig): string {
    return `
        <AnimatedText
          text="${config.content.text}"
          style={{
            position: 'absolute',
            left: '${config.position.x}',
            top: '${config.position.y}',
            ${this.generateStyleCode(config.style)}
          }}
          animation="${config.animation.type}"
          duration={${config.animation.duration || 1}}
          delay={${config.animation.delay || 0}}
        />`;
  }

  private generateLogoElementCode(config: ElementConfig): string {
    return `
        <Logo
          variant="${config.content.variant || 'full'}"
          style={{
            position: 'absolute',
            left: '${config.position.x}',
            top: '${config.position.y}',
            ${this.generateStyleCode(config.style)}
          }}
        />`;
  }

  private generateImageElementCode(config: ElementConfig): string {
    return `
        <img
          src="${config.content.src}"
          alt="${config.content.alt || ''}"
          style={{
            position: 'absolute',
            left: '${config.position.x}',
            top: '${config.position.y}',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            ${this.generateStyleCode(config.style)}
          }}
        />`;
  }

  private generateButtonElementCode(config: ElementConfig): string {
    return `
        <Button
          text="${config.content.text}"
          style={{
            position: 'absolute',
            left: '${config.position.x}',
            top: '${config.position.y}',
            ${this.generateStyleCode(config.style)}
          }}
        />`;
  }

  private generateDefaultElementCode(config: ElementConfig): string {
    return `
        <div style={{
          position: 'absolute',
          left: '${config.position.x}',
          top: '${config.position.y}',
          ${this.generateStyleCode(config.style)}
        }}>
          ${config.content.text || config.type}
        </div>`;
  }

  private generateStyleCode(style?: StyleConfig): string {
    if (!style) return '';
    
    return Object.entries(style)
      .map(([key, value]) => `${key}: '${value}',`)
      .join('\n            ');
  }
}

export default ElementGenerator;