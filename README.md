# AnixOps CodeDriven Media

> 用代码驱动的方式制作高质量、可复用的宣传片和动画内容

## 🎯 项目理念

作为开发者工作室，我们相信**代码驱动的内容制作**能够实现：
- 🎨 **设计语言统一**：宣传片与产品视觉100%一致
- 🔄 **高效复用**：组件化的动画可快速复制到新项目
- 📋 **版本管理**：像管理代码一样管理视频内容
- 🎛️ **精准控制**：每一帧都可代码控制
- 📊 **数据驱动**：动态生成不同版本的宣传内容

## 🛠️ 技术栈

- **Remotion** - React-based视频生成框架
- **GSAP** - 高级动画库
- **Framer Motion** - React动画组件
- **Figma** - UI设计与SVG导出
- **TypeScript** - 类型安全的开发体验

## 📚 文档结构

- [📋 完整工作流程](./docs/workflow.md)
- [🔧 技术实现方案](./docs/technical-implementation.md)
- [🎨 设计规范](./docs/design-guidelines.md)
- [📦 项目架构](./docs/project-architecture.md)
- [🚀 部署指南](./docs/deployment-guide.md)
- [📝 最佳实践](./docs/best-practices.md)

## 🌟 核心优势

### 传统视频制作 vs 代码驱动制作

| 维度 | 传统方式 | 代码驱动 |
|------|----------|----------|
| 设计一致性 | 手动保证，易出错 | 自动统一，100%准确 |
| 修改成本 | 重新渲染，耗时长 | 改参数即可，秒级更新 |
| 版本管理 | 文件名版本号 | Git完整历史 |
| 团队协作 | 文件传输 | 代码Review |
| 复用能力 | 复制粘贴 | 组件化复用 |
| 数据驱动 | 手动替换 | 程序化生成 |

## 🎬 示例项目

本仓库将包含以下示例：
- [ ] **产品介绍视频** - 展示软件界面和核心功能
- [ ] **功能演示动画** - 突出特定功能点
- [ ] **Logo动画** - 品牌标识动效
- [ ] **Loading动画** - 可直接用于产品的加载动画

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/AnixOps/AnixOps-CodeDrivenMedia.git
cd AnixOps-CodeDrivenMedia

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 生成视频
npm run build
```

## � 持续集成渲染

- 推送到 `production` 分支后，GitHub Actions 会自动运行 **Production Video Build** 工作流。
- 工作流会安装 Remotion 所需的系统依赖，执行类型检查和代码规范检查，并渲染 `BrandAnimation`、`Wainting-1`、`TodoListPromo` 三个组合。
- 渲染完成的视频会作为构建产物（artifact）上传，可在 Actions 运行详情页直接下载。

## �📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件