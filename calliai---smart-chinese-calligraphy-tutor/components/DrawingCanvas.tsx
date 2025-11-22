import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Point, Stroke } from '../types';

// Declare HanziWriter as it is loaded from CDN
declare const HanziWriter: any;

export interface CanvasHandle {
  clear: () => void;
  undo: () => void;
  isEmpty: () => boolean;
  getRainbowImage: () => string;
  animateCharacter: () => void;
}

interface DrawingCanvasProps {
  targetChar: string;
  showGuide: boolean;
  highlightedStroke?: number | null;
}

export const DrawingCanvas = forwardRef<CanvasHandle, DrawingCanvasProps>(({ targetChar, showGuide, highlightedStroke }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const writerContainerRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<any>(null); // Store HanziWriter instance

  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke>([]);

  // --- HanziWriter Initialization & Management ---
  useEffect(() => {
    if (!writerContainerRef.current || !containerRef.current) return;

    // Clear previous instance content
    writerContainerRef.current.innerHTML = '';
    writerRef.current = null;

    // Only attempt to load if we have a single character
    if (!targetChar || targetChar.length !== 1) {
      return;
    }
    
    const size = containerRef.current.offsetWidth;

    try {
      writerRef.current = HanziWriter.create(writerContainerRef.current, targetChar, {
        width: size,
        height: size,
        padding: 5,
        showOutline: showGuide, // Initial state based on prop
        showCharacter: false,   // Start hidden, only show outline if enabled
        strokeAnimationSpeed: 1, 
        delayBetweenStrokes: 200,
        strokeColor: '#d946ef', // Purple/Pink for animation
        radicalColor: null,     // Ensure uniform color
        outlineColor: 'rgba(0, 0, 0, 0.15)', // Light gray guide
        drawingWidth: 20,
        onLoadCharDataError: (err: any) => {
           console.warn("HanziWriter data not found for:", targetChar);
           // If data not found (e.g. rare char or non-Chinese), writerRef.current might exist but be unusable for anim.
           // We can just leave it; visual result is no guide.
        }
      });
    } catch (e) {
      console.error("Failed to load HanziWriter", e);
    }

    return () => {
      writerRef.current = null;
    };
  }, [targetChar]); // Re-init only when char changes

  // Handle Guide Toggle
  useEffect(() => {
    if (!writerRef.current) return;
    // Check if showOutline method exists (it should, but safety first)
    if (showGuide) {
      writerRef.current.showOutline();
    } else {
      writerRef.current.hideOutline();
    }
  }, [showGuide]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        
        // Resize Canvas
        canvasRef.current.width = width;
        canvasRef.current.height = width;
        drawCanvas();
        
        // Resize Writer (Simple approach: reload or ignore if minor)
        // For full responsiveness, we would need to call writer.updateDimensions() if supported or recreate.
        // Recreating is expensive, so we skip for this simplified version unless necessary.
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial sizing

    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, currentStroke]); // Re-draw canvas on resize using current strokes

  // --- Canvas Logic ---

  // Re-draw whenever strokes change or highlightedStroke changes
  useEffect(() => {
    drawCanvas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes, currentStroke, highlightedStroke]);


  const getCoordinates = (event: React.MouseEvent | React.TouchEvent): Point | null => {
    if (!canvasRef.current) return null;
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in event) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (event: React.MouseEvent | React.TouchEvent) => {
    if(event.cancelable) event.preventDefault();
    const point = getCoordinates(event);
    if (point) {
      setIsDrawing(true);
      setCurrentStroke([point]);
    }
  };

  const draw = (event: React.MouseEvent | React.TouchEvent) => {
    if(event.cancelable) event.preventDefault();
    if (!isDrawing) return;
    const point = getCoordinates(event);
    if (point) {
      setCurrentStroke(prev => [...prev, point]);
    }
  };

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
    }
    setIsDrawing(false);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, size: number) => {
    ctx.save();
    // Use Cinnabar Red with some transparency for visibility
    ctx.strokeStyle = 'rgba(230, 57, 70, 0.6)';
    ctx.lineWidth = 1.5;
    
    // Apply dotted line style to all internal grid lines
    ctx.setLineDash([5, 5]); 
    
    // Diagonal lines (Rice grid)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(size, size);
    ctx.moveTo(size, 0);
    ctx.lineTo(0, size);
    ctx.stroke();

    // Center lines
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();
    
    ctx.restore();
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;

    // Clear
    ctx.clearRect(0, 0, size, size);
    
    // Background - Removed to allow seeing the layer below (HanziWriter)
    // ctx.fillStyle = '#fdfbf7';
    // ctx.fillRect(0, 0, size, size);

    // Grid
    drawGrid(ctx, size);

    // Draw saved strokes
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size * 0.04;

    strokes.forEach((stroke, index) => {
      if (stroke.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }

      // Highlight logic
      if (highlightedStroke !== null && highlightedStroke !== undefined) {
         // Note: highlightedStroke is 1-based index from Gemini, strokes array is 0-based
         const isHighlighted = (index + 1) === highlightedStroke;
         
         if (isHighlighted) {
           ctx.strokeStyle = '#e63946'; // Cinnabar Red for the error stroke
           ctx.lineWidth = size * 0.05; // Slightly thicker
           ctx.globalAlpha = 1.0;
         } else {
           ctx.strokeStyle = '#1a1a1a';
           ctx.lineWidth = size * 0.04;
           ctx.globalAlpha = 0.2; // Dim others
         }
      } else {
         // Normal state
         ctx.strokeStyle = '#1a1a1a';
         ctx.lineWidth = size * 0.04;
         ctx.globalAlpha = 1.0;
      }

      ctx.stroke();
      
      // Optional: Draw subtle start dot to hint direction to user
      // Only show dots for highlighted stroke or all if none highlighted
      if (highlightedStroke === null || highlightedStroke === undefined || (index + 1) === highlightedStroke) {
        ctx.fillStyle = (highlightedStroke !== null && (index + 1) === highlightedStroke) ? '#e63946' : '#1a1a1a';
        ctx.beginPath();
        ctx.arc(stroke[0].x, stroke[0].y, size * 0.015, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Reset alpha for current stroke
    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = size * 0.04;

    // Draw current stroke
    if (currentStroke.length > 0) {
      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
    }
  };

  useImperativeHandle(ref, () => ({
    clear: () => {
      setStrokes([]);
      setCurrentStroke([]);
      // We don't necessarily need to clear the writer, but we should stop animation if running
      if (writerRef.current) {
        writerRef.current.cancelQuiz(); // Stops animation/quiz
        writerRef.current.hideCharacter(); // Hide filled strokes
        if (showGuide) writerRef.current.showOutline(); // Ensure guide remains if enabled
      }
    },
    undo: () => {
      setStrokes(prev => prev.slice(0, -1));
    },
    isEmpty: () => strokes.length === 0 && currentStroke.length === 0,
    getRainbowImage: () => {
      if (!canvasRef.current) return '';
      
      const size = canvasRef.current.width;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = size;
      offCanvas.height = size;
      const ctx = offCanvas.getContext('2d');
      
      if (!ctx) return '';

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = size * 0.04;

      const totalStrokes = strokes.length;

      strokes.forEach((stroke, index) => {
        if (stroke.length < 2) return;
        
        // Hue: Red(0) -> Purple(270)
        const hue = totalStrokes > 1 ? (index / (totalStrokes - 1)) * 270 : 0;
        
        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });

      // Draw large dots at start for Direction Detection
      strokes.forEach((stroke, index) => {
          if (stroke.length > 0) {
            const hue = totalStrokes > 1 ? (index / (totalStrokes - 1)) * 270 : 0;
            ctx.fillStyle = `hsl(${hue}, 100%, 30%)`; 
            ctx.beginPath();
            ctx.arc(stroke[0].x, stroke[0].y, size * 0.03, 0, Math.PI * 2);
            ctx.fill();
          }
      });

      return offCanvas.toDataURL('image/png');
    },
    animateCharacter: () => {
      // Clear user strokes before animation
      setStrokes([]);
      setCurrentStroke([]);
      
      if (writerRef.current) {
        // Hide standard character fill before animating to ensure clean start
        writerRef.current.hideCharacter();
        writerRef.current.animateCharacter({
          onComplete: () => {
             // Animation complete
          }
        });
      }
    }
  }));

  return (
    <div 
      ref={containerRef} 
      className="w-full aspect-square max-w-md bg-rice-paper shadow-2xl rounded-sm cursor-crosshair touch-none border-8 border-white relative"
      style={{ touchAction: 'none' }}
    >
      {/* Animation/Guide Layer - Z-Index 10 to be below drawing */}
      <div 
        ref={writerContainerRef} 
        className="absolute inset-0 z-10 pointer-events-none" 
      />
      
      {/* Drawing Layer - Z-Index 20 to be on top */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="w-full h-full relative z-20"
      />
    </div>
  );
});

DrawingCanvas.displayName = 'DrawingCanvas';