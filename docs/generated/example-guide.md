# 示例项目 开发指南

## 项目概述
这是一个使用配置生成视频的示例项目

## 视频列表

### 欢迎视频
- **ID**: Welcome
- **时长**: 10秒
- **场景数**: 1
- **描述**: 简单的欢迎信息


## 开发需求

### 必需的组件
- AnimatedText 组件

### 安装依赖
```bash
npm install
```

### 启动开发
```bash
npm run dev
```

### 渲染视频
```bash
# 渲染所有视频
node scripts/batch-render.js

# 渲染特定视频
npx remotion render src/index.tsx VideoId output.mp4
```

## 配置说明

配置文件结构:
```json
{
  "name": "示例项目",
  "description": "这是一个使用配置生成视频的示例项目",
  "version": "1.0.0",
  "videos": [
    {
      "id": "Welcome",
      "name": "欢迎视频",
      "description": "简单的欢迎信息",
      "duration": 10,
      "width": 1920,
      "height": 1080,
      "fps": 30,
      "scenes": [
        {
          "id": "main",
          "type": "intro",
          "duration": 10,
          "startTime": 0,
          "elements": [
            {
              "id": "title",
              "type": "text",
              "content": {
                "text": "欢迎使用视频生成器"
              },
              "position": {
                "x": "50%",
                "y": "50%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 2
              },
              "timing": {
                "start": 1,
                "duration": 8
              },
              "style": {
                "fontSize": "48px",
                "color": "#ffffff",
                "textAlign": "center"
              }
            }
          ]
        }
      ],
      "theme": {
        "primary": "#007acc",
        "secondary": "#ff6b6b",
        "background": "#1a1a1a",
        "text": "#ffffff"
      }
    }
  ],
  "globalTheme": {
    "primary": "#007acc",
    "secondary": "#ff6b6b",
    "background": "#1a1a1a",
    "text": "#ffffff",
    "fontFamily": "Arial, sans-serif"
  },
  "requirements": []
}
```

## 自定义修改

1. 编辑 `templates/` 目录下的配置文件
2. 重新运行批量渲染脚本
3. 组件代码会自动重新生成

## 注意事项

- 修改配置后需要重新运行脚本
- 自定义组件请放在 `src/components/` 下
- 生成的组件文件不要手动修改，会被覆盖
