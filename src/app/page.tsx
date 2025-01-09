'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import '@/app/style/app.css'

// 动态导入地图组件，禁用 SSR
const MapContainer = dynamic(
  () => import('../components/MapContainer'),
  { 
    ssr: false,
    loading: () => <div>加载地图中...</div>
  }
);

interface Album {
  id: string;
  title: string;
  images: string[];
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<'country' | 'province'>('country');
  const [currentProvince, setCurrentProvince] = useState<string>();

  // 使用 mounted 状态来确保组件只在客户端渲染
  useEffect(() => {
    // 使用 electron bridge 记录日志
    const log = (window as any).electron?.log || console.log;
    
    log('Component mounting...' + new Date().toISOString());
    
    // 直接尝试设置状态
    setMounted(true);
    log('Set mounted to true');

    // 错误处理
    const handleError = (error: ErrorEvent) => {
      log('Window error: ' + error.message);
    };

    window.addEventListener('error', handleError);

    // 清理函数
    return () => {
      log('Component unmounting...' + new Date().toISOString());
      window.removeEventListener('error', handleError);
      setMounted(false);
    };
  }, []);

  // 监控 mounted 状态变化
  useEffect(() => {
    const log = (window as any).electron?.log || console.log;
    log('Mounted state changed: ' + mounted + ' at ' + new Date().toISOString());
  }, [mounted]);

  const handleProvinceClick = (province: any) => {
    console.log('Province clicked:', province);
    setSelectedAlbum({
      id: province.name,
      title: `${province.name}的相册`,
      images: []
    });
    setPreviewVisible(true);
  };

  const handleProvinceDoubleClick = (province: any) => {
    setCurrentLevel('province');
    setCurrentProvince(province.name);
  };

  const handleCityClick = (city: any) => {
    setSelectedAlbum({
      id: city.name,
      title: `${city.name}的相册`,
      images: []  // 这里后续可以接入实际的图片数据
    });
    setPreviewVisible(true);
  };

  const handleBackToCountry = () => {
    setCurrentLevel('country');
    setCurrentProvince(undefined);
    setPreviewVisible(false);
    setSelectedAlbum(null);
  };

  // 如果组件未挂载，显示加载状态
  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="text-xl">初始化应用...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-screen flex flex-col bg-gray-100">
      <nav className="bg-white shadow-sm p-4 app-drag">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">地图相册</h1>
          {currentLevel === 'province' && (
            <button
              onClick={handleBackToCountry}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              返回全国地图
            </button>
          )}
        </div>
      </nav>
      
      <div className="flex-1 flex">
        <div className="w-3/4 h-[calc(100vh-4rem)]">
          <MapContainer
            onProvinceClick={handleProvinceClick}
            onProvinceDoubleClick={handleProvinceDoubleClick}
            onCityClick={handleCityClick}
            currentLevel={currentLevel}
            currentProvince={currentProvince}
          />
        </div>
        
        {previewVisible && selectedAlbum && (
          <div className="w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
            <div className="sticky top-0 bg-white pb-4 mb-4 border-b">
              <h2 className="text-xl font-bold">{selectedAlbum.title}</h2>
            </div>
            
            {selectedAlbum.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {selectedAlbum.images.map((image, index) => (
                  <div key={index} className="aspect-square relative group">
                    <img
                      src={image}
                      alt={`照片 ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>暂无照片</p>
                <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                  上传照片
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
