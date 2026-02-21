import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

export type SketchFn = (p: p5) => void;

export interface P5CanvasProps {
  sketch: SketchFn;
}

/**
 * P5Canvas - React component for embedding p5.js sketches
 * Handles proper mounting/unmounting and cleanup of p5 instances
 */
export const P5Canvas: React.FC<P5CanvasProps> = ({ sketch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5InstanceRef = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create p5 instance in instance mode
    p5InstanceRef.current = new p5(sketch, containerRef.current);

    // Cleanup on unmount or when sketch changes
    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [sketch]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: '100%', height: '100%' }}
    />
  );
};
