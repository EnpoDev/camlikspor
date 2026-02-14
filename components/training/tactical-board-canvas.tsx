"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MousePointer2,
  MoveRight,
  Minus,
  Pencil,
  Eraser,
  Trash2,
  Sparkles,
} from "lucide-react";

type Tool = "select" | "arrow" | "line" | "freeDraw" | "eraser";

interface Player {
  id: number;
  x: number;
  y: number;
  team: "home" | "away";
  label: string;
  role: string;
}

interface DrawingLine {
  id: string;
  points: number[];
  type: "arrow" | "line" | "freeDraw";
  color: string;
}

interface TacticalBoardCanvasProps {
  initialData?: string;
  initialFormation?: string;
  onSave?: (data: string, formation: string) => void;
  onAiSuggest?: () => void;
  isAiLoading?: boolean;
  dictionary: Record<string, string>;
}

const FORMATIONS: Record<string, Array<{ role: string; x: number; y: number; label: string }>> = {
  "4-4-2": [
    { role: "GK", x: 400, y: 500, label: "GK" },
    { role: "RB", x: 680, y: 400, label: "RB" },
    { role: "CB", x: 500, y: 420, label: "CB" },
    { role: "CB", x: 300, y: 420, label: "CB" },
    { role: "LB", x: 120, y: 400, label: "LB" },
    { role: "RM", x: 680, y: 270, label: "RM" },
    { role: "CM", x: 500, y: 280, label: "CM" },
    { role: "CM", x: 300, y: 280, label: "CM" },
    { role: "LM", x: 120, y: 270, label: "LM" },
    { role: "ST", x: 480, y: 120, label: "ST" },
    { role: "ST", x: 320, y: 120, label: "ST" },
  ],
  "4-3-3": [
    { role: "GK", x: 400, y: 500, label: "GK" },
    { role: "RB", x: 680, y: 400, label: "RB" },
    { role: "CB", x: 500, y: 420, label: "CB" },
    { role: "CB", x: 300, y: 420, label: "CB" },
    { role: "LB", x: 120, y: 400, label: "LB" },
    { role: "CDM", x: 400, y: 300, label: "CDM" },
    { role: "CM", x: 570, y: 250, label: "CM" },
    { role: "CM", x: 230, y: 250, label: "CM" },
    { role: "RW", x: 680, y: 130, label: "RW" },
    { role: "ST", x: 400, y: 100, label: "ST" },
    { role: "LW", x: 120, y: 130, label: "LW" },
  ],
  "3-5-2": [
    { role: "GK", x: 400, y: 500, label: "GK" },
    { role: "CB", x: 560, y: 420, label: "CB" },
    { role: "CB", x: 400, y: 430, label: "CB" },
    { role: "CB", x: 240, y: 420, label: "CB" },
    { role: "RWB", x: 700, y: 280, label: "RWB" },
    { role: "CM", x: 530, y: 280, label: "CM" },
    { role: "CDM", x: 400, y: 310, label: "CDM" },
    { role: "CM", x: 270, y: 280, label: "CM" },
    { role: "LWB", x: 100, y: 280, label: "LWB" },
    { role: "ST", x: 480, y: 110, label: "ST" },
    { role: "ST", x: 320, y: 110, label: "ST" },
  ],
  "4-2-3-1": [
    { role: "GK", x: 400, y: 500, label: "GK" },
    { role: "RB", x: 680, y: 400, label: "RB" },
    { role: "CB", x: 500, y: 420, label: "CB" },
    { role: "CB", x: 300, y: 420, label: "CB" },
    { role: "LB", x: 120, y: 400, label: "LB" },
    { role: "CDM", x: 470, y: 310, label: "CDM" },
    { role: "CDM", x: 330, y: 310, label: "CDM" },
    { role: "RW", x: 650, y: 200, label: "RW" },
    { role: "CAM", x: 400, y: 200, label: "CAM" },
    { role: "LW", x: 150, y: 200, label: "LW" },
    { role: "ST", x: 400, y: 90, label: "ST" },
  ],
};

export function TacticalBoardCanvas({
  initialData,
  initialFormation = "4-4-2",
  onSave,
  onAiSuggest,
  isAiLoading = false,
  dictionary,
}: TacticalBoardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentTool, setCurrentTool] = useState<Tool>("select");
  const [formation, setFormation] = useState(initialFormation);
  const [players, setPlayers] = useState<Player[]>([]);
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([]);
  const [drawings, setDrawings] = useState<DrawingLine[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<number[]>([]);
  const [draggedPlayer, setDraggedPlayer] = useState<{ team: "home" | "away"; index: number } | null>(null);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  // Initialize players
  useEffect(() => {
    if (initialData) {
      try {
        const data = JSON.parse(initialData);
        if (data.homePlayers) setPlayers(data.homePlayers);
        if (data.awayPlayers) setAwayPlayers(data.awayPlayers);
        if (data.drawings) setDrawings(data.drawings);
        return;
      } catch {
        // Fall through to default initialization
      }
    }
    loadFormation(formation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadFormation = useCallback((f: string) => {
    const positions = FORMATIONS[f];
    if (!positions) return;

    const homePlayers: Player[] = positions.map((pos, i) => ({
      id: i + 1,
      x: pos.x,
      y: pos.y,
      team: "home" as const,
      label: pos.label,
      role: pos.role,
    }));

    // Mirror positions for away team
    const awayTeam: Player[] = positions.map((pos, i) => ({
      id: i + 12,
      x: 800 - pos.x,
      y: 540 - pos.y,
      team: "away" as const,
      label: pos.label,
      role: pos.role,
    }));

    setPlayers(homePlayers);
    setAwayPlayers(awayTeam);
  }, []);

  const handleFormationChange = (f: string) => {
    setFormation(f);
    loadFormation(f);
    setDrawings([]);
  };

  // Draw the pitch and all elements
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = 800;
    const h = 540;

    // Pitch background
    ctx.fillStyle = "#2d8a4e";
    ctx.fillRect(0, 0, w, h);

    // Field lines
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2;

    // Border
    ctx.strokeRect(30, 20, w - 60, h - 40);

    // Half line
    ctx.beginPath();
    ctx.moveTo(30, h / 2);
    ctx.lineTo(w - 30, h / 2);
    ctx.stroke();

    // Center circle
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 60, 0, Math.PI * 2);
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fill();

    // Top penalty area
    ctx.strokeRect(w / 2 - 120, 20, 240, 100);
    ctx.strokeRect(w / 2 - 50, 20, 100, 40);
    ctx.beginPath();
    ctx.arc(w / 2, 120, 60, 0, Math.PI);
    ctx.stroke();

    // Bottom penalty area
    ctx.strokeRect(w / 2 - 120, h - 120, 240, 100);
    ctx.strokeRect(w / 2 - 50, h - 60, 100, 40);
    ctx.beginPath();
    ctx.arc(w / 2, h - 120, 60, Math.PI, Math.PI * 2);
    ctx.stroke();

    // Corner arcs
    ctx.beginPath();
    ctx.arc(30, 20, 10, 0, Math.PI / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 30, 20, 10, Math.PI / 2, Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(30, h - 20, 10, -Math.PI / 2, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w - 30, h - 20, 10, Math.PI, Math.PI * 1.5);
    ctx.stroke();

    // Draw drawings
    drawings.forEach((drawing) => {
      if (drawing.points.length < 4) return;
      ctx.strokeStyle = drawing.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(drawing.points[0], drawing.points[1]);
      for (let i = 2; i < drawing.points.length; i += 2) {
        ctx.lineTo(drawing.points[i], drawing.points[i + 1]);
      }
      ctx.stroke();

      // Arrow head
      if (drawing.type === "arrow" && drawing.points.length >= 4) {
        const len = drawing.points.length;
        const endX = drawing.points[len - 2];
        const endY = drawing.points[len - 1];
        const prevX = drawing.points[len - 4] || drawing.points[0];
        const prevY = drawing.points[len - 3] || drawing.points[1];
        const angle = Math.atan2(endY - prevY, endX - prevX);
        const headLen = 12;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle - Math.PI / 6), endY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - headLen * Math.cos(angle + Math.PI / 6), endY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    });

    // Current drawing in progress
    if (currentDrawing.length >= 4) {
      ctx.strokeStyle = currentTool === "eraser" ? "#ff0000" : "#ffff00";
      ctx.lineWidth = currentTool === "eraser" ? 4 : 2;
      ctx.beginPath();
      ctx.moveTo(currentDrawing[0], currentDrawing[1]);
      for (let i = 2; i < currentDrawing.length; i += 2) {
        ctx.lineTo(currentDrawing[i], currentDrawing[i + 1]);
      }
      ctx.stroke();
    }

    // Draw players
    const drawPlayer = (p: Player, isHome: boolean) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
      ctx.fillStyle = isHome ? "#3b82f6" : "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.label, p.x, p.y);
    };

    players.forEach((p) => drawPlayer(p, true));
    awayPlayers.forEach((p) => drawPlayer(p, false));
  }, [players, awayPlayers, drawings, currentDrawing, currentTool]);

  useEffect(() => {
    draw();
  }, [draw]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 540 / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = 800 / rect.width;
    const scaleY = 540 / rect.height;
    const touch = e.touches[0] || e.changedTouches[0];
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    };
  };

  const findPlayer = (x: number, y: number) => {
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 20) {
        return { team: "home" as const, index: i };
      }
    }
    for (let i = 0; i < awayPlayers.length; i++) {
      const p = awayPlayers[i];
      if (Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < 20) {
        return { team: "away" as const, index: i };
      }
    }
    return null;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (currentTool === "select") {
      const player = findPlayer(pos.x, pos.y);
      if (player) {
        setDraggedPlayer(player);
      }
    } else if (currentTool === "eraser") {
      // Remove drawings near click
      const threshold = 20;
      setDrawings((prev) =>
        prev.filter((d) => {
          for (let i = 0; i < d.points.length; i += 2) {
            if (Math.sqrt((d.points[i] - pos.x) ** 2 + (d.points[i + 1] - pos.y) ** 2) < threshold) {
              return false;
            }
          }
          return true;
        })
      );
    } else {
      setIsDrawing(true);
      setStartPoint(pos);
      setCurrentDrawing([pos.x, pos.y]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);

    if (draggedPlayer) {
      const { team, index } = draggedPlayer;
      if (team === "home") {
        setPlayers((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], x: pos.x, y: pos.y };
          return updated;
        });
      } else {
        setAwayPlayers((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], x: pos.x, y: pos.y };
          return updated;
        });
      }
    } else if (isDrawing) {
      if (currentTool === "freeDraw") {
        setCurrentDrawing((prev) => [...prev, pos.x, pos.y]);
      } else if (startPoint) {
        setCurrentDrawing([startPoint.x, startPoint.y, pos.x, pos.y]);
      }
    }
  };

  const handleMouseUp = () => {
    if (draggedPlayer) {
      setDraggedPlayer(null);
    } else if (isDrawing && currentDrawing.length >= 4) {
      const newDrawing: DrawingLine = {
        id: Date.now().toString(),
        points: currentDrawing,
        type: currentTool as "arrow" | "line" | "freeDraw",
        color: "#ffff00",
      };
      setDrawings((prev) => [...prev, newDrawing]);
    }
    setIsDrawing(false);
    setCurrentDrawing([]);
    setStartPoint(null);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e);

    if (currentTool === "select") {
      const player = findPlayer(pos.x, pos.y);
      if (player) {
        setDraggedPlayer(player);
      }
    } else if (currentTool === "eraser") {
      const threshold = 20;
      setDrawings((prev) =>
        prev.filter((d) => {
          for (let i = 0; i < d.points.length; i += 2) {
            if (Math.sqrt((d.points[i] - pos.x) ** 2 + (d.points[i + 1] - pos.y) ** 2) < threshold) {
              return false;
            }
          }
          return true;
        })
      );
    } else {
      setIsDrawing(true);
      setStartPoint(pos);
      setCurrentDrawing([pos.x, pos.y]);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const pos = getTouchPos(e);

    if (draggedPlayer) {
      const { team, index } = draggedPlayer;
      if (team === "home") {
        setPlayers((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], x: pos.x, y: pos.y };
          return updated;
        });
      } else {
        setAwayPlayers((prev) => {
          const updated = [...prev];
          updated[index] = { ...updated[index], x: pos.x, y: pos.y };
          return updated;
        });
      }
    } else if (isDrawing) {
      if (currentTool === "freeDraw") {
        setCurrentDrawing((prev) => [...prev, pos.x, pos.y]);
      } else if (startPoint) {
        setCurrentDrawing([startPoint.x, startPoint.y, pos.x, pos.y]);
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (draggedPlayer) {
      setDraggedPlayer(null);
    } else if (isDrawing && currentDrawing.length >= 4) {
      const newDrawing: DrawingLine = {
        id: Date.now().toString(),
        points: currentDrawing,
        type: currentTool as "arrow" | "line" | "freeDraw",
        color: "#ffff00",
      };
      setDrawings((prev) => [...prev, newDrawing]);
    }
    setIsDrawing(false);
    setCurrentDrawing([]);
    setStartPoint(null);
  };

  const handleClear = () => {
    setDrawings([]);
  };

  const handleSave = () => {
    const data = JSON.stringify({
      homePlayers: players,
      awayPlayers: awayPlayers,
      drawings: drawings,
    });
    onSave?.(data, formation);
  };

  const applyAiSuggestion = (suggestion: { players?: Array<{ id: number; role: string; x: number; y: number; label: string }> }) => {
    if (suggestion.players) {
      const homePlayers: Player[] = suggestion.players.map((p) => ({
        ...p,
        team: "home" as const,
      }));
      setPlayers(homePlayers);
    }
  };

  // Expose functions for parent
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__applyTacticalSuggestion = applyAiSuggestion;
    (window as unknown as Record<string, unknown>).__getTacticalBoardData = () => {
      const data = JSON.stringify({
        homePlayers: players,
        awayPlayers: awayPlayers,
        drawings: drawings,
      });
      return { data, formation };
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__applyTacticalSuggestion;
      delete (window as unknown as Record<string, unknown>).__getTacticalBoardData;
    };
  });

  const tools: Array<{ id: Tool; icon: typeof MousePointer2; label: string }> = [
    { id: "select", icon: MousePointer2, label: dictionary.select || "Select" },
    { id: "arrow", icon: MoveRight, label: dictionary.arrow || "Arrow" },
    { id: "line", icon: Minus, label: dictionary.line || "Line" },
    { id: "freeDraw", icon: Pencil, label: dictionary.freeDraw || "Free Draw" },
    { id: "eraser", icon: Eraser, label: dictionary.eraser || "Eraser" },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Tools */}
        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentTool(tool.id)}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </Button>
          ))}
        </div>

        {/* Formation selector */}
        <Select value={formation} onValueChange={handleFormationChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(FORMATIONS).map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1" />

        {/* Actions */}
        <Button variant="outline" size="sm" onClick={handleClear}>
          <Trash2 className="mr-2 h-4 w-4" />
          {dictionary.clearBoard || "Clear"}
        </Button>
        {onAiSuggest && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAiSuggest}
            disabled={isAiLoading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isAiLoading
              ? dictionary.suggesting || "AI suggesting..."
              : dictionary.aiSuggest || "AI Suggest"}
          </Button>
        )}
      </div>

      {/* Canvas */}
      <div className="relative overflow-hidden rounded-lg border shadow-lg max-w-4xl mx-auto">
        <canvas
          ref={canvasRef}
          width={800}
          height={540}
          className="w-full cursor-crosshair"
          style={{ aspectRatio: "800/540", touchAction: "none" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500" />
          <span>{dictionary.homeTeam || "Home Team"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500" />
          <span>{dictionary.awayTeam || "Away Team"}</span>
        </div>
      </div>
    </div>
  );
}
