const { contextBridge, ipcRenderer } = require('electron');

// 初始化时在控制台输出信息
console.log('Preload script executing...');

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  log: (message) => {
    console.log(message);
  },
  // 添加更多需要的 API
});

// 通知主进程预加载脚本已完成
ipcRenderer.send('preload-ready');

// 设置全局错误处理
window.addEventListener('error', (error) => {
  console.error('Preload caught error:', error);
});

// 设置未捕获的 Promise 错误处理
window.addEventListener('unhandledrejection', (event) => {
  console.error('Uncaught Promise Rejection:', event.reason);
}); 