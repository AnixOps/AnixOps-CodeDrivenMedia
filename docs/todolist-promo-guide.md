# TodoList 宣传视频项目

这是基于您提供的60秒TodoList Web Application宣传脚本创建的视频生成项目。

## 📹 视频内容概述

### 场景结构 (总时长: 60秒)

| 场景 | 时间 | 内容 | 描述 |
|------|------|------|------|
| 场景1 | 0-5秒 | 痛点呈现 | 快速闪过混乱画面：散乱便签、杂乱屏幕、密集日历，最后定格在困惑用户 |
| 场景2 | 5-10秒 | 解决方案 | 混乱画面转为干净界面，TodoList Logo优雅浮现 |
| 场景3 | 10-30秒 | 功能展示 | 演示核心功能：快速创建、优先级设置、拖拽排序、主题切换 |
| 场景4 | 30-40秒 | 跨平台特性 | 多设备适配展示，PWA安装演示，离线使用功能 |
| 场景5 | 40-50秒 | 品牌理念 | AnixOps Studio品牌展示，创新、质量、卓越三大理念 |
| 场景6 | 50-60秒 | 行动号召 | 网站地址展示，点击效果，最终Logo和Slogan |

## 🚀 快速开始

### 方式1: 使用批处理文件 (推荐)
```bash
# Windows用户直接双击运行
generate-todolist-promo.bat
```

### 方式2: 使用Node.js脚本
```bash
# 预览视频
node scripts/generate-todolist-promo.js --preview

# 生成完整视频
node scripts/generate-todolist-promo.js

# 指定输出目录
node scripts/generate-todolist-promo.js --output ./my-videos
```

### 方式3: 直接使用Remotion
```bash
# 启动开发预览
npm run dev

# 渲染视频
npx remotion render TodoListPromo output/todolist-promo.mp4
```

## 📁 项目文件结构

```
├── templates/
│   └── todolist-promo.json          # 视频配置脚本
├── src/
│   └── compositions/
│       └── TodoListPromo.tsx        # 主视频组件
├── scripts/
│   └── generate-todolist-promo.js   # 生成脚本
├── generate-todolist-promo.bat      # Windows批处理文件
└── output/                          # 输出目录
```

## 🎨 自定义配置

### 修改视频内容
编辑 `src/compositions/TodoListPromo.tsx` 文件来调整：
- 动画效果和时长
- 文字内容和样式
- 颜色主题和布局
- 场景切换效果

### 修改视频配置
编辑 `templates/todolist-promo.json` 文件来调整：
- 场景时长分配
- 文字内容和旁白
- 主题颜色配置
- 音频设置

## 🎯 技术特性

- **响应式设计**: 1920x1080高清输出
- **流畅动画**: 30fps流畅播放
- **现代技术栈**: React + Remotion + TypeScript
- **模块化组件**: 每个场景独立组件，便于维护
- **配置驱动**: JSON配置文件驱动内容生成

## 🎵 音频配置

视频包含以下音频元素：
- **背景音乐**: 轻快的背景音乐 (需要添加音频文件)
- **配音**: 女声配音 (可使用TTS或真人录音)
- **音效**: 点击、切换等交互音效

### 添加音频文件
将音频文件放置在 `public/assets/` 目录下：
```
public/assets/
├── upbeat-background.mp3    # 背景音乐
└── voice-over/              # 配音文件
    ├── scene1-problem.mp3
    ├── scene2-solution.mp3
    └── ...
```

## 📊 渲染配置

默认渲染设置：
- **分辨率**: 1920x1080 (Full HD)
- **帧率**: 30fps
- **编码**: H.264
- **质量**: CRF 18 (高质量)
- **音频**: AAC 192kbps

## 🛠️ 自定义开发

### 添加新场景
1. 在 `TodoListPromo.tsx` 中创建新的场景组件
2. 在主组件中添加 `<Sequence>` 元素
3. 配置时间和动画参数

### 修改动画效果
使用Remotion提供的动画API：
- `spring()`: 弹性动画
- `interpolate()`: 数值插值
- `useCurrentFrame()`: 获取当前帧
- `Easing`: 缓动函数

## 📝 配音文本

### 场景1 (2-5秒)
> 感到任务繁多，生活杂乱无章？

### 场景2 (5.5-9.5秒)  
> 是时候，用一种更简单的方式，掌控一切。

### 场景3 (10-14秒)
> 遇见 TodoList，一款专为高效而生的现代化任务管理工具。

### 场景4 (31-39秒)
> 无论是在电脑、平板还是手机上，它都能完美适配。更支持PWA和离线使用，让您的数据永远安全，随时可用。

### 场景5 (42-48秒)
> 由 AnixOps Studio 精心打造，我们致力于用创新技术，为您创造无限可能。

### 场景6 (52-58秒)
> 现在就访问，立即开始您的极简任务管理之旅。完全免费，即刻体验！

## 🎨 品牌元素

### 颜色主题
- **主色**: #667eea (紫蓝渐变起始)
- **辅色**: #764ba2 (紫蓝渐变结束)
- **强调色**: #3498db (按钮和高亮)
- **成功色**: #2ecc71 (完成状态)
- **警告色**: #f39c12 (中优先级)
- **错误色**: #e74c3c (高优先级)

### 字体配置
```css
font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif
```

## 📈 性能优化

- 使用 `Sequence` 组件优化渲染性能
- 合理使用 `spring` 和 `interpolate` 减少重复计算
- 组件化设计提高代码复用性
- 配置化内容便于批量生成

## 🔧 故障排除

### 常见问题

**Q: 预览时看不到内容？**
A: 检查是否正确安装了依赖，运行 `npm install`

**Q: 渲染失败？**
A: 检查输出目录权限，确保有写入权限

**Q: 音频无法播放？**
A: 确保音频文件格式正确，路径无误

**Q: 动画卡顿？**
A: 尝试降低帧率或简化动画效果

## 📞 技术支持

如需技术支持或功能定制：
- 邮箱: support@anixops.com
- 项目地址: https://github.com/AnixOps/CodeDrivenMedia

---

**AnixOps Studio** - 代码驱动的卓越，创新技术的实践者