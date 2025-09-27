#!/usr/bin/env node

/**
 * 简单的演示脚本
 * 用于测试视频组件渲染
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🎬 AnixOps Code-Driven Media Demo');
console.log('================================\n');
console.log('Available compositions:');
console.log('1. ProductIntro - 产品介绍视频 (30秒)');
console.log('2. BrandAnimation - 品牌动画 (5秒)');
console.log('3. FeatureDemo - 功能演示 (15秒)');
console.log('\n📁 项目结构:');
console.log('├── src/');
console.log('│   ├── components/atoms/    # 原子组件');
console.log('│   ├── compositions/        # 视频组合');
console.log('│   ├── constants/          # 主题和动画常量');
console.log('│   ├── utils/              # 工具函数');
console.log('│   └── index.tsx           # 入口文件');
console.log('├── docs/                   # 完整文档');
console.log('└── package.json           # 项目配置');

console.log('\n🚀 启动开发服务器:');
console.log('npm run dev');

console.log('\n🎨 特性展示:');
console.log('✅ React + TypeScript');
console.log('✅ Remotion 4.0 视频渲染');
console.log('✅ GSAP + Framer Motion 动画');
console.log('✅ 原子设计模式');
console.log('✅ 代码驱动的视频制作');
console.log('✅ 统一设计语言');

console.log('\n📖 查看完整文档: docs/ 目录');
console.log('🔧 技术栈文档: docs/02-技术栈选择.md');
console.log('🏗️ 架构设计: docs/03-系统架构设计.md');
console.log('⚡ 快速开始: docs/05-快速开始指南.md');