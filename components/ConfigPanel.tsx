
import React from 'react';
import { AppState, ContentType, CarouselConfig, FieldConfig, ItemType } from '../types';

interface ConfigPanelProps {
  state: AppState;
  onUpdateCarousel: (config: Partial<CarouselConfig>) => void;
  setEditingLayout: (val: boolean) => void;
}

const ITEM_TYPE_LABELS: Record<ItemType, string> = {
  [ItemType.ROOM]: '包间',
  [ItemType.CINEMA]: '影厅',
  [ItemType.STUDY]: '自习室'
};

const ConfigPanel: React.FC<ConfigPanelProps> = ({ state, onUpdateCarousel, setEditingLayout }) => {
  const { selectedType, carousel, isEditingLayout } = state;

  if (selectedType !== ContentType.CAROUSEL_TABLE) {
    return (
      <div className="w-80 bg-white border-l p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>
        </div>
        <p className="text-gray-400 font-medium">在画布上点击轮播表图层以配置属性</p>
      </div>
    );
  }

  const handleFieldToggle = (fieldId: string) => {
    const newFields = carousel.fields.map(f => 
      f.id === fieldId ? { ...f, enabled: !f.enabled } : f
    );
    onUpdateCarousel({ fields: newFields });
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FieldConfig>) => {
    const newFields = carousel.fields.map(f => 
      f.id === fieldId ? { ...f, ...updates } : f
    );
    onUpdateCarousel({ fields: newFields });
  };

  // Page 2: Layout Content Editing
  if (isEditingLayout) {
    return (
      <div className="w-80 bg-white border-l flex flex-col h-full animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b bg-gray-50/50 flex items-center space-x-3">
          <button 
            onClick={() => setEditingLayout(false)}
            className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="font-bold text-gray-800">格子内容排版</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-20 scrollbar-hide">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">显示字段</h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">属性配置</span>
          </div>

          <div className="space-y-3">
            {carousel.fields.map((field) => (
              <div key={field.id} className={`border rounded-lg p-3 space-y-3 transition-all ${field.enabled ? 'border-blue-200 bg-blue-50/10 shadow-sm' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-gray-700">{field.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer scale-90">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={field.enabled} 
                      onChange={() => handleFieldToggle(field.id)}
                    />
                    <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                  </label>
                </div>

                {field.enabled && (
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex-1">
                      <select 
                        value={field.fontSize}
                        onChange={(e) => handleFieldUpdate(field.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full text-xs py-1 px-2 border border-gray-200 rounded bg-white font-semibold text-gray-600 outline-none"
                      >
                        {[10, 12, 14, 16, 18, 20, 24, 28, 32].map(size => <option key={size} value={size}>{size}px</option>)}
                      </select>
                    </div>
                    <button 
                      onClick={() => handleFieldUpdate(field.id, { isBold: !field.isBold })}
                      className={`w-7 h-7 rounded flex items-center justify-center text-xs font-bold border transition-colors ${field.isBold ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-400 border-gray-200'}`}
                    >
                      B
                    </button>
                    <input 
                      type="color" 
                      value={field.color} 
                      onChange={(e) => handleFieldUpdate(field.id, { color: e.target.value })}
                      className="w-7 h-7 p-0.5 border border-gray-200 rounded cursor-pointer bg-white"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t bg-white absolute bottom-0 w-full">
           <button 
             onClick={() => setEditingLayout(false)}
             className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-lg active:scale-95"
           >
             完成并保存排版
           </button>
        </div>
      </div>
    );
  }

  // Page 1: Global Settings
  return (
    <div className="w-80 bg-white border-l flex flex-col h-full animate-in slide-in-from-left duration-300">
      <div className="p-4 border-b bg-gray-50/50">
        <h2 className="font-bold text-gray-800 flex items-center space-x-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          <span>轮播表配置</span>
        </h2>
      </div>

      <div className="p-5 space-y-8">
        {/* Item Type Selector */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest flex items-center space-x-2">
              <span>业务类型</span>
            </h3>
          </div>
          
          <div className="relative">
            <select
              value={carousel.itemType}
              onChange={(e) => onUpdateCarousel({ itemType: e.target.value as ItemType })}
              className="w-full pl-3 pr-10 py-2.5 text-sm font-bold text-black bg-white border border-gray-200 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
            >
              {Object.entries(ItemType).map(([key, value]) => (
                <option key={value} value={value}>
                  {ITEM_TYPE_LABELS[value as ItemType]}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
            </div>
          </div>
        </section>

        {/* Basic Grid Config */}
        <section className="space-y-4">
          <h3 className="font-bold text-gray-700 text-xs uppercase tracking-widest">网格布局</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">行数 (n)</label>
              <div className="flex items-center border rounded overflow-hidden bg-white shadow-sm transition-shadow hover:shadow">
                 <button 
                  onClick={() => onUpdateCarousel({ rows: Math.max(1, carousel.rows - 1) })} 
                  className="px-3 py-1.5 bg-white text-black font-bold border-r hover:bg-gray-50 active:bg-gray-100 transition-colors"
                 >
                   -
                 </button>
                 <input 
                  type="text" 
                  value={carousel.rows} 
                  readOnly 
                  className="w-full text-center text-sm font-bold text-black bg-white outline-none"
                 />
                 <button 
                  onClick={() => onUpdateCarousel({ rows: carousel.rows + 1 })} 
                  className="px-3 py-1.5 bg-white text-black font-bold border-l hover:bg-gray-50 active:bg-gray-100 transition-colors"
                 >
                   +
                 </button>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase">列数 (m)</label>
              <div className="flex items-center border rounded overflow-hidden bg-white shadow-sm transition-shadow hover:shadow">
                 <button 
                  onClick={() => onUpdateCarousel({ cols: Math.max(1, carousel.cols - 1) })} 
                  className="px-3 py-1.5 bg-white text-black font-bold border-r hover:bg-gray-50 active:bg-gray-100 transition-colors"
                 >
                   -
                 </button>
                 <input 
                  type="text" 
                  value={carousel.cols} 
                  readOnly 
                  className="w-full text-center text-sm font-bold text-black bg-white outline-none"
                 />
                 <button 
                  onClick={() => onUpdateCarousel({ cols: carousel.cols + 1 })} 
                  className="px-3 py-1.5 bg-white text-black font-bold border-l hover:bg-gray-50 active:bg-gray-100 transition-colors"
                 >
                   +
                 </button>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-gray-400 uppercase">轮播间隔</label>
              <span className="text-xs font-bold text-blue-600">{carousel.duration}s</span>
            </div>
            <input 
              type="range" min="3" max="60" value={carousel.duration} 
              onChange={(e) => onUpdateCarousel({ duration: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>
        </section>

        {/* Enter Layout Editor */}
        <section className="pt-6 border-t space-y-4">
          <div className="flex flex-col space-y-3">
             <p className="text-xs text-gray-500 leading-relaxed italic">
               点击下方按钮进入格子编辑器，支持自由拖拽内容位置，实时同步至全表。
             </p>
             <button 
               onClick={() => setEditingLayout(true)}
               className="flex items-center justify-center space-x-2 w-full py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-bold text-sm hover:bg-blue-50 transition-all active:scale-95 group"
             >
               <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
               </svg>
               <span>编辑格子排版</span>
             </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConfigPanel;
