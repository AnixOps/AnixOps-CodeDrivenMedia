# 资源文件管理系统

AnixOps CodeDrivenMedia 资源文件管理系统提供了完整的静态资源管理解决方案。

## 📁 目录结构

```
├── assets/                    # 静态资源文件夹
│   ├── README.md             # 资源文件说明
│   ├── messy-notes.png       # 散乱便签图片
│   ├── cluttered-desktop.png # 混乱桌面图片
│   ├── busy-calendar.png     # 忙碌日历图片
│   ├── confused-user.png     # 困惑用户图片
│   ├── todolist-logo.png     # TodoList Logo
│   ├── todolist-interface.png # TodoList界面
│   └── anixops-logo.png      # AnixOps Logo
├── scripts/assets/           # 资源管理脚本
│   ├── manager.js           # 主管理脚本
│   ├── check.js             # 资源检查脚本
│   ├── validate.js          # 资源验证脚本
│   ├── optimize.js          # 资源优化脚本
│   └── backup.js            # 备份恢复脚本
└── backups/assets/          # 资源备份文件夹
```

## 🚀 快速开始

### 1. 初始化资源系统
```bash
npm run assets:init
```

### 2. 检查资源状态
```bash
npm run assets:status
```

### 3. 执行完整检查
```bash
npm run assets:full-check
```

## 📋 可用命令

### 基础命令
- `npm run assets` - 显示帮助信息
- `npm run assets:init` - 初始化资源文件系统
- `npm run assets:status` - 显示资源文件状态总览

### 检查和验证
- `npm run assets:check` - 检查所需的资源文件
- `npm run assets:validate` - 验证资源文件的完整性和有效性
- `npm run assets:full-check` - 执行完整的检查流程

### 优化和备份
- `npm run assets:optimize` - 优化资源文件大小（模拟模式）
- `npm run assets:backup` - 创建资源文件备份
- `npm run assets:restore` - 恢复资源文件备份
- `npm run assets:list-backups` - 列出所有备份
- `npm run assets:cleanup` - 清理旧备份（保留最新5个）

## 🔧 构建流程

### 完整构建
```bash
npm run build
# 或者使用批处理文件
build.bat
```

### 快速构建（仅关键步骤）
```bash
npm run build:quick
```

### 开发构建（跳过备份和优化）
```bash
npm run build:dev
```

## 📊 构建流程说明

完整构建流程包含以下步骤：

1. **资源检查** ✅ - 检查所需的PNG图片文件是否存在
2. **资源验证** - 验证图片文件的完整性和格式
3. **创建备份** - 备份当前的资源文件
4. **配置验证** ✅ - 验证项目配置文件
5. **视频生成** ✅ - 生成视频文件

> ✅ 标记的步骤为关键步骤，失败会停止构建

## 🎯 所需资源文件

TodoList宣传视频需要以下7个PNG图片文件：

| 文件名 | 用途 | 建议尺寸 | 说明 |
|--------|------|----------|------|
| `messy-notes.png` | 痛点展示 | 800x600px | 散乱的便签纸效果 |
| `cluttered-desktop.png` | 痛点展示 | 1920x1080px | 混乱的桌面截图 |
| `busy-calendar.png` | 痛点展示 | 800x600px | 密集的日程安排 |
| `confused-user.png` | 痛点展示 | 400x400px | 困惑表情的人物 |
| `todolist-logo.png` | 品牌标识 | 512x512px | 透明背景PNG |
| `todolist-interface.png` | 产品展示 | 1200x800px | 清爽的界面截图 |
| `anixops-logo.png` | 公司标识 | 512x512px | 透明背景PNG |

## 🛠️ 资源文件准备

1. **准备图片文件**：按照上表要求准备7个PNG图片文件
2. **放入assets文件夹**：将文件放入 `assets/` 目录
3. **运行检查**：执行 `npm run assets:check` 验证
4. **开始构建**：运行 `npm run build` 或 `build.bat`

## 📈 最佳实践

### 文件命名
- 使用小写字母和连字符
- 文件名要有描述性
- 保持一致的命名规范

### 文件优化
- PNG文件适合透明背景的Logo
- JPEG文件适合照片和复杂图像
- 控制文件大小，建议单个文件不超过2MB
- 使用适当的分辨率

### 版本管理
- 定期创建备份：`npm run assets:backup`
- 重要修改前先备份
- 使用有意义的备份命名

### 开发工作流
1. 添加新资源文件到 `assets/` 文件夹
2. 运行 `npm run assets:check` 检查
3. 运行 `npm run assets:validate` 验证
4. 如需要，运行 `npm run assets:optimize` 优化
5. 运行 `npm run build` 执行完整构建

## 🚨 故障排除

### 常见问题

**Q: 提示缺少PNG文件**
A: 检查 `assets/` 文件夹，确保所需的7个PNG文件都存在且文件名正确

**Q: 验证失败**
A: 检查图片文件是否损坏，确保文件大小不为0

**Q: 构建失败**
A: 查看具体的错误信息，通常是资源文件或配置问题

**Q: 备份失败**
A: 检查磁盘空间和文件权限

### 获取帮助

- 运行 `npm run assets` 查看完整的命令列表
- 运行 `npm run assets:status` 查看当前状态
- 查看 `assets/README.md` 了解详细的文件要求

## 🔄 更新日志

- **v1.0.0** - 初始版本，支持基础的资源管理功能
- 资源检查、验证、优化和备份功能
- 完整的构建流程集成
- Windows批处理脚本支持