const { app, BrowserWindow, protocol, ipcMain } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');

function createWindow() {
  // 创建浏览器窗口
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      nodeIntegration: false, // 禁用 nodeIntegration
      contextIsolation: true, // 启用上下文隔离
      enableRemoteModule: false, // 禁用 remote 模块
      preload: path.join(__dirname, 'preload.js'), // 添加预加载脚本
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
  });

  // 添加加载事件监听
  win.webContents.on('did-start-loading', () => {
    console.log('开始加载页面...');
  });

  win.webContents.on('did-finish-load', () => {
    console.log('页面加载完成');
  });

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('页面加载失败:', errorCode, errorDescription);
  });

  // 设置 CSP
  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4000",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:4000",
          "style-src 'self' 'unsafe-inline' http://localhost:4000",
        ].join('; ')
      }
    });
  });

  // 加载应用
  const url = isDev 
    ? 'http://localhost:4000' 
    : `file://${path.join(__dirname, 'out/index.html')}`;
    
  win.loadURL(url);

  // 打开开发者工具
  win.webContents.openDevTools();

  // 监听渲染进程的日志
  win.webContents.on('console-message', (event, level, message) => {
    console.log('Renderer Process:', message);
  });

  return win;
}

// 配置 Electron 应用
app.whenReady().then(() => {
  // 允许加载本地资源
  protocol.registerFileProtocol('file', (request, callback) => {
    const pathname = decodeURI(request.url.replace('file:///', ''));
    callback(pathname);
  });

  const mainWindow = createWindow();

  // 监听预加载脚本就绪事件
  ipcMain.on('preload-ready', () => {
    console.log('Preload script is ready');
  });
});

// 处理窗口关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
}); 