import React from 'react';
import { PlaygroundElement, ElementType, ElementShape } from '../types';
import { LayoutTemplate, Settings, ZoomIn, Tent, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  addElement: (el: Omit<PlaygroundElement, 'id'>) => void;
  landDimensions: { width: number; height: number };
  setLandDimensions: (dims: { width: number; height: number }) => void;
  scale: number;
  setScale: (scale: number) => void;
  isOpen: boolean;
  onToggle: () => void;
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

export function Sidebar({ addElement, landDimensions, setLandDimensions, scale, setScale, isOpen, onToggle }: SidebarProps) {
  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-20 shrink-0 transition-all duration-300 ${isOpen ? 'w-80' : 'w-12'}`}>
      <div className="flex items-center justify-end p-2 border-b border-gray-200 bg-gray-50">
        <button onClick={onToggle} className="p-1.5 hover:bg-gray-200 rounded text-gray-600 transition-colors" title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}>
          {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>
      {isOpen && (
        <div className="flex-1 overflow-y-auto flex flex-col">
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
        </div>
      )}
    </div>
  );
}
