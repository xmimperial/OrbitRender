# **App Name**: OrbitRender

## Core Features:

- Drag & Drop Model Upload: Allows users to drag and drop 3D model files directly into the browser viewport with a clear visual cue and 'Drag and drop 3D models here' message, including file type validation for 'Supported formats: 3dm, 3ds, 3mf, amf, bim, brep, dae, fbx, fcstd, gltf, ifc, iges, step, stl, obj, off, ply, wrl'.
- Multi-format 3D Model Rendering: Initializes a Three.js scene with a perspective camera, WebGL renderer, and basic lighting. Automatically loads and renders models in supported formats like GLTF, OBJ, FBX, STL, and PLY, scaling and centering them to fit the viewport.
- Interactive Camera Controls: Enables users to interactively rotate, zoom, and pan the 3D model using OrbitControls. Includes a reset camera button and a fit-to-view functionality.
- Model Information Panel: Displays relevant metadata and structural information about the loaded 3D model in a dedicated left-hand panel.
- Scene Controls Panel: Provides a right-hand panel for basic scene controls, such as toggling environment lighting or helpers, for better model visualization.
- File Parsing and Loader Management: Dynamically detects file extensions and routes them to the appropriate Three.js loader, handling asynchronous loading and basic geometry normalization for consistent rendering.
- Loading & Error Feedback: Displays a loading spinner during model parsing and rendering, along with clear error messages for unsupported file formats or failed loads.

## Style Guidelines:

- The interface employs a modern dark color scheme, enhancing the visibility of 3D models. The primary accent is a rich, tech-inspired blue (#3875F0), evoking clarity and depth. The background is a subtle, desaturated dark slate (#21252B), providing a sophisticated canvas. A vibrant aqua (#45D4ED) serves as a complementary accent for interactive elements, bringing a dynamic touch to controls.
- The application uses 'Inter', a grotesque-style sans-serif font. Its modern, machined, and neutral aesthetic is highly suitable for both headlines and body text in a technical and precise application, ensuring readability and a contemporary feel.
- Minimalistic and crisp line-based icons should be used for all controls and informational indicators (e.g., rotate, zoom, pan, info, settings), maintaining a clean and professional look.
- The layout features a prominent central 3D viewing canvas flanked by slender panels: a left panel dedicated to model metadata/file information and a right panel for scene and viewer controls. This clean, symmetrical arrangement maximizes viewing space and ensures intuitive navigation.
- Subtle and smooth transition animations will be used for UI element changes, loading states, and camera interactions to provide a polished and responsive user experience without being distracting.