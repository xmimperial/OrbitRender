
"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LoadedModel } from './LoaderManager';
import { Button } from '@/components/ui/button';
import { Maximize, RotateCcw } from 'lucide-react';

interface OrbitViewerProps {
  model: LoadedModel | null;
  settings: {
    grid: boolean;
    axes: boolean;
    wireframe: boolean;
    autoRotate: boolean;
    ambientIntensity: number;
    lightIntensity: number;
  };
}

export const OrbitViewer: React.FC<OrbitViewerProps> = ({ model, settings }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group>(new THREE.Group());
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const axesHelperRef = useRef<THREE.AxesHelper | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialization
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x21252b);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    ambientLight.name = 'AmbientLight';
    scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(0xffffff, 1);
    directLight.position.set(5, 10, 7.5);
    directLight.name = 'DirectionalLight';
    scene.add(directLight);

    scene.add(modelGroupRef.current);

    // Helpers
    const gridHelper = new THREE.GridHelper(20, 20, 0x3875f0, 0x444444);
    gridHelperRef.current = gridHelper;
    scene.add(gridHelper);

    const axesHelper = new THREE.AxesHelper(5);
    axesHelperRef.current = axesHelper;
    scene.add(axesHelper);

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (controlsRef.current) {
        controlsRef.current.update();
      }
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Update Settings
  useEffect(() => {
    if (!sceneRef.current) return;
    if (gridHelperRef.current) gridHelperRef.current.visible = settings.grid;
    if (axesHelperRef.current) axesHelperRef.current.visible = settings.axes;
    if (controlsRef.current) controlsRef.current.autoRotate = settings.autoRotate;

    const ambient = sceneRef.current.getObjectByName('AmbientLight') as THREE.AmbientLight;
    if (ambient) ambient.intensity = settings.ambientIntensity;

    const direct = sceneRef.current.getObjectByName('DirectionalLight') as THREE.DirectionalLight;
    if (direct) direct.intensity = settings.lightIntensity;

    modelGroupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => (m.wireframe = settings.wireframe));
        } else {
          child.material.wireframe = settings.wireframe;
        }
      }
    });
  }, [settings]);

  // Handle Model Load
  useEffect(() => {
    if (!model) return;

    modelGroupRef.current.clear();
    modelGroupRef.current.add(model.object);

    // Center and Fit Camera
    const box = new THREE.Box3().setFromObject(model.object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.object.position.x += (model.object.position.x - center.x);
    model.object.position.y += (model.object.position.y - center.y);
    model.object.position.z += (model.object.position.z - center.z);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = cameraRef.current?.fov || 45;
    let cameraZ = Math.abs(maxDim / 2 / Math.tan(THREE.MathUtils.degToRad(fov / 2)));
    cameraZ *= 2; // Add some padding

    if (cameraRef.current) {
      cameraRef.current.position.set(cameraZ, cameraZ, cameraZ);
      cameraRef.current.lookAt(new THREE.Vector3(0, 0, 0));
    }
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [model]);

  const resetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(5, 5, 5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const fitView = () => {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model.object);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(THREE.MathUtils.degToRad(45 / 2))) * 2;
    cameraRef.current?.position.set(cameraZ, cameraZ, cameraZ);
    controlsRef.current?.target.set(0, 0, 0);
    controlsRef.current?.update();
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div ref={containerRef} className="flex-1 cursor-move" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-2 bg-background/80 backdrop-blur-md rounded-full border shadow-2xl">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 text-foreground" onClick={resetCamera} title="Reset Camera">
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 text-foreground" onClick={fitView} title="Fit View">
          <Maximize className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
