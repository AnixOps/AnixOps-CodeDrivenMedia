#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * 演示脚本 - 展示完整的扩展性视频生成流程
 */
async function runDemo() {
  console.log(`
🎬 AnixOps 扩展性视频生成系统演示
=====================================

这个演示将展示如何通过配置文件自动生成视频，
并告诉开发者需要哪些代码文件。

`);

  try {
    // 步骤 1: 显示配置文件
    console.log('📋 步骤 1: 展示配置文件');
    console.log('----------------------------------------');
    
    const configPath = path.join('templates', 'product-showcase.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      console.log('配置文件内容预览:');
      console.log(`  项目名称: ${config.name}`);
      console.log(`  视频数量: ${config.videos.length}`);
      console.log(`  主视频ID: ${config.videos[0].id}`);
      console.log(`  视频时长: ${config.videos[0].duration}秒`);
      console.log(`  场景数量: ${config.videos[0].scenes.length}`);
      console.log(`  元素总数: ${config.videos[0].scenes.reduce((sum, scene) => sum + scene.elements.length, 0)}`);
    } else {
      console.log('⚠️  配置文件不存在，请先运行 npm run video-init');
      return;
    }

    // 步骤 2: 验证配置
    console.log('\n🔍 步骤 2: 验证配置文件');
    console.log('----------------------------------------');
    
    try {
      execSync('node scripts/validate-config.js templates/product-showcase.json', { stdio: 'inherit' });
    } catch (error) {
      console.log('验证过程中发现问题，但继续演示...');
    }

    // 步骤 3: 分析需求
    console.log('\n📋 步骤 3: 分析代码需求');
    console.log('----------------------------------------');
    
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    console.log('系统分析配置后，告诉开发者需要以下代码:');
    console.log('');
    
    // 分析元素类型
    const elementTypes = new Set();
    config.videos.forEach(video => {
      video.scenes.forEach(scene => {
        scene.elements.forEach(element => {
          elementTypes.add(element.type);
        });
      });
    });

    console.log('📦 需要的组件类型:');
    elementTypes.forEach(type => {
      switch (type) {
        case 'text':
          console.log('  ✓ AnimatedText 组件 - 支持淡入、滑动、打字机等动画');
          break;
        case 'logo':
          console.log('  ✓ Logo 组件 - 支持多种变体显示');
          break;
        case 'button':
          console.log('  ✓ Button 组件 - 支持动画和交互效果');
          break;
        case 'image':
          console.log('  ✓ 图片处理组件 - 支持加载和动画效果');
          break;
        case 'code':
          console.log('  ✓ CodeBlock 组件 - 支持语法高亮');
          break;
      }
    });

    console.log('\n📁 需要创建的文件:');
    config.videos.forEach(video => {
      console.log(`  ✓ src/compositions/Generated${video.id}.tsx`);
    });

    console.log('\n🔧 需要安装的依赖:');
    if (elementTypes.has('code')) {
      console.log('  npm install prismjs react-syntax-highlighter');
    }
    console.log('  npm install framer-motion (动画增强)');
    console.log('  npm install clsx (样式管理)');

    // 步骤 4: 生成代码示例
    console.log('\n⚙️  步骤 4: 生成代码示例');
    console.log('----------------------------------------');

    const sampleComponent = generateSampleComponent(config.videos[0]);
    console.log('生成的组件代码示例:');
    console.log('```tsx');
    console.log(sampleComponent.substring(0, 800) + '...');
    console.log('```');

    // 步骤 5: 显示命令
    console.log('\n🚀 步骤 5: 执行命令');
    console.log('----------------------------------------');
    console.log('开发者现在可以运行以下命令:');
    console.log('');
    console.log('1. 初始化项目:');
    console.log('   npm run video-init');
    console.log('');
    console.log('2. 验证配置:');
    console.log('   npm run video-validate');
    console.log('');
    console.log('3. 生成并渲染视频:');
    console.log('   npm run video-render');
    console.log('');
    console.log('4. 只生成代码:');
    console.log('   npm run video-gen generate');
    console.log('');

    // 步骤 6: 展示输出结构
    console.log('📁 步骤 6: 输出文件结构');
    console.log('----------------------------------------');
    console.log('完成后将生成以下文件:');
    console.log('');
    console.log('src/compositions/');
    config.videos.forEach(video => {
      console.log(`├── Generated${video.id}.tsx`);
    });
    console.log('');
    console.log('output/');
    config.videos.forEach(video => {
      console.log(`├── product-showcase_${video.id}.mp4`);
    });
    console.log('');
    console.log('docs/generated/');
    console.log('├── product-showcase-guide.md');
    console.log('└── development-requirements.md');

    console.log('\n✅ 演示完成！');
    console.log('=====================================');
    console.log('');
    console.log('🎯 总结:');
    console.log('1. 开发者只需要编写配置文件');
    console.log('2. 系统自动分析并告诉需要哪些代码');
    console.log('3. 系统生成所有必要的组件代码');
    console.log('4. 系统自动渲染视频文件');
    console.log('5. 系统生成详细的开发文档');
    console.log('');
    console.log('🚀 开始使用: npm run video-init');

  } catch (error) {
    console.error('演示过程出错:', error.message);
  }
}

/**
 * 生成示例组件代码
 */
function generateSampleComponent(video) {
  return `import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import AnimatedText from '../components/atoms/AnimatedText';
import Logo from '../components/atoms/Logo';
import Button from '../components/atoms/Button';

const Generated${video.id}: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '${video.theme?.background || '#1a1a1a'}'
    }}>
      {/* 场景渲染逻辑 */}
      ${video.scenes.map(scene => 
        `{/* Scene: ${scene.id} */}`
      ).join('\n      ')}
    </div>
  );
};

export default Generated${video.id};`;
}

// 运行演示
if (require.main === module) {
  runDemo().catch(console.error);
}

module.exports = { runDemo };