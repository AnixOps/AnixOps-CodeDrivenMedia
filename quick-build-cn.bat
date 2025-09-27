@echo off
chcp 936 >nul

echo ==========================================
echo   代码驱动视频项目 - 快速构建
echo ==========================================
echo.

echo 🎬 AnixOps CodeDrivenMedia
echo 项目特点: 纯代码生成视觉内容，无需PNG图片文件
echo.

REM 检查Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo 错误: 未检测到Node.js
    pause
    exit /b 1
)

:main_menu
echo 请选择操作:
echo 1. 启动开发服务器 (推荐)
echo 2. 验证配置文件
echo 3. 生成视频
echo 4. 检查资源状态
echo 5. 完整构建 (跳过类型检查)
echo 6. 退出
echo.

set /p choice="请输入选择 (1-6): "

if "%choice%"=="6" goto :end
if "%choice%"=="5" goto :full_build
if "%choice%"=="4" goto :check_assets
if "%choice%"=="3" goto :generate_video
if "%choice%"=="2" goto :validate_config
if "%choice%"=="1" goto :dev_server
echo 无效选择，请重试。
goto :main_menu

:dev_server
echo.
echo 🚀 启动开发服务器...
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.
npm run dev
goto :end

:validate_config
echo.
echo 🔍 验证配置文件...
npm run validate-config
goto :build_complete

:generate_video
echo.
echo 🎬 生成视频...
npm run video-gen
goto :build_complete

:check_assets
echo.
echo 📁 检查资源状态...
npm run assets:status
goto :build_complete

:full_build
echo.
echo 🔧 执行完整构建（跳过类型检查）...
echo.
echo 步骤1: 验证配置...
npm run validate-config
if errorlevel 1 (
    echo ❌ 配置验证失败
    goto :build_failed
)
echo ✅ 配置验证通过
echo.

echo 步骤2: 生成视频...
npm run video-gen
if errorlevel 1 (
    echo ❌ 视频生成失败
    goto :build_failed
)
echo ✅ 视频生成完成
echo.

echo 步骤3: 检查资源...
npm run assets:check
echo ✅ 资源检查完成
echo.

goto :build_success

:build_success
echo ==========================================
echo   ✅ 构建成功完成！
echo ==========================================
echo.
echo 🎉 代码驱动构建完成！
echo 💡 提示: 运行开发服务器预览结果
echo.
goto :build_complete

:build_failed
echo ==========================================
echo   ❌ 构建失败
echo ==========================================
echo 请检查上方的错误信息
echo.
goto :build_complete

:build_complete
echo.
echo 按任意键继续...
pause >nul
goto :main_menu

:end
echo.
echo 感谢使用！
pause