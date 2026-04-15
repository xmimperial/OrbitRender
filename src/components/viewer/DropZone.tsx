
"use client";

import React, { useState } from 'react';
import { Upload, Box } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFilesDropped: (files: File[]) => void;
  className?: string;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesDropped, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesDropped(files);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl transition-all duration-300 ease-in-out group",
        isDragging 
          ? "border-accent bg-accent/10 scale-[1.02]" 
          : "border-border hover:border-primary/50 hover:bg-primary/5",
        className
      )}
    >
      <div className={cn(
        "w-16 h-16 mb-6 rounded-full flex items-center justify-center transition-colors",
        isDragging ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground group-hover:text-primary"
      )}>
        <Upload className="w-8 h-8" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2 text-foreground">
        Drag and drop 3D models here
      </h3>
      
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Supported formats: 3dm, 3ds, 3mf, amf, bim, brep, dae, fbx, fcstd, gltf, ifc, iges, step, stl, obj, off, ply, wrl
      </p>

      <div className="flex flex-wrap justify-center gap-2 opacity-50">
        {['GLB', 'FBX', 'OBJ', 'STL', 'PLY'].map(format => (
          <span key={format} className="px-2 py-1 text-[10px] font-bold border rounded uppercase tracking-wider">
            {format}
          </span>
        ))}
      </div>
    </div>
  );
};
