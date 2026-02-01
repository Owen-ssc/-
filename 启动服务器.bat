@echo off
title 智慧出行本地服务器
chcp 65001 >nul

:: 获取当前目录的绝对路径
set "CURRENT_DIR=%~dp0"
set "CURRENT_DIR=%CURRENT_DIR:~0,-1%"

echo 正在启动智慧出行本地服务器...
echo 当前目录: %CURRENT_DIR%
echo.

:: 检查server.js是否存在
if exist "%CURRENT_DIR%\server.js" (
    echo 检测到server.js，使用Node.js启动...
    cd /d "%CURRENT_DIR%"
    node server.js
    pause
    exit /b
)

:: 检查index.html是否存在
if exist "%CURRENT_DIR%\index.html" (
    echo 检测到index.html，使用Python启动...
    cd /d "%CURRENT_DIR%"
    python -m http.server 8080
    if errorlevel 1 (
        echo Python未安装，使用文件协议打开...
        start "" "%CURRENT_DIR%\index.html"
    )
    pause
    exit /b
)

echo 错误：未找到index.html文件！
echo 请确认文件路径: %CURRENT_DIR%
pause