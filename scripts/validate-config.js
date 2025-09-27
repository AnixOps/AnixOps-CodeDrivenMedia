#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 配置验证工具 - 验证配置文件格式和内容
 */
class ConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * 验证配置文件
   */
  async validateFile(configPath) {
    this.errors = [];
    this.warnings = [];

    try {
      console.log(`🔍 验证配置文件: ${configPath}`);
      
      const content = await fs.promises.readFile(configPath, 'utf-8');
      const config = JSON.parse(content);
      
      this.validateProjectStructure(config);
      this.validateVideos(config.videos || []);
      this.validateTheme(config.globalTheme);
      this.validateRequirements(config.requirements || []);
      
      this.printResults(configPath);
      
      return {
        valid: this.errors.length === 0,
        errors: this.errors,
        warnings: this.warnings
      };
      
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.errors.push('JSON 格式错误: ' + error.message);
      } else {
        this.errors.push('文件读取错误: ' + error.message);
      }
      
      this.printResults(configPath);
      return {
        valid: false,
        errors: this.errors,
        warnings: this.warnings
      };
    }
  }

  /**
   * 验证项目结构
   */
  validateProjectStructure(config) {
    if (!config.name) {
      this.errors.push('缺少项目名称 (name)');
    }

    if (!config.version) {
      this.warnings.push('建议添加版本号 (version)');
    }

    if (!config.videos || !Array.isArray(config.videos)) {
      this.errors.push('必须包含视频数组 (videos)');
    } else if (config.videos.length === 0) {
      this.warnings.push('视频数组为空');
    }
  }

  /**
   * 验证视频配置
   */
  validateVideos(videos) {
    videos.forEach((video, index) => {
      const prefix = `视频[${index}] (${video.id || 'unnamed'})`;
      
      if (!video.id) {
        this.errors.push(`${prefix}: 缺少视频ID`);
      }

      if (!video.duration || video.duration <= 0) {
        this.errors.push(`${prefix}: 必须设置正数时长`);
      }

      if (!video.scenes || !Array.isArray(video.scenes)) {
        this.errors.push(`${prefix}: 必须包含场景数组`);
      } else {
        this.validateScenes(video.scenes, prefix);
      }

      // 验证视频尺寸
      if (video.width && (video.width < 100 || video.width > 4000)) {
        this.warnings.push(`${prefix}: 视频宽度可能不合适 (${video.width})`);
      }

      if (video.height && (video.height < 100 || video.height > 4000)) {
        this.warnings.push(`${prefix}: 视频高度可能不合适 (${video.height})`);
      }

      // 验证帧率
      if (video.fps && (video.fps < 15 || video.fps > 120)) {
        this.warnings.push(`${prefix}: 帧率可能不合适 (${video.fps})`);
      }
    });
  }

  /**
   * 验证场景配置
   */
  validateScenes(scenes, videoPrefix) {
    let totalTime = 0;
    
    scenes.forEach((scene, index) => {
      const prefix = `${videoPrefix} 场景[${index}] (${scene.id || 'unnamed'})`;
      
      if (!scene.id) {
        this.errors.push(`${prefix}: 缺少场景ID`);
      }

      if (!scene.duration || scene.duration <= 0) {
        this.errors.push(`${prefix}: 必须设置正数时长`);
      }

      if (scene.startTime < 0) {
        this.errors.push(`${prefix}: 开始时间不能为负数`);
      }

      if (!scene.elements || !Array.isArray(scene.elements)) {
        this.warnings.push(`${prefix}: 场景没有元素`);
      } else {
        this.validateElements(scene.elements, prefix);
      }

      // 检查时间重叠
      const endTime = scene.startTime + scene.duration;
      if (scene.startTime < totalTime) {
        this.warnings.push(`${prefix}: 可能与前一个场景时间重叠`);
      }
      totalTime = Math.max(totalTime, endTime);
    });
  }

  /**
   * 验证元素配置
   */
  validateElements(elements, scenePrefix) {
    const supportedTypes = ['text', 'logo', 'image', 'video', 'button', 'shape', 'chart', 'code'];
    const supportedAnimations = ['fadeIn', 'fadeOut', 'slideIn', 'slideOut', 'zoomIn', 'zoomOut', 'rotate', 'scale', 'typewriter', 'bounce', 'elastic'];

    elements.forEach((element, index) => {
      const prefix = `${scenePrefix} 元素[${index}] (${element.id || 'unnamed'})`;
      
      if (!element.id) {
        this.errors.push(`${prefix}: 缺少元素ID`);
      }

      if (!element.type) {
        this.errors.push(`${prefix}: 缺少元素类型`);
      } else if (!supportedTypes.includes(element.type)) {
        this.warnings.push(`${prefix}: 不支持的元素类型 '${element.type}'，可能需要自定义实现`);
      }

      if (!element.position) {
        this.errors.push(`${prefix}: 缺少位置信息`);
      } else {
        this.validatePosition(element.position, prefix);
      }

      if (!element.timing) {
        this.warnings.push(`${prefix}: 缺少时间信息`);
      } else {
        if (element.timing.start < 0) {
          this.errors.push(`${prefix}: 开始时间不能为负数`);
        }
        if (element.timing.duration <= 0) {
          this.errors.push(`${prefix}: 持续时间必须为正数`);
        }
      }

      if (element.animation) {
        if (!supportedAnimations.includes(element.animation.type)) {
          this.warnings.push(`${prefix}: 不支持的动画类型 '${element.animation.type}'`);
        }
      }

      // 验证特定元素类型的内容
      this.validateElementContent(element, prefix);
    });
  }

  /**
   * 验证位置信息
   */
  validatePosition(position, prefix) {
    if (position.x === undefined || position.y === undefined) {
      this.errors.push(`${prefix}: 位置必须包含 x 和 y 坐标`);
    }

    // 检查百分比格式
    if (typeof position.x === 'string' && position.x.includes('%')) {
      const value = parseFloat(position.x);
      if (value < 0 || value > 100) {
        this.warnings.push(`${prefix}: X 位置百分比超出范围 (${position.x})`);
      }
    }

    if (typeof position.y === 'string' && position.y.includes('%')) {
      const value = parseFloat(position.y);
      if (value < 0 || value > 100) {
        this.warnings.push(`${prefix}: Y 位置百分比超出范围 (${position.y})`);
      }
    }
  }

  /**
   * 验证元素内容
   */
  validateElementContent(element, prefix) {
    if (!element.content) {
      this.warnings.push(`${prefix}: 缺少内容信息`);
      return;
    }

    switch (element.type) {
      case 'text':
        if (!element.content.text) {
          this.errors.push(`${prefix}: 文本元素必须有文字内容`);
        }
        break;
      
      case 'image':
        if (!element.content.src) {
          this.errors.push(`${prefix}: 图片元素必须有图片源地址`);
        }
        break;
      
      case 'video':
        if (!element.content.src) {
          this.errors.push(`${prefix}: 视频元素必须有视频源地址`);
        }
        break;
      
      case 'code':
        if (!element.content.code) {
          this.errors.push(`${prefix}: 代码元素必须有代码内容`);
        }
        if (!element.content.language) {
          this.warnings.push(`${prefix}: 建议指定代码语言`);
        }
        break;
    }
  }

  /**
   * 验证主题配置
   */
  validateTheme(theme) {
    if (!theme) {
      this.warnings.push('建议设置全局主题');
      return;
    }

    const requiredColors = ['primary', 'secondary', 'background', 'text'];
    requiredColors.forEach(color => {
      if (!theme[color]) {
        this.warnings.push(`主题缺少 ${color} 颜色`);
      } else if (!this.isValidColor(theme[color])) {
        this.warnings.push(`主题 ${color} 颜色格式可能不正确: ${theme[color]}`);
      }
    });
  }

  /**
   * 验证需求配置
   */
  validateRequirements(requirements) {
    requirements.forEach((req, index) => {
      if (!req.file) {
        this.errors.push(`需求[${index}]: 缺少文件路径`);
      }
      
      if (!req.description) {
        this.warnings.push(`需求[${index}]: 建议添加描述`);
      }
    });
  }

  /**
   * 检查颜色格式是否有效
   */
  isValidColor(color) {
    // 简单的颜色格式验证
    const colorRegex = /^(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgb\(|rgba\(|hsl\(|hsla\()/;
    return colorRegex.test(color);
  }

  /**
   * 打印验证结果
   */
  printResults(configPath) {
    console.log(`\n📋 验证结果: ${path.basename(configPath)}`);
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ 配置完全正确！');
    } else {
      if (this.errors.length > 0) {
        console.log(`\n❌ 错误 (${this.errors.length}):`);
        this.errors.forEach(error => console.log(`   ${error}`));
      }
      
      if (this.warnings.length > 0) {
        console.log(`\n⚠️  警告 (${this.warnings.length}):`);
        this.warnings.forEach(warning => console.log(`   ${warning}`));
      }
    }
    
    console.log('');
  }

  /**
   * 生成修复建议
   */
  generateFixSuggestions() {
    const suggestions = [];
    
    this.errors.forEach(error => {
      if (error.includes('缺少项目名称')) {
        suggestions.push('添加 "name": "你的项目名称" 到配置根部');
      }
      if (error.includes('缺少视频ID')) {
        suggestions.push('为每个视频添加唯一的 "id" 字段');
      }
      if (error.includes('必须设置正数时长')) {
        suggestions.push('确保 duration 字段为正数（秒）');
      }
    });

    return suggestions;
  }
}

/**
 * 验证所有模板文件
 */
async function validateAllTemplates() {
  const validator = new ConfigValidator();
  const templateDir = path.join(process.cwd(), 'templates');
  
  try {
    const files = await fs.promises.readdir(templateDir);
    const configFiles = files.filter(file => file.endsWith('.json'));
    
    console.log(`🔍 开始验证 ${configFiles.length} 个配置文件...\n`);
    
    let totalErrors = 0;
    let totalWarnings = 0;
    
    for (const file of configFiles) {
      const configPath = path.join(templateDir, file);
      const result = await validator.validateFile(configPath);
      
      totalErrors += result.errors.length;
      totalWarnings += result.warnings.length;
    }
    
    console.log('='.repeat(50));
    console.log(`📊 总结:`);
    console.log(`   文件总数: ${configFiles.length}`);
    console.log(`   错误总数: ${totalErrors}`);
    console.log(`   警告总数: ${totalWarnings}`);
    
    if (totalErrors === 0) {
      console.log('✅ 所有配置文件验证通过！');
    } else {
      console.log('❌ 发现错误，请修复后重试');
    }
    
  } catch (error) {
    console.error('验证过程出错:', error.message);
  }
}

// 命令行使用
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    validateAllTemplates();
  } else {
    const validator = new ConfigValidator();
    args.forEach(async (configPath) => {
      await validator.validateFile(configPath);
    });
  }
}

module.exports = ConfigValidator;