# 产品介绍视频 开发指南

## 项目概述
展示产品特性和优势的宣传视频

## 视频列表

### 产品展示
- **ID**: ProductShowcase
- **时长**: 30秒
- **场景数**: 3
- **描述**: 30秒产品核心功能展示


## 开发需求

### 必需的组件
- Logo 组件
- AnimatedText 组件
- Button 组件

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
  "name": "产品介绍视频",
  "description": "展示产品特性和优势的宣传视频",
  "version": "1.0.0",
  "videos": [
    {
      "id": "ProductShowcase",
      "name": "产品展示",
      "description": "30秒产品核心功能展示",
      "duration": 30,
      "width": 1920,
      "height": 1080,
      "fps": 30,
      "scenes": [
        {
          "id": "opening",
          "type": "intro",
          "duration": 5,
          "startTime": 0,
          "elements": [
            {
              "id": "logo",
              "type": "logo",
              "content": {
                "variant": "full"
              },
              "position": {
                "x": "50%",
                "y": "30%",
                "width": "300px",
                "height": "100px"
              },
              "animation": {
                "type": "zoomIn",
                "duration": 2,
                "delay": 0.5,
                "easing": "easeOutBack"
              },
              "timing": {
                "start": 0.5,
                "duration": 4
              }
            },
            {
              "id": "welcome_text",
              "type": "text",
              "content": {
                "text": "欢迎来到未来"
              },
              "position": {
                "x": "50%",
                "y": "60%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 1.5,
                "delay": 2
              },
              "timing": {
                "start": 2,
                "duration": 3
              },
              "style": {
                "fontSize": "48px",
                "color": "#ffffff",
                "textAlign": "center",
                "fontWeight": "bold"
              }
            }
          ],
          "background": {
            "type": "gradient",
            "value": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          }
        },
        {
          "id": "features",
          "type": "feature",
          "duration": 20,
          "startTime": 5,
          "elements": [
            {
              "id": "feature_title",
              "type": "text",
              "content": {
                "text": "核心功能"
              },
              "position": {
                "x": "50%",
                "y": "15%"
              },
              "animation": {
                "type": "slideIn",
                "duration": 1,
                "delay": 0
              },
              "timing": {
                "start": 0,
                "duration": 20
              },
              "style": {
                "fontSize": "36px",
                "color": "#333333",
                "textAlign": "center",
                "fontWeight": "600"
              }
            },
            {
              "id": "feature_1",
              "type": "text",
              "content": {
                "text": "🚀 快速部署"
              },
              "position": {
                "x": "25%",
                "y": "35%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 1,
                "delay": 2
              },
              "timing": {
                "start": 2,
                "duration": 18
              },
              "style": {
                "fontSize": "28px",
                "color": "#2c3e50"
              }
            },
            {
              "id": "feature_2",
              "type": "text",
              "content": {
                "text": "💡 智能优化"
              },
              "position": {
                "x": "75%",
                "y": "35%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 1,
                "delay": 4
              },
              "timing": {
                "start": 4,
                "duration": 16
              },
              "style": {
                "fontSize": "28px",
                "color": "#2c3e50"
              }
            },
            {
              "id": "feature_3",
              "type": "text",
              "content": {
                "text": "🔒 安全可靠"
              },
              "position": {
                "x": "25%",
                "y": "55%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 1,
                "delay": 6
              },
              "timing": {
                "start": 6,
                "duration": 14
              },
              "style": {
                "fontSize": "28px",
                "color": "#2c3e50"
              }
            },
            {
              "id": "feature_4",
              "type": "text",
              "content": {
                "text": "📊 数据分析"
              },
              "position": {
                "x": "75%",
                "y": "55%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 1,
                "delay": 8
              },
              "timing": {
                "start": 8,
                "duration": 12
              },
              "style": {
                "fontSize": "28px",
                "color": "#2c3e50"
              }
            },
            {
              "id": "cta_button",
              "type": "button",
              "content": {
                "text": "立即体验"
              },
              "position": {
                "x": "50%",
                "y": "75%",
                "width": "200px",
                "height": "60px"
              },
              "animation": {
                "type": "bounce",
                "duration": 0.5,
                "delay": 15
              },
              "timing": {
                "start": 15,
                "duration": 5
              },
              "style": {
                "backgroundColor": "#e74c3c",
                "color": "#ffffff",
                "borderRadius": "30px",
                "fontSize": "20px",
                "fontWeight": "bold",
                "border": "none",
                "cursor": "pointer"
              }
            }
          ],
          "background": {
            "type": "color",
            "value": "#f8f9fa"
          }
        },
        {
          "id": "closing",
          "type": "outro",
          "duration": 5,
          "startTime": 25,
          "elements": [
            {
              "id": "thank_you",
              "type": "text",
              "content": {
                "text": "感谢观看"
              },
              "position": {
                "x": "50%",
                "y": "40%"
              },
              "animation": {
                "type": "typewriter",
                "duration": 2,
                "delay": 1
              },
              "timing": {
                "start": 1,
                "duration": 4
              },
              "style": {
                "fontSize": "42px",
                "color": "#ffffff",
                "textAlign": "center",
                "fontWeight": "300"
              }
            },
            {
              "id": "contact_info",
              "type": "text",
              "content": {
                "text": "联系我们: hello@example.com"
              },
              "position": {
                "x": "50%",
                "y": "60%"
              },
              "animation": {
                "type": "fadeIn",
                "duration": 1,
                "delay": 3
              },
              "timing": {
                "start": 3,
                "duration": 2
              },
              "style": {
                "fontSize": "24px",
                "color": "#cccccc",
                "textAlign": "center"
              }
            }
          ],
          "background": {
            "type": "gradient",
            "value": "linear-gradient(45deg, #2c3e50 0%, #34495e 100%)"
          }
        }
      ],
      "theme": {
        "primary": "#3498db",
        "secondary": "#e74c3c",
        "accent": "#f39c12",
        "background": "#ecf0f1",
        "text": "#2c3e50"
      }
    }
  ],
  "globalTheme": {
    "primary": "#3498db",
    "secondary": "#e74c3c",
    "accent": "#f39c12",
    "background": "#ecf0f1",
    "text": "#2c3e50",
    "fontFamily": "Inter, sans-serif"
  },
  "requirements": [
    {
      "file": "src/components/atoms/AnimatedText.tsx",
      "description": "需要支持多种动画效果的文本组件",
      "dependencies": [
        "remotion",
        "framer-motion"
      ]
    },
    {
      "file": "src/components/atoms/Logo.tsx",
      "description": "需要支持多种变体的Logo组件",
      "dependencies": [
        "remotion"
      ]
    },
    {
      "file": "src/components/atoms/Button.tsx",
      "description": "需要支持动画效果的按钮组件",
      "dependencies": [
        "remotion"
      ]
    }
  ]
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
