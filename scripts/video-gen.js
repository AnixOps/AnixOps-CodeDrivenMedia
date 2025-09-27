#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const BatchRenderer = require('./batch-render');
const ConfigValidator = require('./validate-config');

/**
 * 视频生成命令行工具
 */
class VideoGeneratorCLI {
  constructor() {
    this.renderer = new BatchRenderer();
    this.validator = new ConfigValidator();
  }

  /**
   * 显示帮助信息
   */
  showHelp() {
    console.log(`
🎬 AnixOps 视频生成工具

用法:
  npm run video-gen <command> [options]

命令:
  init              创建示例配置文件
  validate [file]   验证配置文件格式
  generate          生成视频组件代码
  render            渲染视频文件
  all               执行完整流程 (生成+渲染)
  list              列出所有配置文件
  help              显示帮助信息

示例:
  npm run video-gen init
  npm run video-gen validate templates/product-showcase.json
  npm run video-gen all
  npm run video-gen render --config=product-showcase
  
选项:
  --config=<name>   指定配置文件名（不含扩展名）
  --output=<dir>    指定输出目录
  --format=<fmt>    指定输出格式 (mp4, mov, webm)
`);
  }

  /**
   * 执行命令
   */
  async run() {
    const args = process.argv.slice(2);
    const command = args[0];
    
    if (!command || command === 'help') {
      this.showHelp();
      return;
    }

    try {
      switch (command) {
        case 'init':
          await this.initProject();
          break;
        case 'validate':
          await this.validateConfig(args[1]);
          break;
        case 'generate':
          await this.generateComponents();
          break;
        case 'render':
          await this.renderVideos(this.parseOptions(args));
          break;
        case 'all':
          await this.runFullPipeline();
          break;
        case 'list':
          await this.listConfigs();
          break;
        default:
          console.error(`❌ 未知命令: ${command}`);
          this.showHelp();
      }
    } catch (error) {
      console.error(`❌ 执行失败:`, error.message);
      process.exit(1);
    }
  }

  /**
   * 初始化项目
   */
  async initProject() {
    console.log('🚀 初始化视频生成项目...\n');

    // 创建必要的目录
    const dirs = ['templates', 'output', 'src/compositions', 'docs/generated'];
    for (const dir of dirs) {
      await this.ensureDirectoryExists(dir);
      console.log(`✓ 创建目录: ${dir}`);
    }

    // 创建示例配置文件
    const exampleConfig = this.createExampleConfig();
    const configPath = path.join('templates', 'example.json');
    
    if (!fs.existsSync(configPath)) {
      await fs.promises.writeFile(configPath, JSON.stringify(exampleConfig, null, 2));
      console.log(`✓ 创建示例配置: ${configPath}`);
    } else {
      console.log(`⚠️  示例配置已存在: ${configPath}`);
    }

    // 创建 package.json 脚本（如果不存在）
    await this.updatePackageScripts();

    console.log(`
✅ 初始化完成！

下一步:
1. 编辑 templates/example.json 配置文件
2. 运行 npm run video-gen validate 验证配置
3. 运行 npm run video-gen all 生成视频

了解更多: npm run video-gen help
`);
  }

  /**
   * 验证配置
   */
  async validateConfig(configFile) {
    if (configFile) {
      await this.validator.validateFile(configFile);
    } else {
      console.log('🔍 验证所有配置文件...\n');
      const templateDir = 'templates';
      const files = await fs.promises.readdir(templateDir);
      const configFiles = files.filter(file => file.endsWith('.json'));
      
      for (const file of configFiles) {
        await this.validator.validateFile(path.join(templateDir, file));
      }
    }
  }

  /**
   * 生成组件代码
   */
  async generateComponents() {
    console.log('⚙️  生成视频组件代码...\n');
    
    const templateDir = 'templates';
    const files = await fs.promises.readdir(templateDir);
    const configFiles = files.filter(file => file.endsWith('.json'));
    
    for (const file of configFiles) {
      const configPath = path.join(templateDir, file);
      const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));
      
      console.log(`📝 处理配置: ${file}`);
      
      // 生成组件文件
      for (const video of config.videos) {
        const componentCode = this.generateComponentCode(video, config.globalTheme);
        const componentPath = path.join('src', 'compositions', `Generated${video.id}.tsx`);
        
        await this.ensureDirectoryExists(path.dirname(componentPath));
        await fs.promises.writeFile(componentPath, componentCode);
        
        console.log(`   ✓ 生成组件: ${componentPath}`);
      }
    }
    
    console.log('\n✅ 组件代码生成完成！');
  }

  /**
   * 渲染视频
   */
  async renderVideos(options = {}) {
    console.log('🎬 开始渲染视频...\n');
    
    if (options.config) {
      const configPath = path.join('templates', `${options.config}.json`);
      await this.renderer.processConfig(`${options.config}.json`);
    } else {
      await this.renderer.run();
    }
  }

  /**
   * 运行完整流程
   */
  async runFullPipeline() {
    console.log('🚀 执行完整视频生成流程...\n');
    
    await this.validateConfig();
    await this.generateComponents();
    await this.renderVideos();
    
    console.log('🎉 完整流程执行完成！');
  }

  /**
   * 列出配置文件
   */
  async listConfigs() {
    console.log('📁 配置文件列表:\n');
    
    const templateDir = 'templates';
    
    try {
      const files = await fs.promises.readdir(templateDir);
      const configFiles = files.filter(file => file.endsWith('.json'));
      
      if (configFiles.length === 0) {
        console.log('   没有找到配置文件');
        console.log('   运行 npm run video-gen init 创建示例配置');
        return;
      }
      
      for (const file of configFiles) {
        const configPath = path.join(templateDir, file);
        const config = JSON.parse(await fs.promises.readFile(configPath, 'utf-8'));
        
        console.log(`📄 ${file}`);
        console.log(`   名称: ${config.name || '无名称'}`);
        console.log(`   描述: ${config.description || '无描述'}`);
        console.log(`   视频数: ${config.videos?.length || 0}`);
        console.log('');
      }
      
    } catch (error) {
      console.log('   模板目录不存在，运行 npm run video-gen init 初始化项目');
    }
  }

  /**
   * 解析命令行选项
   */
  parseOptions(args) {
    const options = {};
    
    args.forEach(arg => {
      if (arg.startsWith('--')) {
        const [key, value] = arg.substring(2).split('=');
        options[key] = value || true;
      }
    });
    
    return options;
  }

  /**
   * 更新 package.json 脚本
   */
  async updatePackageScripts() {
    const packagePath = 'package.json';
    
    try {
      const packageContent = await fs.promises.readFile(packagePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);
      
      const newScripts = {
        'video-gen': 'node scripts/video-gen.js',
        'video-init': 'node scripts/video-gen.js init',
        'video-validate': 'node scripts/video-gen.js validate',
        'video-render': 'node scripts/video-gen.js all'
      };
      
      packageJson.scripts = { ...packageJson.scripts, ...newScripts };
      
      await fs.promises.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
      console.log('✓ 更新 package.json 脚本');
      
    } catch (error) {
      console.log('⚠️  无法更新 package.json，请手动添加脚本');
    }
  }

  /**
   * 生成简单的组件代码
   */
  generateComponentCode(video, globalTheme) {
    return `import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';

const Generated${video.id}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '${video.theme?.background || globalTheme?.background || '#000000'}',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '${video.theme?.text || globalTheme?.text || '#ffffff'}',
      fontFamily: '${globalTheme?.fontFamily?.replace(/'/g, '"') || 'Arial, sans-serif'}'
    }}>
      <div style={{
        textAlign: 'center',
        opacity: Math.min(1, frame / 30) // 1秒淡入
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
          ${video.name || video.id}
        </h1>
        <p style={{ fontSize: '24px' }}>
          ${video.description || '自动生成的视频'}
        </p>
        <div style={{
          marginTop: '40px',
          fontSize: '18px',
          opacity: 0.7
        }}>
          帧数: {frame} / 总时长: ${video.duration}秒
        </div>
      </div>
    </div>
  );
};

export default Generated${video.id};
`;
  }

  /**
   * 创建示例配置
   */
  createExampleConfig() {
    return {
      name: "示例项目",
      description: "这是一个使用配置生成视频的示例项目",
      version: "1.0.0",
      videos: [
        {
          id: "Welcome",
          name: "欢迎视频",
          description: "简单的欢迎信息",
          duration: 10,
          width: 1920,
          height: 1080,
          fps: 30,
          scenes: [
            {
              id: "main",
              type: "intro",
              duration: 10,
              startTime: 0,
              elements: [
                {
                  id: "title",
                  type: "text",
                  content: { text: "欢迎使用视频生成器" },
                  position: { x: "50%", y: "50%" },
                  animation: { type: "fadeIn", duration: 2 },
                  timing: { start: 1, duration: 8 },
                  style: {
                    fontSize: "48px",
                    color: "#ffffff",
                    textAlign: "center"
                  }
                }
              ]
            }
          ],
          theme: {
            primary: "#007acc",
            secondary: "#ff6b6b",
            background: "#1a1a1a",
            text: "#ffffff"
          }
        }
      ],
      globalTheme: {
        primary: "#007acc",
        secondary: "#ff6b6b",
        background: "#1a1a1a",
        text: "#ffffff",
        fontFamily: "Arial, sans-serif"
      },
      requirements: []
    };
  }

  /**
   * 确保目录存在
   */
  async ensureDirectoryExists(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }
}

// 执行CLI
if (require.main === module) {
  const cli = new VideoGeneratorCLI();
  cli.run().catch(console.error);
}

module.exports = VideoGeneratorCLI;