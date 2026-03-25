import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { PropertiesPanel } from './components/PropertiesPanel';
import { CanvasArea } from './components/CanvasArea';
import { PlaygroundElement } from './types';
import { Map, Download, Save, Upload } from 'lucide-react';

export default function App() {
  const [elements, setElements] = useState<PlaygroundElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Default to 300x200 ft to fit the 226x107 area from the drawing
  const [landDimensions, setLandDimensions] = useState({ width: 300, height: 200 });
  const [scale, setScale] = useState(4); // 1 ft = 4 px default
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const stageRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addElement = (element: Omit<PlaygroundElement, 'id'>) => {
    const newElement = { ...element, id: Math.random().toString(36).substring(2, 9) };
    setElements([...elements, newElement]);
    setSelectedId(newElement.id);
  };

  const updateElement = (id: string, newAttrs: Partial<PlaygroundElement>) => {
    setElements(elements.map(el => el.id === id ? { ...el, ...newAttrs } : el));
  };

  const deleteElement = (id: string) => {
    setElements(elements.filter(el => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const duplicateElement = (id: string) => {
    const elementToCopy = elements.find(el => el.id === id);
    if (elementToCopy) {
      const newElement = {
        ...elementToCopy,
        id: Math.random().toString(36).substring(2, 9),
        x: elementToCopy.x + 10,
        y: elementToCopy.y + 10,
      };
      setElements([...elements, newElement]);
      setSelectedId(newElement.id);
    }
  };

  const reorderElement = (id: string, direction: 'up' | 'down' | 'front' | 'back') => {
    setElements(prev => {
      const index = prev.findIndex(el => el.id === id);
      if (index < 0) return prev;
      
      const newElements = [...prev];
      const [element] = newElements.splice(index, 1);
      
      if (direction === 'front') {
        newElements.push(element);
      } else if (direction === 'back') {
        newElements.unshift(element);
      } else if (direction === 'up') {
        const newIndex = Math.min(index + 1, newElements.length);
        newElements.splice(newIndex, 0, element);
      } else if (direction === 'down') {
        const newIndex = Math.max(index - 1, 0);
        newElements.splice(newIndex, 0, element);
      }
      return newElements;
    });
  };

  const exportImage = () => {
    if (!stageRef.current) return;
    
    // Temporarily deselect to hide the blue selection box
    const prevSelected = selectedId;
    setSelectedId(null);
    
    // Wait for state to update and re-render without selection box
    setTimeout(() => {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 }); // High quality export
      const link = document.createElement('a');
      link.download = 'playground-layout.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Restore selection
      setSelectedId(prevSelected);
    }, 100);
  };

  const exportProject = () => {
    const data = JSON.stringify({ elements, landDimensions });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'playground-project.json';
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.elements && data.landDimensions) {
          setElements(data.elements);
          setLandDimensions(data.landDimensions);
          setSelectedId(null);
        } else {
          alert('Invalid project file format.');
        }
      } catch (err) {
        alert('Error reading project file.');
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be selected again if needed
    e.target.value = '';
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden font-sans text-gray-900">
      <Sidebar
        addElement={addElement}
        landDimensions={landDimensions}
        setLandDimensions={setLandDimensions}
        scale={scale}
        setScale={setScale}
        isOpen={leftPanelOpen}
        onToggle={() => setLeftPanelOpen(!leftPanelOpen)}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 leading-tight">School Playground Planner</h1>
              <p className="text-xs text-gray-500 font-medium">Measurements in Feet (ft)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              ref={fileInputRef}
              onChange={importProject}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors shadow-sm"
              title="Load Project File"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Load</span>
            </button>
            <button
              onClick={exportProject}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-md transition-colors shadow-sm"
              title="Save Project File"
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button
              onClick={exportImage}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors shadow-sm"
              title="Export as PNG Image"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export Image</span>
            </button>
            <div className="w-px h-8 bg-gray-200 mx-1"></div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8 bg-gray-200/50">
          <div className="min-w-max min-h-max flex items-center justify-center">
            <CanvasArea
              elements={elements}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onChange={updateElement}
              width={landDimensions.width}
              height={landDimensions.height}
              scale={scale}
              stageRef={stageRef}
            />
          </div>
        </main>

        {showClearConfirm && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-bold mb-2">Clear Canvas?</h3>
              <p className="text-gray-600 mb-6 text-sm">Are you sure you want to remove all items? This cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setElements([]);
                    setSelectedId(null);
                    setShowClearConfirm(false);
                  }}
                  className="px-4 py-2 text-sm font-medium bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <PropertiesPanel
        selectedElement={elements.find(el => el.id === selectedId)}
        updateElement={updateElement}
        deleteElement={deleteElement}
        duplicateElement={duplicateElement}
        reorderElement={reorderElement}
        isOpen={rightPanelOpen}
        onToggle={() => setRightPanelOpen(!rightPanelOpen)}
      />
    </div>
  );
}
