
"use client";

import React from 'react';
import { LoadedModel } from './LoaderManager';
import { 
  Info, 
  Settings2, 
  Grid, 
  Axis3d, 
  Box, 
  RefreshCcw, 
  Sun, 
  Lightbulb, 
  Layers,
  FileCode,
  HardDrive,
  Database
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface InfoPanelProps {
  model: LoadedModel | null;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ model }) => {
  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center italic">
        <Box className="w-12 h-12 mb-4 opacity-20" />
        <p>No model loaded. Drop a file to view metadata.</p>
      </div>
    );
  }

  const stats = [
    { label: 'Format', value: model.metadata.extension, icon: FileCode },
    { label: 'Size', value: model.metadata.size, icon: HardDrive },
    { label: 'Vertices', value: model.metadata.vertices.toLocaleString(), icon: Database },
    { label: 'Faces', value: model.metadata.faces.toLocaleString(), icon: Layers },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Info className="w-4 h-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Model Inspector</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-[10px] uppercase text-muted-foreground font-bold">Filename</Label>
          <div className="text-sm font-medium truncate py-1" title={model.metadata.name}>
            {model.metadata.name}
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <stat.icon className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors" />
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
              <span className="text-xs font-mono font-bold text-foreground">{stat.value}</span>
            </div>
          ))}
        </div>

        <Separator />

        <div>
          <Label className="text-[10px] uppercase text-muted-foreground font-bold">Structure</Label>
          <div className="mt-2 text-xs text-muted-foreground border rounded-md p-2 bg-black/20">
            <div className="flex items-center gap-1">
              <span className="text-accent">●</span> Root
            </div>
            <div className="pl-4 border-l border-border ml-1 mt-1">
              <div className="flex items-center gap-1">
                <span className="text-primary opacity-50">└─</span> {model.metadata.name.split('.')[0]}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ControlPanelProps {
  settings: {
    grid: boolean;
    axes: boolean;
    wireframe: boolean;
    autoRotate: boolean;
    ambientIntensity: number;
    lightIntensity: number;
  };
  onUpdate: (key: string, value: any) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ settings, onUpdate }) => {
  return (
    <div className="p-4 space-y-8">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-bold uppercase tracking-wider">Scene Controls</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <Label className="text-[10px] uppercase text-muted-foreground font-bold">Visualization</Label>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">Show Grid</span>
            </div>
            <Switch checked={settings.grid} onCheckedChange={(v) => onUpdate('grid', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Axis3d className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">Show Axes</span>
            </div>
            <Switch checked={settings.axes} onCheckedChange={(v) => onUpdate('axes', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Box className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">Wireframe</span>
            </div>
            <Switch checked={settings.wireframe} onCheckedChange={(v) => onUpdate('wireframe', v)} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs">Auto Rotate</span>
            </div>
            <Switch checked={settings.autoRotate} onCheckedChange={(v) => onUpdate('autoRotate', v)} />
          </div>
        </div>

        <Separator />

        <div className="space-y-6">
          <Label className="text-[10px] uppercase text-muted-foreground font-bold">Lighting</Label>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs">Ambient</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{settings.ambientIntensity.toFixed(1)}</span>
            </div>
            <Slider 
              value={[settings.ambientIntensity]} 
              min={0} max={2} step={0.1}
              onValueChange={([v]) => onUpdate('ambientIntensity', v)}
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs">Direct</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">{settings.lightIntensity.toFixed(1)}</span>
            </div>
            <Slider 
              value={[settings.lightIntensity]} 
              min={0} max={4} step={0.1}
              onValueChange={([v]) => onUpdate('lightIntensity', v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
