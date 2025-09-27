# 🎬 AnixOps 扩展性视频生成系统

## 📖 概述

这是一个革命性的视频生成系统，让你能够通过简单的配置文件自动生成专业的视频内容。无需编写复杂的代码，只需要定义你想要的内容，系统会自动：

1. **生成所需的 React 组件代码**
2. **告诉你需要哪些依赖和文件**
3. **自动渲染视频文件**

## 🚀 快速开始

### 1. 初始化项目
```bash
npm run video-init
```

这会创建：
- `templates/` 目录 - 存放配置文件
- `output/` 目录 - 存放生成的视频
- 示例配置文件
- 必要的目录结构

### 2. 编辑配置文件

打开 `templates/example.json`，你会看到类似这样的配置：

```json
{
  "name": "我的视频项目",
  "videos": [
    {
      "id": "Welcome",
      "name": "欢迎视频",
      "duration": 10,
      "scenes": [
        {
          "id": "main",
          "duration": 10,
          "startTime": 0,
          "elements": [
            {
              "id": "title",
              "type": "text",
              "content": { "text": "欢迎使用！" },
              "position": { "x": "50%", "y": "50%" },
              "animation": { "type": "fadeIn", "duration": 2 }
            }
          ]
        }
      ]
    }
  ]
}
```

### 3. 验证配置
```bash
npm run video-validate
```

### 4. 生成视频
```bash
npm run video-render
```

系统会自动：
- 生成 React 组件代码
- 更新 Remotion 配置
- 渲染视频文件
- 生成开发文档

## 📋 配置文件详解

### 项目配置
```json
{
  "name": "项目名称",
  "description": "项目描述",
  "version": "1.0.0",
  "videos": [/* 视频配置数组 */],
  "globalTheme": {/* 全局主题 */},
  "requirements": [/* 代码需求 */]
}
```

### 视频配置
```json
{
  "id": "VideoId",           // 唯一标识符
  "name": "视频名称",         // 显示名称
  "duration": 30,            // 总时长(秒)
  "width": 1920,             // 宽度
  "height": 1080,            // 高度
  "fps": 30,                 // 帧率
  "scenes": [/* 场景数组 */],
  "theme": {/* 视频主题 */}
}
```

### 场景配置
```json
{
  "id": "scene1",            // 场景ID
  "type": "intro",           // 场景类型
  "duration": 5,             // 持续时间(秒)
  "startTime": 0,            // 开始时间(秒)
  "elements": [/* 元素数组 */],
  "background": {/* 背景设置 */}
}
```

### 元素配置
```json
{
  "id": "element1",          // 元素ID
  "type": "text",            // 元素类型
  "content": {/* 内容 */},
  "position": {              // 位置
    "x": "50%", "y": "30%"
  },
  "animation": {             // 动画设置
    "type": "fadeIn",
    "duration": 2,
    "delay": 0.5
  },
  "style": {/* 样式 */}
}
```

## 🎨 支持的元素类型

### 文本 (text)
```json
{
  "type": "text",
  "content": {
    "text": "显示的文字"
  },
  "style": {
    "fontSize": "48px",
    "color": "#ffffff",
    "fontWeight": "bold"
  }
}
```

### Logo (logo)
```json
{
  "type": "logo",
  "content": {
    "variant": "full"  // full, minimal, icon
  }
}
```

### 图片 (image)
```json
{
  "type": "image",
  "content": {
    "src": "path/to/image.jpg",
    "alt": "图片描述"
  }
}
```

### 按钮 (button)
```json
{
  "type": "button",
  "content": {
    "text": "点击按钮"
  },
  "style": {
    "backgroundColor": "#007acc",
    "borderRadius": "8px"
  }
}
```

### 代码块 (code)
```json
{
  "type": "code",
  "content": {
    "code": "console.log('Hello World');",
    "language": "javascript"
  }
}
```

## 🎭 动画类型

- `fadeIn` / `fadeOut` - 淡入淡出
- `slideIn` / `slideOut` - 滑动进入退出
- `zoomIn` / `zoomOut` - 缩放动画
- `rotate` - 旋转动画
- `typewriter` - 打字机效果
- `bounce` - 弹跳效果
- `elastic` - 弹性动画

## 🎨 主题配置

```json
{
  "globalTheme": {
    "primary": "#007acc",      // 主色
    "secondary": "#ff6b6b",    // 辅色
    "accent": "#4ecdc4",       // 强调色
    "background": "#1a1a1a",   // 背景色
    "text": "#ffffff",         // 文字色
    "fontFamily": "Arial, sans-serif"
  }
}
```

## 🛠️ 命令行工具

### 基础命令
```bash
npm run video-gen help          # 显示帮助
npm run video-gen init          # 初始化项目
npm run video-gen list          # 列出配置文件
npm run video-gen validate     # 验证所有配置
npm run video-gen all           # 执行完整流程
```

### 高级命令
```bash
# 验证特定文件
npm run video-gen validate templates/my-video.json

# 只生成代码（不渲染）
npm run video-gen generate

# 只渲染视频
npm run video-gen render

# 渲染特定配置
npm run video-gen render --config=my-video
```

## 📁 项目结构

```
├── templates/              # 配置文件目录
│   ├── example.json
│   ├── product-showcase.json
│   └── tech-demo.json
├── src/
│   ├── compositions/       # 自动生成的视频组件
│   ├── generators/         # 代码生成器
│   ├── types/             # 类型定义
│   └── components/        # 可复用组件
├── scripts/               # 自动化脚本
│   ├── video-gen.js       # 主命令行工具
│   ├── batch-render.js    # 批量渲染
│   └── validate-config.js # 配置验证
├── output/                # 渲染输出目录
└── docs/generated/        # 自动生成文档
```

## 💡 工作流程

1. **编写配置** - 在 `templates/` 目录创建 JSON 配置文件
2. **验证配置** - 运行 `npm run video-validate` 检查格式
3. **生成代码** - 系统自动生成所需的 React 组件
4. **获取需求** - 系统告诉你需要安装哪些依赖
5. **渲染视频** - 自动渲染成 MP4 文件

## 📋 系统告诉你需要的代码

当你运行生成命令时，系统会输出类似信息：

```
✅ 代码生成完成！

📋 需要的组件:
- src/components/atoms/AnimatedText.tsx (已生成模板)
- src/components/atoms/Logo.tsx (需要手动创建)
- src/components/elements/CodeBlock.tsx (需要手动创建)

📦 需要安装的依赖:
- npm install prismjs react-syntax-highlighter
- npm install recharts (如果使用图表)

📖 生成的文档:
- docs/generated/project-guide.md
```

## 🔧 自定义扩展

### 添加新的元素类型

1. 在 `src/generators/ElementGenerator.ts` 中添加处理逻辑
2. 在 `src/types/config.ts` 中更新类型定义
3. 创建对应的组件模板

### 添加新的动画类型

1. 在配置中使用新的动画名称
2. 在组件中实现对应的动画逻辑
3. 更新文档说明

## 📊 示例配置文件

项目包含几个示例配置：

- `product-showcase.json` - 产品展示视频
- `tech-demo.json` - 技术演示视频
- `example.json` - 简单示例

你可以复制这些文件并修改成你需要的内容。

## 🤝 贡献指南

1. 创建新的配置模板
2. 提交有用的组件
3. 改进文档
4. 报告 Bug

## 📞 支持

如果你在使用过程中遇到问题：

1. 查看 `docs/generated/` 目录下的文档
2. 运行 `npm run video-validate` 检查配置
3. 查看生成的代码了解需要什么组件

---

🎉 **现在你可以通过配置文件自动生成视频了！**