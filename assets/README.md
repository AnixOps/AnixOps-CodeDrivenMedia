# Assets 文件夹

这个文件夹存放所有视频项目需要的静态资源文件。

## 所需图片文件

### TodoList宣传视频所需图片：

1. **messy-notes.png** - 散乱的便签图片
   - 用途：展示任务管理混乱的痛点
   - 建议尺寸：800x600px
   - 风格：真实感的散乱便签纸

2. **cluttered-desktop.png** - 混乱的桌面截图
   - 用途：展示工作环境混乱
   - 建议尺寸：1920x1080px
   - 风格：真实的桌面截图，文件散乱

3. **busy-calendar.png** - 忙碌的日历图片
   - 用途：展示时间管理困难
   - 建议尺寸：800x600px
   - 风格：密集的日历安排

4. **confused-user.png** - 困惑用户图片
   - 用途：展示用户痛点
   - 建议尺寸：400x400px
   - 风格：表情困惑的人物图像

5. **todolist-logo.png** - TodoList应用Logo
   - 用途：品牌标识
   - 建议尺寸：512x512px（透明背景）
   - 风格：现代简洁的Logo设计

6. **todolist-interface.png** - TodoList界面截图
   - 用途：展示产品界面
   - 建议尺寸：1200x800px
   - 风格：清爽的Web应用界面

7. **anixops-logo.png** - AnixOps公司Logo
   - 用途：公司品牌标识
   - 建议尺寸：512x512px（透明背景）
   - 风格：专业的公司Logo

## 使用说明

1. 将图片文件放入此文件夹
2. 确保文件名与上述列表完全一致
3. 运行 `npm run assets:validate` 检查文件完整性
4. 运行 `npm run assets:optimize` 优化图片大小

## 自动化脚本

- `npm run assets:check` - 检查缺失的资源文件
- `npm run assets:validate` - 验证所有资源文件
- `npm run assets:optimize` - 优化图片文件大小
- `npm run assets:backup` - 备份资源文件
- `npm run assets:restore` - 恢复资源文件