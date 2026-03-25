import React, { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Ellipse, Line, Text, Transformer, Group, Circle } from 'react-konva';
import { PlaygroundElement } from '../types';

interface CanvasAreaProps {
  elements: PlaygroundElement[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, attrs: Partial<PlaygroundElement>) => void;
  width: number;
  height: number;
  scale: number;
  stageRef: React.RefObject<any>;
}

const ElementNode = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: {
  shapeProps: PlaygroundElement;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<PlaygroundElement>) => void;
}) => {
  const shapeRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const isOutline = shapeProps.variant === 'outline';
  const isPolygon = shapeProps.shape === 'polygon';
  const w = shapeProps.width;
  const h = shapeProps.height;
  const points = shapeProps.points || [
    {x: 0, y: 0},
    {x: w, y: 0},
    {x: w, y: h},
    {x: 0, y: h}
  ];
  const flatPoints = points.flatMap(p => [p.x, p.y]);

  const commonProps = {
    fill: shapeProps.color,
    fillEnabled: !isOutline,
    opacity: isOutline ? 1 : 0.85,
    stroke: isOutline ? shapeProps.color : (isSelected ? '#2563eb' : '#334155'),
    strokeWidth: isOutline ? (isSelected ? 2 : 1) : (isSelected ? 3 / 4 : 1 / 4),
    dash: isOutline ? [4, 4] : undefined,
    shadowColor: isOutline ? undefined : "black",
    shadowBlur: isOutline ? 0 : (isSelected ? 5 : 2),
    shadowOpacity: isOutline ? 0 : 0.15,
    shadowOffsetX: isOutline ? 0 : 1,
    shadowOffsetY: isOutline ? 0 : 1,
    hitStrokeWidth: isOutline ? 10 : 0,
  };

  let shapeNode;
  if (shapeProps.shape === 'ellipse') {
    shapeNode = <Ellipse x={w / 2} y={h / 2} radiusX={w / 2} radiusY={h / 2} {...commonProps} />;
  } else if (shapeProps.shape === 'triangle') {
    shapeNode = <Line points={[w / 2, 0, w, h, 0, h]} closed={true} lineJoin="round" {...commonProps} />;
  } else if (shapeProps.shape === 'l-shape') {
    shapeNode = <Line points={[0, 0, w * 0.4, 0, w * 0.4, h * 0.6, w, h * 0.6, w, h, 0, h]} closed={true} lineJoin="round" {...commonProps} />;
  } else if (isPolygon) {
    shapeNode = <Line points={flatPoints} closed={true} lineJoin="round" {...commonProps} />;
  } else {
    shapeNode = <Rect width={w} height={h} cornerRadius={isOutline ? 0 : 1} {...commonProps} />;
  }

  let textX = 0;
  let textY = 0;
  let textW = w;
  let textH = h;
  if (isPolygon) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    textX = Math.min(...xs);
    textY = Math.min(...ys);
    textW = Math.max(...xs) - textX;
    textH = Math.max(...ys) - textY;
  }

  return (
    <React.Fragment>
      <Group
        ref={shapeRef}
        x={shapeProps.x}
        y={shapeProps.y}
        rotation={shapeProps.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);

          onChange({
            x: node.x(),
            y: node.y(),
            width: Math.max(2, shapeProps.width * scaleX),
            height: Math.max(2, shapeProps.height * scaleY),
            rotation: node.rotation(),
          });
        }}
      >
        {shapeNode}
        <Text
          text={shapeProps.name}
          x={textX}
          y={textY}
          width={textW}
          height={textH}
          align="center"
          verticalAlign={isOutline ? 'top' : 'middle'}
          fontSize={isOutline ? 8 : Math.min(textW, textH) * 0.2 + 2}
          fontStyle="bold"
          fontFamily="Inter, sans-serif"
          fill={shapeProps.shape === 'ellipse' ? '#ffffff' : (isOutline ? shapeProps.color : '#1e293b')}
          padding={isOutline ? 4 : 2}
        />
        {isSelected && isPolygon && points.map((p, i) => (
          <Circle
            key={i}
            x={p.x}
            y={p.y}
            radius={3}
            fill="#ffffff"
            stroke="#2563eb"
            strokeWidth={1}
            draggable
            onDragStart={(e) => {
              e.cancelBubble = true;
            }}
            onDragMove={(e) => {
              e.cancelBubble = true;
              const newPoints = [...points];
              newPoints[i] = { 
                x: Math.round(e.target.x() * 10) / 10, 
                y: Math.round(e.target.y() * 10) / 10 
              };
              onChange({ points: newPoints });
            }}
            onDragEnd={(e) => {
              e.cancelBubble = true;
              const newPoints = [...points];
              newPoints[i] = { 
                x: Math.round(e.target.x() * 10) / 10, 
                y: Math.round(e.target.y() * 10) / 10 
              };
              onChange({ points: newPoints });
            }}
            onMouseEnter={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = 'crosshair';
            }}
            onMouseLeave={(e) => {
              const container = e.target.getStage().container();
              container.style.cursor = 'default';
            }}
          />
        ))}
      </Group>
      {isSelected && (
        <Transformer
          ref={trRef}
          resizeEnabled={!isPolygon}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 2 || newBox.height < 2) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export function CanvasArea({ elements, selectedId, onSelect, onChange, width, height, scale, stageRef }: CanvasAreaProps) {
  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  const pxWidth = width * scale;
  const pxHeight = height * scale;
  const gridSize = 10 * scale; // 10ft grid lines

  return (
    <div 
      className="shadow-xl border-2 border-gray-300 relative bg-white overflow-hidden" 
      style={{ 
        width: pxWidth, 
        height: pxHeight,
        backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
        backgroundSize: `${gridSize}px ${gridSize}px`
      }}
    >
      <Stage
        ref={stageRef}
        width={pxWidth}
        height={pxHeight}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <Layer scale={{ x: scale, y: scale }}>
          {elements.map((el) => (
            <ElementNode
              key={el.id}
              shapeProps={el}
              isSelected={el.id === selectedId}
              onSelect={() => onSelect(el.id)}
              onChange={(newAttrs) => onChange(el.id, newAttrs)}
            />
          ))}
        </Layer>
      </Stage>
      <div className="absolute bottom-2 right-2 text-xs text-gray-500 font-mono pointer-events-none bg-white/80 px-2 py-1 rounded">
        {width}ft x {height}ft
      </div>
    </div>
  );
}
