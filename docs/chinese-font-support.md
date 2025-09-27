# 中文字体支持指南

本项目已集成完整的中文字体支持系统，确保在 Remotion 视频渲染中正确显示中文内容。

## 📋 功能特性

### ✅ 已配置的中文字体支持
- **简体中文**: Noto Sans SC, PingFang SC, Microsoft YaHei 等
- **繁体中文**: Noto Sans TC, PingFang TC, Microsoft JhengHei 等
- **通用支持**: 自动适配简繁体中文
- **等宽字体**: 代码和终端文本的中文支持

### 🔧 技术实现

#### 1. 工作流配置 (`.github/workflows/production-video-build.yml`)
```yaml
# 安装中文字体
fonts-noto-cjk \
fonts-noto-cjk-extra \
fonts-wqy-zenhei \
fonts-wqy-microhei \
language-pack-zh-hans \
language-pack-zh-hant

# 配置中文环境变量
LANG: zh_CN.UTF-8
LC_ALL: zh_CN.UTF-8
LANGUAGE: zh_CN:zh:en_US:en
```

#### 2. Remotion 配置 (`remotion.config.ts`)
```typescript
browserArgs: [
  '--font-render-hinting=none',
  '--disable-font-subpixel-positioning',
  '--lang=zh-CN',
  '--disable-web-security',
  '--force-color-profile=srgb'
]
```

#### 3. 字体样式 (`src/styles/fonts.css`)
- 完整的中文字体 CSS 定义
- 响应式字体大小
- 渲染优化设置

#### 4. 字体工具函数 (`src/utils/chinese-fonts.ts`)
- 统一的中文字体处理
- 自动字体选择
- 预定义样式模板

## 🚀 使用方法

### 基础用法

```tsx
import { getVideoChineseTextStyle, CHINESE_TEXT_STYLES } from '@/utils/chinese-fonts';

// 使用预定义样式
<div style={CHINESE_TEXT_STYLES.heading1}>
  标题文本
</div>

// 自定义样式
<div style={getVideoChineseTextStyle({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#333333'
})}>
  自定义中文文本
</div>
```

### 在 TodoListPromo 组件中的应用

```tsx
// 标题文本
<div style={{
  ...getVideoChineseTextStyle({
    fontSize: '48px',
    fontWeight: 'bold',
    textAlign: 'center'
  }),
  textShadow: '0 4px 8px rgba(0,0,0,0.3)'
}}>
  隆重推出: TodoList
</div>

// 描述文本
<div style={{
  ...CHINESE_TEXT_STYLES.bodyLarge,
  color: '#ffffff'
}}>
  让任务管理变得简单高效
</div>
```

## 📖 API 参考

### `getVideoChineseTextStyle(options)`

生成适用于视频渲染的中文文本样式。

**参数:**
- `fontType`: 字体类型 (`'simplified' | 'traditional' | 'universal' | 'monospace'`)
- `fontSize`: 字体大小
- `fontWeight`: 字体粗细
- `lineHeight`: 行高
- `letterSpacing`: 字符间距
- `color`: 文字颜色
- `textShadow`: 文字阴影
- `textAlign`: 文字对齐

### `CHINESE_TEXT_STYLES`

预定义的中文文本样式:
- `heading1`, `heading2`, `heading3`: 标题样式
- `body`, `bodyLarge`, `bodySmall`: 正文样式
- `caption`: 标签样式
- `code`: 代码样式

### 工具函数

```typescript
// 检测中文字符
containsChinese(text: string): boolean

// 检测繁体中文
containsTraditionalChinese(text: string): boolean

// 自动选择字体
getAutoChineseFont(text: string): string
```

## 🔍 测试和验证

### 本地测试
```bash
# 启动开发服务器
npm run dev

# 预览渲染效果
npm run preview
```

### 生产环境测试
```bash
# 触发生产构建
git push origin production

# 检查 GitHub Actions 输出
# 下载生成的视频文件验证中文显示效果
```

## 🐛 常见问题

### Q: 中文字符显示为方块或乱码？
**A**: 检查以下配置:
1. 确保 `fonts.css` 已正确导入
2. 验证 `remotion.config.ts` 中的 `browserArgs` 配置
3. 检查系统是否安装了必要的中文字体包

### Q: 字体渲染效果不理想？
**A**: 调整以下参数:
1. 使用 `getVideoChineseTextStyle` 函数的 `textShadow` 参数
2. 调整 `letterSpacing` 改善字符间距
3. 设置合适的 `fontWeight` 提升清晰度

### Q: 在 GitHub Actions 中字体加载失败？
**A**: 确认工作流配置:
1. 检查字体包是否正确安装
2. 验证环境变量设置
3. 确认 `fc-cache -fv` 命令执行成功

## 📚 扩展资源

- [Noto Sans CJK 字体文档](https://fonts.google.com/noto/fonts)
- [Remotion 浏览器配置](https://www.remotion.dev/docs/config#browser-args)
- [CSS 字体最佳实践](https://web.dev/font-best-practices/)

## 🤝 贡献指南

如需改进中文字体支持:

1. 修改 `src/utils/chinese-fonts.ts` 添加新的字体配置
2. 更新 `src/styles/fonts.css` 添加新的 CSS 规则
3. 在 `remotion.config.ts` 中调整浏览器参数
4. 更新此文档说明新功能

---

**注意**: 所有中文字体配置都已针对 Remotion 视频渲染进行优化，确保在各种设备和平台上的兼容性。