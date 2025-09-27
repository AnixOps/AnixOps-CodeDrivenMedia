@echo off
chcp 65001 >nul
echo ==========================================
echo   Code-Driven Video Project - Quick Build
echo ==========================================
echo.

echo 🎬 AnixOps CodeDrivenMedia
echo Project: Pure code-generated visual content, no PNG files needed
echo.

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js not detected
    pause
    exit /b 1
)

:main_menu
echo Please select an operation:
echo 1. Start Development Server (Recommended)
echo 2. Validate Configuration Files
echo 3. Generate Videos
echo 4. Check Assets Status
echo 5. Full Build (Skip Type Check)
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="6" goto :end
if "%choice%"=="5" goto :full_build
if "%choice%"=="4" goto :check_assets
if "%choice%"=="3" goto :generate_video
if "%choice%"=="2" goto :validate_config
if "%choice%"=="1" goto :dev_server
echo Invalid choice. Please try again.
goto :main_menu

:dev_server
echo.
echo 🚀 Starting Development Server...
echo Server will start at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev
goto :end

:validate_config
echo.
echo 🔍 Validating configuration files...
npm run validate-config
goto :build_complete

:generate_video
echo.
echo 🎬 Generating videos...
npm run video-gen
goto :build_complete

:check_assets
echo.
echo 📁 Checking assets status...
npm run assets:status
goto :build_complete

:full_build
echo.
echo 🔧 Executing full build (skip type check)...
echo.
echo Step 1: Validating configuration...
npm run validate-config
if errorlevel 1 (
    echo ❌ Configuration validation failed
    goto :build_failed
)
echo ✅ Configuration validation passed
echo.

echo Step 2: Generating videos...
npm run video-gen
if errorlevel 1 (
    echo ❌ Video generation failed
    goto :build_failed
)
echo ✅ Video generation completed
echo.

echo Step 3: Checking assets...
npm run assets:check
echo ✅ Assets check completed
echo.

goto :build_success

:build_success
echo ==========================================
echo   ✅ Build completed successfully!
echo ==========================================
echo.
echo 🎉 Code-driven build completed!
echo 💡 Tip: Run development server to preview results
echo.
goto :build_complete

:build_failed
echo ==========================================
echo   ❌ Build failed
echo ==========================================
echo Please check the error information above
echo.
goto :build_complete

:build_complete
echo.
echo Press any key to continue...
pause >nul
goto :main_menu

:end
echo.
echo Thank you for using!