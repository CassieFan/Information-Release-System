
import React from 'react';
import { ContentType } from '../types';

interface ToolbarProps {
  onAdd: (type: ContentType) => void;
  activeLayers: ContentType[];
}

const Toolbar: React.FC<ToolbarProps> = ({ onAdd, activeLayers }) => {
  const items = [
    { type: ContentType.IMAGE, label: '图片', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { type: ContentType.VIDEO, label: '视频', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { type: ContentType.TEXT, label: '文字', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
    { type: ContentType.MONITOR, label: '监控点', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
    { type: ContentType.WEB_H5, label: '网页H5', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
    { type: ContentType.QUEUE_TABLE, label: '叫号表', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
    { type: ContentType.WEATHER, label: '天气', icon: 'M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z' },
    { type: ContentType.CAROUSEL_TABLE, label: '轮播表', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
    { type: ContentType.PRODUCT, label: '商品', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  ];

  const exclusiveTypes = [ContentType.PRODUCT, ContentType.QUEUE_TABLE, ContentType.CAROUSEL_TABLE];

  return (
    <div className="bg-white px-6 py-2 border-b flex items-center justify-center space-x-1">
      {items.map(item => {
        const isSelected = activeLayers.includes(item.type);
        const isExclusive = exclusiveTypes.includes(item.type);
        const isOtherExclusiveActive = exclusiveTypes.some(t => t !== item.type && activeLayers.includes(t));

        return (
          <button
            key={item.type}
            onClick={() => onAdd(item.type)}
            disabled={item.type === ContentType.PRODUCT} // Mock disabled from user screenshot
            className={`flex items-center px-4 py-2 space-x-2 rounded transition-all ${
              isSelected 
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-500' 
                : 'hover:bg-gray-100 text-gray-500 border-2 border-transparent'
            } ${item.type === ContentType.PRODUCT ? 'opacity-30 cursor-not-allowed' : ''}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}/></svg>
            <span className="font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;
