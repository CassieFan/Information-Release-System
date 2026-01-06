
import React, { useState } from 'react';
import { ContentType, AppState, CarouselConfig, FieldConfig, ItemType } from './types';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Canvas from './components/Canvas';
import ConfigPanel from './components/ConfigPanel';

export const ITEM_DEFAULTS: Record<ItemType, FieldConfig[]> = {
  [ItemType.ROOM]: [
    { id: 'room_no', label: '包间号', enabled: true, fontSize: 16, color: '#000000', isBold: true, order: 0, x: 50, y: 20 },
    { id: 'status', label: '包间状态', enabled: true, fontSize: 14, color: '#3B82F6', isBold: false, order: 1, x: 50, y: 45 },
    { id: 'end_time', label: '结束时间', enabled: true, fontSize: 12, color: '#6B7280', isBold: false, order: 2, x: 50, y: 65 },
    { id: 'capacity', label: '包间人数', enabled: true, fontSize: 12, color: '#6B7280', isBold: false, order: 3, x: 50, y: 80 },
  ],
  [ItemType.CINEMA]: [
    { id: 'hall_name', label: '影厅名称', enabled: true, fontSize: 16, color: '#000000', isBold: true, order: 0, x: 50, y: 20 },
    { id: 'movie_title', label: '电影名称', enabled: true, fontSize: 14, color: '#10B981', isBold: false, order: 1, x: 50, y: 45 },
    { id: 'start_time', label: '开场时间', enabled: true, fontSize: 12, color: '#6B7280', isBold: false, order: 2, x: 50, y: 65 },
    { id: 'remaining_seats', label: '剩余座位', enabled: true, fontSize: 12, color: '#6B7280', isBold: false, order: 3, x: 50, y: 80 },
  ],
  [ItemType.STUDY]: [
    { id: 'seat_no', label: '座位号', enabled: true, fontSize: 16, color: '#000000', isBold: true, order: 0, x: 50, y: 20 },
    { id: 'usage_status', label: '使用状态', enabled: true, fontSize: 14, color: '#F59E0B', isBold: false, order: 1, x: 50, y: 45 },
    { id: 'remaining_time', label: '剩余时长', enabled: true, fontSize: 12, color: '#6B7280', isBold: false, order: 2, x: 50, y: 65 },
    { id: 'user_type', label: '用户类型', enabled: true, fontSize: 12, color: '#6B7280', isBold: false, order: 3, x: 50, y: 80 },
  ]
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    activeLayers: [ContentType.CAROUSEL_TABLE],
    selectedType: ContentType.CAROUSEL_TABLE,
    isEditingLayout: false,
    carousel: {
      itemType: ItemType.ROOM,
      rows: 4,
      cols: 4,
      width: 640,
      height: 400,
      duration: 10,
      fields: [...ITEM_DEFAULTS[ItemType.ROOM]]
    },
    productConfig: {},
    queueConfig: {}
  });

  const handleSelectLayer = (type: ContentType) => {
    setState(prev => ({ ...prev, selectedType: type }));
  };

  const handleAddContent = (type: ContentType) => {
    let newLayers = [...state.activeLayers];
    const exclusiveTypes = [ContentType.PRODUCT, ContentType.QUEUE_TABLE, ContentType.CAROUSEL_TABLE];
    
    if (exclusiveTypes.includes(type)) {
      newLayers = newLayers.filter(t => !exclusiveTypes.includes(t));
      newLayers.push(type);
    } else if (!newLayers.includes(type)) {
      newLayers.push(type);
    }

    setState(prev => ({
      ...prev,
      activeLayers: newLayers,
      selectedType: type,
      carousel: type === ContentType.CAROUSEL_TABLE ? {
        ...prev.carousel,
        itemType: ItemType.ROOM,
        fields: [...ITEM_DEFAULTS[ItemType.ROOM]]
      } : prev.carousel
    }));
  };

  const handleUpdateCarousel = (config: Partial<CarouselConfig>) => {
    setState(prev => {
      const newConfig = { ...prev.carousel, ...config };
      if (config.itemType && config.itemType !== prev.carousel.itemType) {
        newConfig.fields = [...ITEM_DEFAULTS[config.itemType]];
      }
      return {
        ...prev,
        carousel: newConfig
      };
    });
  };

  const setEditingLayout = (val: boolean) => {
    setState(prev => ({ ...prev, isEditingLayout: val }));
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-sm select-none">
      <Sidebar 
        activeLayers={state.activeLayers} 
        selectedType={state.selectedType}
        onSelect={handleSelectLayer}
        onRemove={(type) => setState(prev => ({ 
          ...prev, 
          activeLayers: prev.activeLayers.filter(t => t !== type),
          selectedType: prev.selectedType === type ? null : prev.selectedType
        }))}
      />

      <div className="flex flex-col flex-1 relative bg-gray-50 overflow-hidden">
        <header className="h-14 bg-white border-b flex items-center justify-between px-6 z-10">
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            </button>
            <span className="font-semibold text-gray-800">{state.isEditingLayout ? '正在编辑格子排版' : '轮播表编辑器'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-50">预览</button>
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium">保存</button>
          </div>
        </header>

        {!state.isEditingLayout && <Toolbar onAdd={handleAddContent} activeLayers={state.activeLayers} />}

        <main className="flex-1 canvas-bg relative p-10 overflow-auto flex justify-center items-start transition-all">
           <Canvas state={state} onUpdateCarousel={handleUpdateCarousel} />
        </main>

        <div className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg border px-4 py-2 flex items-center space-x-4">
           <div className="flex items-center space-x-2 border-r pr-4">
             <button className="p-1 hover:bg-gray-100 rounded">-</button>
             <span className="text-gray-600">100%</span>
             <button className="p-1 hover:bg-gray-100 rounded">+</button>
           </div>
           <button className="text-gray-500 hover:text-blue-600">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/></svg>
           </button>
        </div>
      </div>

      <ConfigPanel 
        state={state} 
        onUpdateCarousel={handleUpdateCarousel} 
        setEditingLayout={setEditingLayout}
      />
    </div>
  );
};

export default App;
