
"use client";

import React, { useState } from 'react';
import { OrbitViewer } from '@/components/viewer/OrbitViewer';
import { DropZone } from '@/components/viewer/DropZone';
import { InfoPanel, ControlPanel } from '@/components/viewer/Sidebar';
import { loadModel, LoadedModel } from '@/components/viewer/LoaderManager';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Box, X, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrbitRenderPage() {
  const [model, setModel] = useState<LoadedModel | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    grid: true,
    axes: true,
    wireframe: false,
    autoRotate: false,
    ambientIntensity: 0.8,
    lightIntensity: 1.5,
  });

  const handleFilesDropped = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setLoading(true);
    try {
      const loadedModel = await loadModel(file);
      setModel(loadedModel);
      toast({
        title: "Model loaded successfully",
        description: `${file.name} - ${loadedModel.metadata.vertices.toLocaleString()} vertices`,
      });
    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Load Failed",
        description: error.message || "Failed to parse model format.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-body selection:bg-primary/30">
      {/* Left Panel - Metadata */}
      <aside className="w-72 h-full border-r bg-card/30 backdrop-blur-xl z-10 hidden xl:block shadow-2xl">
        <InfoPanel model={model} />
      </aside>

      {/* Main Viewer Area */}
      <main className="flex-1 relative flex flex-col">
        {/* Header Bar */}
        <header className="h-16 border-b bg-card/20 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <Box className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">OrbitRender</h1>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em] leading-none">Universal 3D Viewer</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {model && (
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-8 border-dashed hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
                onClick={() => setModel(null)}
              >
                <X className="w-3 h-3 mr-2" />
                Clear Scene
              </Button>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_100%)] from-primary/5">
          {!model && !loading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
              <DropZone 
                onFilesDropped={handleFilesDropped} 
                className="max-w-xl w-full"
              />
            </div>
          )}

          {loading && (
            <div className="absolute inset-0 z-30 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-300">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-sm font-medium animate-pulse">Parsing geometry data...</p>
            </div>
          )}

          <OrbitViewer model={model} settings={settings} />
        </div>
      </main>

      {/* Right Panel - Controls */}
      <aside className="w-72 h-full border-l bg-card/30 backdrop-blur-xl z-10 hidden lg:block shadow-2xl">
        <ControlPanel settings={settings} onUpdate={updateSetting} />
      </aside>

      {/* Mobile/Small Screen Banner */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="rounded-full shadow-xl">
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
