@echo off
:start
cls
echo ================================
echo   TodoList 宣传视频生成工具
echo ================================
echo.
echo 请选择操作:
echo 1. 预览视频 (启动Remotion Studio)
echo 2. 生成完整视频
echo 3. 查看帮助
echo 4. 退出
echo.
set /p choice=请输入选择 (1-4): 

if "%choice%"=="1" (
    echo.
    echo 🚀 启动预览模式...
    node scripts\generate-todolist-promo.js --preview
    echo.
    pause
    goto :start
) else if "%choice%"=="2" (
    echo.
    echo 🎬 开始生成完整视频...
    node scripts\generate-todolist-promo.js
    echo.
    pause
    goto :start
) else if "%choice%"=="3" (
    cls
    echo 📖 帮助信息:
    echo.
    echo 这是一个TodoList Web Application宣传视频生成工具
    echo 基于您提供的60秒宣传脚本创建，包含以下场景：
    echo.
    echo 场景1 ^(0-5秒^): 痛点呈现 - 展示混乱的工作状态
    echo 场景2 ^(5-10秒^): 解决方案 - 介绍TodoList应用
    echo 场景3 ^(10-30秒^): 功能展示 - 演示核心功能
    echo 场景4 ^(30-40秒^): 跨平台特性 - 多设备适配
    echo 场景5 ^(40-50秒^): 品牌理念 - AnixOps Studio介绍  
    echo 场景6 ^(50-60秒^): 行动号召 - 访问网站CTA
    echo.
    echo 💡 技术栈: React + Remotion + TypeScript
    echo 📱 输出: 1920x1080 @30fps MP4视频
    echo.
    pause
    goto :start
) else if "%choice%"=="4" (
    echo.
    echo 👋 感谢使用！
    exit /b
) else (
    echo.
    echo ❌ 无效选择，请重新输入
    echo.
    pause
    goto :start
)