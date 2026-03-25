import React from 'react';
import { PlaygroundElement, ElementType, ElementShape } from '../types';
import { Trash2, LayoutTemplate, Settings, ZoomIn, Copy, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, Tent } from 'lucide-react';

interface SidebarProps {
  addElement: (el: Omit<PlaygroundElement, 'id'>) => void;
  selectedElement?: PlaygroundElement;
  updateElement: (id: string, attrs: Partial<PlaygroundElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  reorderElement: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  landDimensions: { width: number; height: number };
  setLandDimensions: (dims: { width: number; height: number }) => void;
  scale: number;
  setScale: (scale: number) => void;
}

const LANDSCAPING_TEMPLATES: { type: ElementType; name: string; color: string; width: number; height: number; shape?: ElementShape; variant?: 'solid' | 'outline' }[] = [
  { type: 'plot_outline', name: 'Plot Boundary', color: '#ef4444', width: 226, height: 107, variant: 'outline' },
  { type: 'walkway', name: 'Walkway', color: '#94a3b8', width: 50, height: 6 },
  { type: 'play_zone', name: 'Play Zone', color: '#2dd4bf', width: 42, height: 32 },
  { type: 'turf', name: 'Turf Lawn', color: '#22c55e', width: 50, height: 30 },
  { type: 'sod', name: 'Sod Lawn', color: '#16a34a', width: 50, height: 30 },
  { type: 'peagravel', name: 'Pea Gravel', color: '#bae6fd', width: 40, height: 40 },
  { type: 'toddler', name: 'Toddler Area', color: '#c084fc', width: 30, height: 20 },
  { type: 'tree', name: 'Tree', color: '#334155', width: 10, height: 10, shape: 'ellipse' },
  { type: 'custom', name: 'Custom Zone', color: '#d8b4fe', width: 20, height: 20 },
];

const EQUIPMENT_TEMPLATES: { type: ElementType; name: string; color: string; width: number; height: number; shape?: ElementShape; variant?: 'solid' | 'outline' }[] = [
  { type: 'building', name: 'Building', color: '#94a3b8', width: 100, height: 50 },
  { type: 'play_structure', name: 'Play Structure', color: '#a855f7', width: 24, height: 18 },
  { type: 'play_set', name: 'Play Set', color: '#f97316', width: 30, height: 20 },
  { type: 'gazebo', name: 'Gazebo', color: '#b45309', width: 15, height: 15, shape: 'ellipse' },
  { type: 'shed', name: 'Shed', color: '#64748b', width: 10, height: 12 },
  { type: 'picnic_table', name: 'Picnic Table', color: '#78350f', width: 8, height: 6 },
  { type: 'soccer_field', name: 'Soccer Field', color: '#4ade80', width: 100, height: 60, variant: 'outline' },
];

export function Sidebar({ addElement, selectedElement, updateElement, deleteElement, duplicateElement, reorderElement, landDimensions, setLandDimensions, scale, setScale }: SidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10 overflow-y-auto shrink-0">
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Land Dimensions (ft)
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Width (ft)</label>
            <input
              type="number"
              value={landDimensions.width}
              onChange={(e) => setLandDimensions({...landDimensions, width: Math.max(10, Number(e.target.value))})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Length (ft)</label>
            <input
              type="number"
              value={landDimensions.height}
              onChange={(e) => setLandDimensions({...landDimensions, height: Math.max(10, Number(e.target.value))})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>
        
        <h2 className="text-sm font-bold text-gray-800 mb-2 mt-6 uppercase tracking-wider flex items-center gap-2">
          <ZoomIn className="w-4 h-4" />
          Zoom Scale
        </h2>
        <div className="flex items-center gap-3">
          <input 
            type="range" 
            min="1" 
            max="10" 
            step="0.5"
            value={scale} 
            onChange={(e) => setScale(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">{scale}x</span>
        </div>
        <p className="text-xs text-gray-500 mt-2">1 grid square = 10 ft.</p>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" />
          Landscaping & Zones
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {LANDSCAPING_TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => addElement({
                type: template.type,
                name: template.name,
                color: template.color,
                width: template.width,
                height: template.height,
                shape: template.shape || 'rect',
                variant: template.variant || 'solid',
                x: Math.random() * 20 + 10,
                y: Math.random() * 20 + 10
              })}
              className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div 
                className={`w-8 h-8 mb-2 shadow-sm group-hover:scale-110 transition-transform ${template.variant === 'outline' ? 'border-2 border-dashed bg-transparent' : ''}`} 
                style={{ 
                  backgroundColor: template.variant === 'outline' ? 'transparent' : template.color,
                  borderColor: template.variant === 'outline' ? template.color : 'transparent',
                  borderRadius: template.shape === 'ellipse' ? '50%' : '4px'
                }} 
              />
              <span className="text-xs font-medium text-gray-700 text-center">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Tent className="w-4 h-4" />
          Structures & Equipment
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {EQUIPMENT_TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => addElement({
                type: template.type,
                name: template.name,
                color: template.color,
                width: template.width,
                height: template.height,
                shape: template.shape || 'rect',
                variant: template.variant || 'solid',
                x: Math.random() * 20 + 10,
                y: Math.random() * 20 + 10
              })}
              className="flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-all group"
            >
              <div 
                className={`w-8 h-8 mb-2 shadow-sm group-hover:scale-110 transition-transform ${template.variant === 'outline' ? 'border-2 border-dashed bg-transparent' : ''}`} 
                style={{ 
                  backgroundColor: template.variant === 'outline' ? 'transparent' : template.color,
                  borderColor: template.variant === 'outline' ? template.color : 'transparent',
                  borderRadius: template.shape === 'ellipse' ? '50%' : '4px'
                }} 
              />
              <span className="text-xs font-medium text-gray-700 text-center">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 flex-1">
        <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Selected Item</h2>
        {selectedElement ? (
          <div className="space-y-4 bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
              <input
                type="text"
                value={selectedElement.name}
                onChange={(e) => updateElement(selectedElement.id, { name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            {selectedElement.shape !== 'polygon' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Width (ft)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.width * 10) / 10}
                    onChange={(e) => updateElement(selectedElement.id, { width: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Length (ft)</label>
                  <input
                    type="number"
                    value={Math.round(selectedElement.height * 10) / 10}
                    onChange={(e) => updateElement(selectedElement.id, { height: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Shape</label>
                <select
                  value={selectedElement.shape || 'rect'}
                  onChange={(e) => {
                    const newShape = e.target.value as any;
                    const updates: Partial<PlaygroundElement> = { shape: newShape };
                    if (newShape === 'polygon' && !selectedElement.points) {
                      updates.points = [
                        { x: 0, y: 0 },
                        { x: selectedElement.width, y: 0 },
                        { x: selectedElement.width, y: selectedElement.height },
                        { x: 0, y: selectedElement.height }
                      ];
                    }
                    updateElement(selectedElement.id, updates);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                  <option value="rect">Rectangle</option>
                  <option value="ellipse">Oval / Circle</option>
                  <option value="triangle">Triangle</option>
                  <option value="l-shape">L-Shape</option>
                  <option value="polygon">Custom Polygon</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Rotation (°)</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.rotation || 0)}
                  onChange={(e) => updateElement(selectedElement.id, { rotation: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              {selectedElement.shape === 'polygon' && (
                <div className="col-span-2 mt-2 space-y-3 border-t border-gray-200 pt-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-2">Corner Coordinates (ft)</label>
                    <p className="text-[10px] text-gray-500 mb-2 leading-tight">
                      Type exact X (horizontal) and Y (vertical) distances, or drag the white circles on the canvas.
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {selectedElement.points?.map((p, i) => (
                        <div key={i} className="flex gap-2 items-center bg-gray-50 p-1.5 rounded border border-gray-200">
                          <span className="text-xs font-medium text-gray-500 w-4">{i + 1}.</span>
                          <div className="flex-1 flex items-center gap-1">
                            <span className="text-[10px] font-medium text-gray-400">X:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={p.x}
                              onChange={(e) => {
                                const newPts = [...(selectedElement.points || [])];
                                newPts[i] = { ...newPts[i], x: Number(e.target.value) };
                                updateElement(selectedElement.id, { points: newPts });
                              }}
                              className="w-full px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                            />
                          </div>
                          <div className="flex-1 flex items-center gap-1">
                            <span className="text-[10px] font-medium text-gray-400">Y:</span>
                            <input
                              type="number"
                              step="0.1"
                              value={p.y}
                              onChange={(e) => {
                                const newPts = [...(selectedElement.points || [])];
                                newPts[i] = { ...newPts[i], y: Number(e.target.value) };
                                updateElement(selectedElement.id, { points: newPts });
                              }}
                              className="w-full px-1.5 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs"
                            />
                          </div>
                          {(selectedElement.points?.length || 0) > 3 && (
                            <button
                              onClick={() => {
                                const newPts = selectedElement.points!.filter((_, idx) => idx !== i);
                                updateElement(selectedElement.id, { points: newPts });
                              }}
                              className="text-red-400 hover:text-red-600 px-1 text-lg leading-none"
                              title="Remove corner"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const pts = selectedElement.points || [
                        { x: 0, y: 0 },
                        { x: selectedElement.width, y: 0 },
                        { x: selectedElement.width, y: selectedElement.height },
                        { x: 0, y: selectedElement.height }
                      ];
                      const p1 = pts[pts.length - 1];
                      const p2 = pts[0];
                      const newPt = { x: Math.round((p1.x + p2.x) / 2 * 10) / 10, y: Math.round((p1.y + p2.y) / 2 * 10) / 10 };
                      updateElement(selectedElement.id, { points: [...pts, newPt] });
                    }}
                    className="w-full px-3 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded border border-gray-300 transition-colors shadow-sm"
                  >
                    + Add Corner / Vertex
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={selectedElement.color}
                  onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                  className="w-10 h-10 p-1 border border-gray-300 rounded-md cursor-pointer"
                />
                <span className="text-xs text-gray-500 font-mono uppercase">{selectedElement.color}</span>
              </div>
            </div>
            <div className="pt-2">
              <label className="block text-xs font-bold text-gray-700 mb-2">Layer Order</label>
              <div className="grid grid-cols-4 gap-2 mb-4">
                <button onClick={() => reorderElement(selectedElement.id, 'front')} className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex justify-center items-center" title="Bring to Front">
                  <ChevronsUp className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => reorderElement(selectedElement.id, 'up')} className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex justify-center items-center" title="Move Forward">
                  <ArrowUp className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => reorderElement(selectedElement.id, 'down')} className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex justify-center items-center" title="Move Backward">
                  <ArrowDown className="w-4 h-4 text-gray-600" />
                </button>
                <button onClick={() => reorderElement(selectedElement.id, 'back')} className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-50 flex justify-center items-center" title="Send to Back">
                  <ChevronsDown className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => duplicateElement(selectedElement.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                <button
                  onClick={() => deleteElement(selectedElement.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors text-sm font-medium shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            Click an item on the canvas to edit its properties.
          </div>
        )}
      </div>
    </div>
  );
}
