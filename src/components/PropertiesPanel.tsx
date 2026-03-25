import React from 'react';
import { PlaygroundElement } from '../types';
import { Trash2, Copy, ArrowUp, ArrowDown, ChevronsUp, ChevronsDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface PropertiesPanelProps {
  selectedElement?: PlaygroundElement;
  updateElement: (id: string, attrs: Partial<PlaygroundElement>) => void;
  deleteElement: (id: string) => void;
  duplicateElement: (id: string) => void;
  reorderElement: (id: string, direction: 'up' | 'down' | 'front' | 'back') => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function PropertiesPanel({ selectedElement, updateElement, deleteElement, duplicateElement, reorderElement, isOpen, onToggle }: PropertiesPanelProps) {
  if (!selectedElement) {
    return (
      <div className={`bg-white border-l border-gray-200 flex flex-col h-full shadow-sm z-20 shrink-0 transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'}`}>
        <div className="flex items-center justify-start p-2 border-b border-gray-200 bg-gray-50">
          <button onClick={onToggle} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title={isOpen ? "Collapse Panel" : "Expand Panel"}>
            {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
        {isOpen && (
          <div className="p-6 flex-1 flex items-center justify-center">
            <div className="text-sm text-gray-500 text-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              Click an item on the canvas to edit its properties.
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-white border-l border-gray-200 flex flex-col h-full shadow-sm z-20 shrink-0 transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'}`}>
      <div className="flex items-center justify-start p-2 border-b border-gray-200 bg-gray-50">
        <button onClick={onToggle} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title={isOpen ? "Collapse Panel" : "Expand Panel"}>
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 flex-1">
            <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider">Selected Item</h2>
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
      </div>
    </div>
    )}
  </div>
  );
}
