# 智慧出行本地服务器启动脚本
Write-Host "智慧出行本地服务器启动器" -ForegroundColor Green
Write-Host "=" * 40 -ForegroundColor Green

# 检测可用服务器并启动
function Test-Command {
    param($Command)
    $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Start-Server {
    param($Type, $Port)
    Write-Host "正在启动 $Type 服务器，端口: $Port..." -ForegroundColor Yellow
    Write-Host "访问地址: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host "按 Ctrl+C 停止服务器`n" -ForegroundColor Gray
}

# 检测并启动最优方案
if (Test-Command python) {
    Start-Server "Python" 8080
    python -m http.server 8080
}
elseif (Test-Command python3) {
    Start-Server "Python3" 8080
    python3 -m http.server 8080
}
elseif (Test-Command node) {
    if (Test-Command npm) {
        Start-Server "Node.js + http-server" 8080
        npx http-server -p 8080
    }
    else {
        Start-Server "Node.js内置" 3000
        node server.js
    }
}
else {
    Write-Host "未检测到Python或Node.js，将使用文件协议打开..." -ForegroundColor Red
    Start-Process "index.html"
    Read-Host "按回车键退出"
}