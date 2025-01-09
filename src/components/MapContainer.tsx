import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';

interface MapProps {
  onProvinceClick: (province: any) => void;
  onProvinceDoubleClick: (province: any) => void;
  onCityClick: (city: any) => void;
  currentLevel: 'country' | 'province';
  currentProvince?: string;
}

const MapContainer: React.FC<MapProps> = ({
  onProvinceClick,
  onProvinceDoubleClick,
  onCityClick,
  currentLevel,
  currentProvince
}) => {
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // 动态加载地图数据
    const loadMapData = async () => {
      if (currentLevel === 'country') {
        // const { default: chinaMap } = await import('../data/china.json');
        // echarts.registerMap('china', chinaMap);
      } else if (currentLevel === 'province' && currentProvince) {
        try {
          // const { default: provinceMap } = await import(`../data/province/${currentProvince}.json`);
          // echarts.registerMap(currentProvince, provinceMap);
        } catch (error) {
          console.error('Failed to load province map:', error);
        }
      }
    };

    loadMapData();
  }, [currentLevel, currentProvince]);

  const getOption = () => {
    return {
      backgroundColor: '#fff',
      title: {
        text: currentLevel === 'country' ? '中国地图' : `${currentProvince}地图`,
        left: 'center',
        top: 10
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        top: 'bottom',
        text: ['高', '低'],
        calculable: true,
        inRange: {
          color: ['#e0ffff', '#006edd']
        }
      },
      series: [{
        name: currentLevel === 'country' ? '省份' : '城市',
        type: 'map',
        map: currentLevel === 'country' ? 'china' : currentProvince,
        roam: true,
        label: {
          show: true
        },
        emphasis: {
          label: {
            show: true
          }
        },
        data: []  // 这里可以添加各地区的数据
      }]
    };
  };

  const onEvents = {
    click: (params: any) => {
      if (currentLevel === 'country') {
        onProvinceClick({
          name: params.name,
          value: params.value
        });
      } else {
        onCityClick({
          name: params.name,
          value: params.value
        });
      }
    },
    dblclick: (params: any) => {
      if (currentLevel === 'country') {
        onProvinceDoubleClick({
          name: params.name,
          value: params.value
        });
      }
    }
  };

  return (
    <div className="w-full h-full">
{/*       <ReactECharts
        ref={chartRef}
        option={getOption()}
        style={{ height: '100%', width: '100%' }}
        onEvents={onEvents}
      /> */}
    </div>
  );
};

export default MapContainer; 