
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader.js';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader.js';
import { AMFLoader } from 'three/examples/jsm/loaders/AMFLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

export type LoadedModel = {
  object: THREE.Object3D;
  animations?: THREE.AnimationClip[];
  metadata: {
    vertices: number;
    faces: number;
    name: string;
    size: string;
    extension: string;
  };
};

export async function loadModel(file: File): Promise<LoadedModel> {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const url = URL.createObjectURL(file);
  const manager = new THREE.LoadingManager();
  
  try {
    let object: THREE.Object3D = new THREE.Group();
    let animations: THREE.AnimationClip[] = [];

    switch (extension) {
      case 'gltf':
      case 'glb': {
        const loader = new GLTFLoader(manager);
        const result = await loader.loadAsync(url);
        object = result.scene;
        animations = result.animations;
        break;
      }
      case 'obj': {
        const loader = new OBJLoader(manager);
        object = await loader.loadAsync(url);
        break;
      }
      case 'fbx': {
        const loader = new FBXLoader(manager);
        object = await loader.loadAsync(url);
        break;
      }
      case 'stl': {
        const loader = new STLLoader(manager);
        const geometry = await loader.loadAsync(url);
        const material = new THREE.MeshPhongMaterial({ color: 0xcccccc, specular: 0x111111, shininess: 200 });
        object = new THREE.Mesh(geometry, material);
        break;
      }
      case 'ply': {
        const loader = new PLYLoader(manager);
        const geometry = await loader.loadAsync(url);
        geometry.computeVertexNormals();
        const material = new THREE.MeshStandardMaterial({ color: 0xcccccc });
        object = new THREE.Mesh(geometry, material);
        break;
      }
      case '3ds': {
        const loader = new TDSLoader(manager);
        object = await loader.loadAsync(url);
        break;
      }
      case '3mf': {
        const loader = new ThreeMFLoader(manager);
        object = await loader.loadAsync(url);
        break;
      }
      case 'amf': {
        const loader = new AMFLoader(manager);
        object = await loader.loadAsync(url);
        break;
      }
      case 'dae': {
        const loader = new ColladaLoader(manager);
        const result = await loader.loadAsync(url);
        object = result.scene;
        break;
      }
      default:
        throw new Error(`Unsupported format: .${extension}`);
    }

    const metadata = calculateMetadata(object, file);
    return { object, animations, metadata };
  } finally {
    URL.revokeObjectURL(url);
  }
}

function calculateMetadata(object: THREE.Object3D, file: File): LoadedModel['metadata'] {
  let vertices = 0;
  let faces = 0;

  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const geometry = child.geometry;
      if (geometry instanceof THREE.BufferGeometry) {
        vertices += geometry.attributes.position.count;
        if (geometry.index) {
          faces += geometry.index.count / 3;
        } else {
          faces += geometry.attributes.position.count / 3;
        }
      }
    }
  });

  return {
    vertices,
    faces: Math.floor(faces),
    name: file.name,
    size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
    extension: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
  };
}
