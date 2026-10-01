import React, { useRef, useState, useEffect } from 'react';
import { ArchitecturalProject, CADElement } from '../types';
import { useI18n } from '../lib/i18n';
import {
  MousePointer,
  Square,
  DoorOpen,
  Maximize2,
  Grid,
  RotateCw,
  Copy,
  Trash2,
  Undo2,
  Redo2,
  Columns,
  Footprints,
  Armchair,
  Ruler,
  Type,
  Plus,
  Box,
  Save,
  Check
} from 'lucide-react';

interface FloorPlanEditorProps {
  project: ArchitecturalProject;
  onUpdateElements: (elements: CADElement[]) => void;
  onOpen3DView: () => void;
}

export const FloorPlanEditor: React.FC<FloorPlanEditorProps> = ({
  project,
  onUpdateElements,
  onOpen3DView
}) => {
  const { t, isRTL } = useI18n();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeTool, setActiveTool] = useState<
    'select' | 'wall' | 'door' | 'window' | 'room' | 'column' | 'stairs' | 'furniture' | 'dimension' | 'text'
  >('wall');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [gridSize, setGridSize] = useState<number>(20); // 20px = 1 meter at 1:100 scale
  const [elements, setElements] = useState<CADElement[]>(project.elements || []);
  const [history, setHistory] = useState<CADElement[][]>([project.elements || []]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentMouse, setCurrentMouse] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear background
    ctx.fillStyle = '#FAF7F2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Architectural CAD Grid
    ctx.strokeStyle = '#E8E0D5';
    ctx.lineWidth = 0.5;

    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Major grid lines every 5 units (5 meters)
    ctx.strokeStyle = '#D8CEC2';
    ctx.lineWidth = 1;
    for (let x = 0; x <= canvas.width; x += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize * 5) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Render CAD elements
    elements.forEach((el) => {
      const isSelected = el.id === selectedId;
      const pxX = el.x * gridSize;
      const pxY = el.y * gridSize;
      const pxW = el.width * gridSize;
      const pxL = el.length * gridSize;

      ctx.save();
      ctx.translate(pxX, pxY);
      ctx.rotate((el.rotation * Math.PI) / 180);

      if (el.type === 'room') {
        ctx.fillStyle = el.color || 'rgba(239, 230, 218, 0.4)';
        ctx.fillRect(0, 0, pxW, pxL);
        ctx.strokeStyle = isSelected ? '#54483C' : '#8A7A6A';
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(0, 0, pxW, pxL);
        ctx.setLineDash([]);

        // Label
        if (el.label) {
          ctx.fillStyle = '#54483C';
          ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(el.label, pxW / 2, pxL / 2);
          ctx.font = '400 10px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#756A60';
          ctx.fillText(`${(el.width * el.length).toFixed(1)} m²`, pxW / 2, pxL / 2 + 14);
        }
      } else if (el.type === 'wall') {
        ctx.fillStyle = isSelected ? '#3F3832' : '#54483C';
        ctx.fillRect(0, 0, Math.max(pxW, 4), Math.max(pxL, 4));

        // Dimension text along wall
        ctx.fillStyle = '#8A7A6A';
        ctx.font = '10px monospace';
        const dimStr = `${Math.max(el.width, el.length).toFixed(2)}m`;
        ctx.fillText(dimStr, 4, -4);
      } else if (el.type === 'door') {
        // Door opening & swing arc
        ctx.strokeStyle = '#54483C';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(pxW, 0);
        ctx.stroke();

        ctx.strokeStyle = '#8A7A6A';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.arc(0, 0, pxW, 0, Math.PI / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (el.type === 'window') {
        // Window double-line
        ctx.fillStyle = '#FAF7F2';
        ctx.fillRect(0, 0, pxW, 6);
        ctx.strokeStyle = '#54483C';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, pxW, 6);
        ctx.strokeStyle = '#8A7A6A';
        ctx.beginPath();
        ctx.moveTo(0, 3);
        ctx.lineTo(pxW, 3);
        ctx.stroke();
      } else if (el.type === 'column') {
        ctx.fillStyle = '#54483C';
        ctx.fillRect(0, 0, pxW, pxW);
        ctx.strokeStyle = '#3F3832';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, pxW, pxW);
      } else if (el.type === 'furniture') {
        ctx.fillStyle = '#E5DDD3';
        ctx.fillRect(0, 0, pxW, pxL);
        ctx.strokeStyle = isSelected ? '#54483C' : '#8A7A6A';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, pxW, pxL);
        ctx.fillStyle = '#54483C';
        ctx.font = '10px sans-serif';
        ctx.fillText(el.label || 'Furniture', 4, 12);
      }

      // Selection indicator handles
      if (isSelected) {
        ctx.strokeStyle = '#54483C';
        ctx.fillStyle = '#FAF7F2';
        ctx.lineWidth = 1.5;
        const handleSize = 6;
        ctx.fillRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(-handleSize / 2, -handleSize / 2, handleSize, handleSize);
        ctx.fillRect(pxW - handleSize / 2, pxL - handleSize / 2, handleSize, handleSize);
        ctx.strokeRect(pxW - handleSize / 2, pxL - handleSize / 2, handleSize, handleSize);
      }

      ctx.restore();
    });

    // Preview current drawing
    if (isDrawing && drawStart) {
      const pX = drawStart.x * gridSize;
      const pY = drawStart.y * gridSize;
      const curX = currentMouse.x;
      const curY = currentMouse.y;

      ctx.strokeStyle = '#54483C';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);

      if (activeTool === 'wall' || activeTool === 'door' || activeTool === 'window') {
        ctx.beginPath();
        ctx.moveTo(pX, pY);
        ctx.lineTo(curX, curY);
        ctx.stroke();
      } else if (activeTool === 'room') {
        ctx.strokeRect(pX, pY, curX - pX, curY - pY);
      }
      ctx.setLineDash([]);
    }
  }, [elements, selectedId, isDrawing, drawStart, currentMouse, gridSize]);

  const snap = (val: number): number => {
    if (!snapToGrid) return val;
    return Math.round(val);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const rawX = (e.clientX - rect.left) / gridSize;
    const rawY = (e.clientY - rect.top) / gridSize;
    const snappedX = snap(rawX);
    const snappedY = snap(rawY);

    if (activeTool === 'select') {
      // Find clicked element
      const clicked = elements.slice().reverse().find((el) => {
        return (
          rawX >= el.x &&
          rawX <= el.x + el.width &&
          rawY >= el.y &&
          rawY <= el.y + el.length
        );
      });
      setSelectedId(clicked ? clicked.id : null);
      return;
    }

    setIsDrawing(true);
    setDrawStart({ x: snappedX, y: snappedY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setCurrentMouse({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart) {
      setIsDrawing(false);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const endX = snap((e.clientX - rect.left) / gridSize);
    const endY = snap((e.clientY - rect.top) / gridSize);

    const width = Math.max(0.5, Math.abs(endX - drawStart.x));
    const length = Math.max(0.5, Math.abs(endY - drawStart.y));
    const startX = Math.min(drawStart.x, endX);
    const startY = Math.min(drawStart.y, endY);

    let newEl: CADElement | null = null;

    if (activeTool === 'wall') {
      newEl = {
        id: `wall-${Date.now()}`,
        type: 'wall',
        x: startX,
        y: startY,
        width: Math.max(0.3, width),
        length: Math.max(0.3, length),
        rotation: 0,
        label: 'Partition Wall'
      };
    } else if (activeTool === 'room') {
      newEl = {
        id: `room-${Date.now()}`,
        type: 'room',
        x: startX,
        y: startY,
        width: Math.max(2, width),
        length: Math.max(2, length),
        rotation: 0,
        label: 'New Space'
      };
    } else if (activeTool === 'door') {
      newEl = {
        id: `door-${Date.now()}`,
        type: 'door',
        x: startX,
        y: startY,
        width: 1.2,
        length: 0.2,
        rotation: 0,
        label: 'Door'
      };
    } else if (activeTool === 'window') {
      newEl = {
        id: `win-${Date.now()}`,
        type: 'window',
        x: startX,
        y: startY,
        width: Math.max(1.5, width),
        length: 0.2,
        rotation: 0,
        label: 'Window'
      };
    } else if (activeTool === 'column') {
      newEl = {
        id: `col-${Date.now()}`,
        type: 'column',
        x: startX,
        y: startY,
        width: 0.6,
        length: 0.6,
        rotation: 0,
        label: 'Structural Column'
      };
    }

    if (newEl) {
      const updated = [...elements, newEl];
      setElements(updated);
      setSelectedId(newEl.id);
      onUpdateElements(updated);

      // Record History
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(updated);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }

    setIsDrawing(false);
    setDrawStart(null);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setElements(prev);
      onUpdateElements(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setElements(next);
      onUpdateElements(next);
    }
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    const updated = elements.filter(el => el.id !== selectedId);
    setElements(updated);
    setSelectedId(null);
    onUpdateElements(updated);
  };

  const selectedElement = elements.find(el => el.id === selectedId);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF7F2] select-none overflow-hidden">
      {/* CAD Toolbar */}
      <div className="h-13 bg-[#FAF7F2] border-b border-[#D8CEC2] px-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTool === 'select' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#3F3832] hover:bg-[#EFE6DA]'
            }`}
            title={t('toolSelect')}
          >
            <MousePointer className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('toolSelect')}</span>
          </button>

          <div className="w-[1px] h-5 bg-[#D8CEC2] mx-1" />

          <button
            onClick={() => setActiveTool('wall')}
            className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTool === 'wall' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#3F3832] hover:bg-[#EFE6DA]'
            }`}
            title={t('toolWall')}
          >
            <div className="w-3.5 h-1.5 bg-current rounded-sm"></div>
            <span>{t('toolWall')}</span>
          </button>

          <button
            onClick={() => setActiveTool('room')}
            className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTool === 'room' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#3F3832] hover:bg-[#EFE6DA]'
            }`}
            title={t('toolRoom')}
          >
            <Square className="w-3.5 h-3.5" />
            <span>{t('toolRoom')}</span>
          </button>

          <button
            onClick={() => setActiveTool('door')}
            className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTool === 'door' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#3F3832] hover:bg-[#EFE6DA]'
            }`}
            title={t('toolDoor')}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>{t('toolDoor')}</span>
          </button>

          <button
            onClick={() => setActiveTool('window')}
            className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTool === 'window' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#3F3832] hover:bg-[#EFE6DA]'
            }`}
            title={t('toolWindow')}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{t('toolWindow')}</span>
          </button>

          <button
            onClick={() => setActiveTool('column')}
            className={`p-2 rounded text-xs transition-colors flex items-center gap-1.5 ${
              activeTool === 'column' ? 'bg-[#54483C] text-[#FAF7F2]' : 'text-[#3F3832] hover:bg-[#EFE6DA]'
            }`}
            title={t('toolColumn')}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t('toolColumn')}</span>
          </button>

          <div className="w-[1px] h-5 bg-[#D8CEC2] mx-1" />

          {/* Undo / Redo / Delete */}
          <button
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className="p-1.5 rounded hover:bg-[#EFE6DA] text-[#3F3832] disabled:opacity-30"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded hover:bg-[#EFE6DA] text-[#3F3832] disabled:opacity-30"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          {selectedId && (
            <button
              onClick={handleDeleteSelected}
              className="p-1.5 rounded hover:bg-rose-100 text-rose-700"
              title="Delete Selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Snap & 3D Conversion */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={`px-2.5 py-1 text-xs border rounded flex items-center gap-1.5 transition-colors ${
              snapToGrid ? 'bg-[#FAF7F2] border-[#54483C] text-[#54483C]' : 'bg-[#EFE6DA] border-[#D8CEC2] text-[#756A60]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>{t('snapToGrid')}</span>
          </button>

          <button
            onClick={onOpen3DView}
            className="px-3 py-1.5 bg-[#54483C] text-[#FAF7F2] rounded text-xs font-medium hover:bg-[#3F3832] transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Box className="w-3.5 h-3.5" />
            <span>{t('convertTo3D')}</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Grid Canvas & Properties */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Technical Drawing Canvas */}
        <div className="flex-1 overflow-auto bg-[#EFE6DA] flex items-center justify-center p-4">
          <canvas
            ref={canvasRef}
            width={900}
            height={650}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="shadow-md rounded border border-[#D8CEC2] cursor-crosshair bg-[#FAF7F2]"
          />
        </div>

        {/* Right Element Properties */}
        {selectedElement && (
          <div className="w-64 bg-[#FAF7F2] border-l border-[#D8CEC2] p-4 text-xs space-y-4">
            <div className="border-b border-[#D8CEC2] pb-2">
              <span className="font-semibold uppercase tracking-wider text-[#54483C]">
                Element Properties
              </span>
              <p className="text-[11px] text-[#756A60] capitalize">{selectedElement.type} ({selectedElement.id})</p>
            </div>

            <div>
              <label className="text-[#756A60] block mb-1">Label Name</label>
              <input
                type="text"
                value={selectedElement.label || ''}
                onChange={(e) => {
                  const updated = elements.map(el => el.id === selectedId ? { ...el, label: e.target.value } : el);
                  setElements(updated);
                  onUpdateElements(updated);
                }}
                className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2 py-1 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[#756A60] block mb-1">Width (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedElement.width}
                  onChange={(e) => {
                    const updated = elements.map(el => el.id === selectedId ? { ...el, width: parseFloat(e.target.value) || 0.1 } : el);
                    setElements(updated);
                    onUpdateElements(updated);
                  }}
                  className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2 py-1 text-xs"
                />
              </div>

              <div>
                <label className="text-[#756A60] block mb-1">Length (m)</label>
                <input
                  type="number"
                  step="0.1"
                  value={selectedElement.length}
                  onChange={(e) => {
                    const updated = elements.map(el => el.id === selectedId ? { ...el, length: parseFloat(e.target.value) || 0.1 } : el);
                    setElements(updated);
                    onUpdateElements(updated);
                  }}
                  className="w-full bg-[#EFE6DA] border border-[#D8CEC2] rounded px-2 py-1 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[#756A60] block mb-1">Rotation Angle</label>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const updated = elements.map(el => el.id === selectedId ? { ...el, rotation: (el.rotation + 45) % 360 } : el);
                    setElements(updated);
                    onUpdateElements(updated);
                  }}
                  className="flex-1 py-1.5 bg-[#EFE6DA] border border-[#D8CEC2] rounded text-xs hover:bg-[#D8CEC2] flex items-center justify-center gap-1"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>+45°</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
