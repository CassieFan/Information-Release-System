
import React from 'react';
import { ContentType } from '../types';

interface SidebarProps {
  activeLayers: ContentType[];
  selectedType: ContentType | null;
  onSelect: (type: ContentType) => void;
  onRemove: (type: ContentType) => void;
}

const LAYER_LABELS: Record<ContentType, string> = {
  [ContentType.IMAGE]: '图片',
  [ContentType.VIDEO]: '视频',
  [ContentType.TEXT]: '文字',
  [ContentType.MONITOR]: '监控点',
  [ContentType.WEB_H5]: '网页H5',
  [ContentType.QUEUE_TABLE]: '叫号表',
  [ContentType.WEATHER]: '天气',
  [ContentType.PRODUCT]: '商品',
  [ContentType.CAROUSEL_TABLE]: '轮播表',
};

const Sidebar: React.FC<SidebarProps> = ({ activeLayers, selectedType, onSelect, onRemove }) => {
  return (
    <div className="w-64 bg-white border-r flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-gray-800">制作内容</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {activeLayers.length === 0 ? (
          <div className="text-center py-10 text-gray-400">暂无图层</div>
        ) : (
          activeLayers.map((layer) => (
            <div 
              key={layer}
              onClick={() => onSelect(layer)}
              className={`group flex items-center p-2 rounded-lg cursor-pointer transition-all border-2 ${
                selectedType === layer ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:bg-gray-100'
              }`}
            >
              <div className={`w-10 h-10 rounded flex items-center justify-center mr-3 ${
                selectedType === layer ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {/* Simplified icons */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate text-gray-700">{LAYER_LABELS[layer]}</div>
                <div className="flex items-center space-x-2 mt-1 opacity-0 group-hover:opacity-100">
                  <button className="text-gray-400 hover:text-blue-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg></button>
                  <button className="text-gray-400 hover:text-blue-500"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(layer); }}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
