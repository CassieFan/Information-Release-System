
import React, { useRef } from 'react';
import { AppState, ContentType, FieldConfig, ItemType, CarouselConfig } from '../types';

interface CanvasProps {
  state: AppState;
  onUpdateCarousel: (config: Partial<CarouselConfig>) => void;
}

const getMockValue = (type: ItemType, fieldId: string, index: number) => {
  const mocks: Record<ItemType, Record<string, string>> = {
    [ItemType.ROOM]: { room_no: (101 + index).toString(), status: index % 3 === 0 ? '空闲' : '占用', end_time: '14:30', capacity: '4人' },
    [ItemType.CINEMA]: { hall_name: `${index + 1}号厅`, movie_title: index % 2 === 0 ? '阿凡达' : '星际穿越', start_time: '19:00', remaining_seats: '24' },
    [ItemType.STUDY]: { seat_no: `A-${index + 1}`, usage_status: index % 2 === 0 ? '学习中' : '空置', remaining_time: '02:45', user_type: '会员' }
  };
  return mocks[type][fieldId] || '-';
};

const CarouselGrid: React.FC<{ 
  rows: number; 
  cols: number; 
  width: number; 
  height: number; 
  fields: FieldConfig[]; 
  itemType: ItemType 
}> = ({ rows, cols, width, height, fields, itemType }) => {
  const sortedFields = [...fields].filter(f => f.enabled);
  
  return (
    <div 
      className="grid gap-px bg-gray-200 border border-gray-300 shadow-xl overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: `${width}px`,
        height: `${height}px`
      }}
    >
      {Array.from({ length: rows * cols }).map((_, i) => (
        <div key={i} className="bg-white relative overflow-hidden">
          {sortedFields.map(field => (
            <div 
              key={field.id} 
              className="absolute pointer-events-none whitespace-nowrap"
              style={{ 
                left: `${field.x}%`, 
                top: `${field.y}%`, 
                transform: 'translate(-50%, -50%)',
                fontSize: `${field.fontSize}px`, 
                color: field.color,
                fontWeight: field.isBold ? '700' : '400'
              }}
            >
              {getMockValue(itemType, field.id, i)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const CellLayoutEditor: React.FC<{ 
  fields: FieldConfig[]; 
  itemType: ItemType; 
  cellWidth: number;
  cellHeight: number;
  onUpdate: (fields: FieldConfig[]) => void 
}> = ({ fields, itemType, cellWidth, cellHeight, onUpdate }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeFields = fields.filter(f => f.enabled);

  const handleDrag = (id: string, e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      // Scale coordinates based on the current editor zoom
      const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
      
      const newFields = fields.map(f => 
        f.id === id ? { ...f, x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) } : f
      );
      onUpdate(newFields);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Keep a minimum size for the editor but maintain cell aspect ratio
  const displayWidth = 400;
  const displayHeight = (cellHeight / cellWidth) * displayWidth;

  return (
    <div className="flex flex-col items-center space-y-6 animate-in zoom-in duration-300">
      <div className="text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
        正在编辑单元格模板 (拖拽下方元素排版)
      </div>
      <div 
        ref={containerRef}
        className="relative bg-white border-4 border-dashed border-blue-200 shadow-2xl overflow-hidden cursor-crosshair"
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
      >
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#4a90e2 1px, transparent 1px), linear-gradient(90deg, #4a90e2 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
        {activeFields.map(field => (
          <div 
            key={field.id}
            onMouseDown={(e) => handleDrag(field.id, e)}
            className="absolute p-2 border border-transparent hover:border-blue-500 hover:bg-blue-50/50 rounded cursor-move whitespace-nowrap group select-none transition-shadow hover:shadow-lg"
            style={{ 
              left: `${field.x}%`, 
              top: `${field.y}%`, 
              transform: 'translate(-50%, -50%)',
              fontSize: `${field.fontSize * 1.5}px`, 
              color: field.color,
              fontWeight: field.isBold ? '700' : '400',
              zIndex: 10
            }}
          >
            {getMockValue(itemType, field.id, 0)}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {field.label}
            </div>
          </div>
        ))}
      </div>
      <p className="text-gray-400 text-xs">单元格排版比例 (宽:高) = {cellWidth.toFixed(0)} : {cellHeight.toFixed(0)}</p>
    </div>
  );
};

const Canvas: React.FC<CanvasProps> = ({ state, onUpdateCarousel }) => {
  const { activeLayers, carousel, selectedType, isEditingLayout } = state;

  const handleResize = (type: 'width' | 'height' | 'both', e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = carousel.width;
    const startHeight = carousel.height;

    const onMouseMove = (moveEvent: MouseEvent) => {
      // Adjust movement based on the 0.5 canvas scale
      const deltaX = (moveEvent.clientX - startX) * 2;
      const deltaY = (moveEvent.clientY - startY) * 2;

      const updates: Partial<CarouselConfig> = {};
      if (type === 'width' || type === 'both') {
        updates.width = Math.max(100, startWidth + deltaX);
      }
      if (type === 'height' || type === 'both') {
        updates.height = Math.max(100, startHeight + deltaY);
      }
      onUpdateCarousel(updates);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="bg-white shadow-2xl relative" style={{ width: '720px', height: '1280px', transform: 'scale(0.5)', transformOrigin: 'top center' }}>
      <div className="absolute inset-0 flex items-center justify-center p-8 bg-gray-50 transition-all">
        {activeLayers.includes(ContentType.CAROUSEL_TABLE) && (
          <div className={`relative transition-all ${selectedType === ContentType.CAROUSEL_TABLE && !isEditingLayout ? 'ring-4 ring-blue-500 ring-offset-8' : ''}`}>
            {isEditingLayout ? (
              <CellLayoutEditor 
                fields={carousel.fields} 
                itemType={carousel.itemType} 
                cellWidth={carousel.width / carousel.cols}
                cellHeight={carousel.height / carousel.rows}
                onUpdate={(fields) => onUpdateCarousel({ fields })}
              />
            ) : (
              <>
                <CarouselGrid 
                  rows={carousel.rows} 
                  cols={carousel.cols} 
                  width={carousel.width}
                  height={carousel.height}
                  fields={carousel.fields} 
                  itemType={carousel.itemType}
                />

                {selectedType === ContentType.CAROUSEL_TABLE && (
                  <>
                    {/* Corner Points */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-white border-2 border-blue-500 rounded-full z-10"></div>
                    
                    {/* Resizers */}
                    {/* Bottom-Right Corner (Both) */}
                    <div 
                      onMouseDown={(e) => handleResize('both', e)}
                      className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border-2 border-blue-500 rounded-full z-20 cursor-nwse-resize hover:bg-blue-500 transition-colors"
                    ></div>
                    
                    {/* Right Edge (Width) */}
                    <div 
                      onMouseDown={(e) => handleResize('width', e)}
                      className="absolute top-1/2 -right-3 -translate-y-1/2 w-4 h-12 bg-white border-2 border-blue-500 rounded-full z-20 cursor-ew-resize hover:bg-blue-500 transition-colors"
                    ></div>
                    
                    {/* Bottom Edge (Height) */}
                    <div 
                      onMouseDown={(e) => handleResize('height', e)}
                      className="absolute left-1/2 -bottom-3 -translate-x-1/2 w-12 h-4 bg-white border-2 border-blue-500 rounded-full z-20 cursor-ns-resize hover:bg-blue-500 transition-colors"
                    ></div>
                  </>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
