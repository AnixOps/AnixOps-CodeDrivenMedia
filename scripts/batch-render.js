#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 批量渲染脚本 - 自动处理配置文件并生成视频
 */
class BatchRenderer {
  constructor() {
    this.templateDir = path.join(process.cwd(), 'templates');
    this.outputDir = path.join(process.cwd(), 'output');
    this.srcDir = path.join(process.cwd(), 'src');
  }

  /**
   * 执行批量渲染
   */
  async run() {
    try {
      console.log('🚀 开始批量渲染流程...\n');

      // 1. 扫描配置文件
      const configFiles = await this.scanConfigFiles();
      console.log(`📁 发现 ${configFiles.length} 个配置文件:`);
      configFiles.forEach(file => console.log(`   - ${file}`));
      console.log('');

      // 2. 处理每个配置文件
      for (const configFile of configFiles) {
        await this.processConfig(configFile);
      }

      console.log('✅ 批量渲染完成!');
      console.log(`📁 输出目录: ${this.outputDir}`);

    } catch (error) {
      console.error('❌ 批量渲染失败:', error.message);
      process.exit(1);
    }
  }

  /**
   * 扫描配置文件
   */
  async scanConfigFiles() {
    try {
      const files = await fs.promises.readdir(this.templateDir);
      return files.filter(file => file.endsWith('.json'));
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`模板目录不存在: ${this.templateDir}`);
      }
      throw error;
    }
  }

  /**
   * 处理单个配置文件
   */
  async processConfig(configFile) {
    const configPath = path.join(this.templateDir, configFile);
    const configName = path.basename(configFile, '.json');
    
    console.log(`🔄 处理配置: ${configFile}`);

    try {
      // 1. 加载配置
      const config = await this.loadConfig(configPath);
      console.log(`   ✓ 配置加载成功 (${config.videos.length} 个视频)`);

      // 2. 生成组件代码
      await this.generateComponents(config, configName);
      console.log(`   ✓ 组件代码生成完成`);

      // 3. 更新主索引文件
      await this.updateMainIndex(config);
      console.log(`   ✓ 主索引文件更新完成`);

      // 4. 渲染视频
      await this.renderVideos(config, configName);
      console.log(`   ✓ 视频渲染完成`);

      // 5. 生成开发文档
      await this.generateDocs(config, configName);
      console.log(`   ✓ 开发文档生成完成`);
      
      console.log('');

    } catch (error) {
      console.error(`   ❌ 处理 ${configFile} 失败:`, error.message);
      throw error;
    }
  }

  /**
   * 加载配置文件
   */
  async loadConfig(configPath) {
    const content = await fs.promises.readFile(configPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * 生成组件代码
   */
  async generateComponents(config, configName) {
    // 为每个视频生成组件
    for (const video of config.videos) {
      const componentCode = this.generateVideoComponent(video, config.globalTheme);
      const componentPath = path.join(this.srcDir, 'compositions', `Generated${video.id}.tsx`);
      
      await this.ensureDirectoryExists(path.dirname(componentPath));
      await fs.promises.writeFile(componentPath, componentCode, 'utf-8');
    }
  }

  /**
   * 生成视频组件代码
   */
  generateVideoComponent(video, globalTheme) {
    return `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { AnimatedText } from '../components/atoms/AnimatedText';
import { Logo } from '../components/atoms/Logo';

interface Generated${video.id}Props {
  // 可以添加自定义属性
}

const Generated${video.id}: React.FC<Generated${video.id}Props> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '${video.theme?.background || globalTheme?.background || '#000000'}'
    }}>
      ${this.generateScenes(video.scenes)}
    </div>
  );
};

export default Generated${video.id};
`;
  }

  /**
   * 生成场景代码
   */
  generateScenes(scenes) {
    return scenes.map((scene, index) => {
      const sceneStartFrame = scene.startTime * 30; // 假设30fps
      const sceneEndFrame = (scene.startTime + scene.duration) * 30;

      return `
      {/* Scene: ${scene.id} */}
      {frame >= ${sceneStartFrame} && frame < ${sceneEndFrame} && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        }}>
          ${this.generateElements(scene.elements)}
        </div>
      )}`;
    }).join('');
  }

  /**
   * 生成元素代码
   */
  generateElements(elements) {
    return elements.map(element => {
      switch (element.type) {
        case 'text':
          return `
          <AnimatedText
            text="${element.content.text}"
            style={{
              position: 'absolute',
              left: '${element.position.x}',
              top: '${element.position.y}',
              ${this.generateStyleCode(element.style)}
            }}
            animation="${element.animation.type}"
            duration={${element.animation.duration || 1}}
            delay={${element.animation.delay || 0}}
          />`;
        case 'logo':
          return `
          <Logo
            variant="${element.content.variant || 'full'}"
            style={{
              position: 'absolute',
              left: '${element.position.x}',
              top: '${element.position.y}',
              ${this.generateStyleCode(element.style)}
            }}
          />`;
        default:
          return `
          <div style={{
            position: 'absolute',
            left: '${element.position.x}',
            top: '${element.position.y}',
            ${this.generateStyleCode(element.style)}
          }}>
            ${element.content.text || element.type}
          </div>`;
      }
    }).join('');
  }

  /**
   * 生成样式代码
   */
  generateStyleCode(style) {
    if (!style) return '';
    
    return Object.entries(style)
      .map(([key, value]) => `${key}: '${value}',`)
      .join('\n              ');
  }

  /**
   * 更新主索引文件
   */
  async updateMainIndex(config) {
    const indexPath = path.join(this.srcDir, 'index.tsx');
    
    // 读取现有索引文件
    let indexContent = '';
    try {
      indexContent = await fs.promises.readFile(indexPath, 'utf-8');
    } catch (error) {
      // 如果文件不存在，创建基础结构
      indexContent = `import React from 'react';
import { registerRoot } from 'remotion';

export const RemotionRoot: React.FC = () => {
  return (
    <>
    </>
  );
};

registerRoot(RemotionRoot);
`;
    }

    // 为每个视频添加导入和组合
    for (const video of config.videos) {
      const importStatement = `import Generated${video.id} from './compositions/Generated${video.id}';`;
      const compositionJSX = `      <Composition
        id="${video.id}"
        component={Generated${video.id}}
        durationInFrames={${Math.floor(video.duration * (video.fps || 30))}}
        fps={${video.fps || 30}}
        width={${video.width || 1920}}
        height={${video.height || 1080}}
        defaultProps={{}}
      />`;

      // 添加导入（如果不存在）
      if (!indexContent.includes(importStatement)) {
        const lines = indexContent.split('\n');
        const lastImportIndex = lines.findIndex(line => line.startsWith('import')) + 1;
        lines.splice(lastImportIndex, 0, importStatement);
        indexContent = lines.join('\n');
      }

      // 添加组合（如果不存在）
      if (!indexContent.includes(`id="${video.id}"`)) {
        indexContent = indexContent.replace(
          '    </>',
          `${compositionJSX}\n    </>`
        );
      }
    }

    // 确保有必要的导入
    if (!indexContent.includes('import { Composition }')) {
      indexContent = indexContent.replace(
        "import React from 'react';",
        "import React from 'react';\nimport { Composition } from 'remotion';"
      );
    }

    await fs.promises.writeFile(indexPath, indexContent, 'utf-8');
  }

  /**
   * 渲染视频
   */
  async renderVideos(config, configName) {
    await this.ensureDirectoryExists(this.outputDir);

    for (const video of config.videos) {
      const outputPath = path.join(this.outputDir, `${configName}_${video.id}.mp4`);
      
      try {
        const renderCommand = `npx remotion render src/index.tsx ${video.id} "${outputPath}" --codec=h264 --crf=18`;
        execSync(renderCommand, { stdio: 'pipe' });
        console.log(`     ✓ 视频已保存: ${outputPath}`);
      } catch (error) {
        console.warn(`     ⚠️  渲染视频 ${video.id} 时出现警告`);
      }
    }
  }

  /**
   * 生成开发文档
   */
  async generateDocs(config, configName) {
    const docsDir = path.join(process.cwd(), 'docs', 'generated');
    await this.ensureDirectoryExists(docsDir);

    const docContent = this.generateDocContent(config);
    const docPath = path.join(docsDir, `${configName}-guide.md`);
    
    await fs.promises.writeFile(docPath, docContent, 'utf-8');
  }

  /**
   * 生成文档内容
   */
  generateDocContent(config) {
    return `# ${config.name} 开发指南

## 项目概述
${config.description || '自动生成的视频项目'}

## 视频列表
${config.videos.map(video => `
### ${video.name}
- **ID**: ${video.id}
- **时长**: ${video.duration}秒
- **场景数**: ${video.scenes.length}
- **描述**: ${video.description || '无描述'}
`).join('')}

## 开发需求

### 必需的组件
${this.generateRequiredComponents(config)}

### 安装依赖
\`\`\`bash
npm install
\`\`\`

### 启动开发
\`\`\`bash
npm run dev
\`\`\`

### 渲染视频
\`\`\`bash
# 渲染所有视频
node scripts/batch-render.js

# 渲染特定视频
npx remotion render src/index.tsx VideoId output.mp4
\`\`\`

## 配置说明

配置文件结构:
\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

## 自定义修改

1. 编辑 \`templates/\` 目录下的配置文件
2. 重新运行批量渲染脚本
3. 组件代码会自动重新生成

## 注意事项

- 修改配置后需要重新运行脚本
- 自定义组件请放在 \`src/components/\` 下
- 生成的组件文件不要手动修改，会被覆盖
`;
  }

  /**
   * 生成必需组件列表
   */
  generateRequiredComponents(config) {
    const components = new Set();
    
    config.videos.forEach(video => {
      video.scenes.forEach(scene => {
        scene.elements.forEach(element => {
          switch (element.type) {
            case 'text':
              components.add('- AnimatedText 组件');
              break;
            case 'logo':
              components.add('- Logo 组件');
              break;
            case 'button':
              components.add('- Button 组件');
              break;
            case 'image':
              components.add('- 图片处理组件');
              break;
          }
        });
      });
    });

    return Array.from(components).join('\n') || '- 无特殊要求';
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

// 执行脚本
if (require.main === module) {
  const renderer = new BatchRenderer();
  renderer.run().catch(console.error);
}

module.exports = BatchRenderer;