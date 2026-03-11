import { readFileSync } from 'fs';
import { Blob } from 'buffer';
import {
  Scene,
  Group,
  Box3,
  Vector3,
  Matrix4,
  MathUtils,
  BufferAttribute,
  LoaderUtils,
  FileLoader,
  TextureLoader,
  ImageBitmapLoader,
  Loader,
  Object3D,
} from 'three';

// Polyfill browser globals that GLTFLoader expects
globalThis.self = globalThis;
globalThis.window = globalThis;
globalThis.document = { createElementNS: () => ({}) };
globalThis.Blob = Blob;
globalThis.URL = URL;

// Monkey-patch FileLoader to read from filesystem
FileLoader.prototype.load = function (url, onLoad, _onProgress, onError) {
  try {
    const data = readFileSync(url);
    const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    if (onLoad) onLoad(ab);
    return ab;
  } catch (e) {
    if (onError) onError(e);
  }
};

// Monkey-patch TextureLoader to return a minimal texture object
TextureLoader.prototype.load = function (url, onLoad) {
  const tex = { isTexture: true, image: {}, uuid: MathUtils.generateUUID(), version: 0 };
  if (onLoad) setTimeout(() => onLoad(tex), 0);
  return tex;
};

// Now import GLTFLoader after globals are set
const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');

function loadGLB(filePath) {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    const data = readFileSync(filePath);
    const ab = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    loader.parse(
      ab,
      '',
      (gltf) => resolve(gltf),
      (err) => reject(err)
    );
  });
}

function analyzeModel(name, gltf) {
  const scene = gltf.scene;

  // Step 0: Show the raw scene transforms
  console.log(`\n${'='.repeat(70)}`);
  console.log(`MODEL: ${name}`);
  console.log('='.repeat(70));

  // Log the top-level children transforms
  scene.traverse((child) => {
    if (child.rotation.x !== 0 || child.rotation.y !== 0 || child.rotation.z !== 0) {
      console.log(`  Node "${child.name}" rotation: x=${MathUtils.radToDeg(child.rotation.x).toFixed(2)}deg, y=${MathUtils.radToDeg(child.rotation.y).toFixed(2)}deg, z=${MathUtils.radToDeg(child.rotation.z).toFixed(2)}deg`);
    }
  });

  // Step 1: Update world matrices so all internal transforms (including Sketchfab's -90 X rotation) are applied
  scene.updateMatrixWorld(true);

  // Compute bounding box in world space (after all internal transforms)
  const rawBox = new Box3();
  scene.traverse((child) => {
    if (child.isMesh && child.geometry) {
      const geo = child.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const box = geo.boundingBox.clone();
      box.applyMatrix4(child.matrixWorld);
      rawBox.union(box);
    }
  });

  const rawSize = new Vector3();
  rawBox.getSize(rawSize);
  const rawCenter = new Vector3();
  rawBox.getCenter(rawCenter);

  console.log('\n--- After internal transforms (world space) ---');
  console.log(`  BBox min: (${rawBox.min.x.toFixed(6)}, ${rawBox.min.y.toFixed(6)}, ${rawBox.min.z.toFixed(6)})`);
  console.log(`  BBox max: (${rawBox.max.x.toFixed(6)}, ${rawBox.max.y.toFixed(6)}, ${rawBox.max.z.toFixed(6)})`);
  console.log(`  Size:     (${rawSize.x.toFixed(6)}, ${rawSize.y.toFixed(6)}, ${rawSize.z.toFixed(6)})`);
  console.log(`  Center:   (${rawCenter.x.toFixed(6)}, ${rawCenter.y.toFixed(6)}, ${rawCenter.z.toFixed(6)})`);

  // Step 2: Scale to fit 2.2 units
  const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z);
  const scale = 2.2 / maxDim;
  console.log(`\n  maxDim = ${maxDim.toFixed(6)}, scale = 2.2 / ${maxDim.toFixed(6)} = ${scale.toFixed(6)}`);

  const scaledMin = rawBox.min.clone().multiplyScalar(scale);
  const scaledMax = rawBox.max.clone().multiplyScalar(scale);
  const scaledSize = rawSize.clone().multiplyScalar(scale);
  const scaledCenter = rawCenter.clone().multiplyScalar(scale);

  console.log('\n--- After scaling ---');
  console.log(`  BBox min: (${scaledMin.x.toFixed(6)}, ${scaledMin.y.toFixed(6)}, ${scaledMin.z.toFixed(6)})`);
  console.log(`  BBox max: (${scaledMax.x.toFixed(6)}, ${scaledMax.y.toFixed(6)}, ${scaledMax.z.toFixed(6)})`);
  console.log(`  Size:     (${scaledSize.x.toFixed(6)}, ${scaledSize.y.toFixed(6)}, ${scaledSize.z.toFixed(6)})`);

  // Step 3: Center at origin (translate so center becomes 0,0,0)
  const offset = scaledCenter.clone().negate();
  const finalMin = scaledMin.clone().add(offset);
  const finalMax = scaledMax.clone().add(offset);
  const finalSize = scaledSize.clone(); // size doesn't change
  const finalCenter = new Vector3(0, 0, 0);

  console.log('\n--- After centering at origin ---');
  console.log(`  BBox min: (${finalMin.x.toFixed(6)}, ${finalMin.y.toFixed(6)}, ${finalMin.z.toFixed(6)})`);
  console.log(`  BBox max: (${finalMax.x.toFixed(6)}, ${finalMax.y.toFixed(6)}, ${finalMax.z.toFixed(6)})`);
  console.log(`  Size:     (${finalSize.x.toFixed(6)}, ${finalSize.y.toFixed(6)}, ${finalSize.z.toFixed(6)})`);
  console.log(`  Center:   (${finalCenter.x.toFixed(6)}, ${finalCenter.y.toFixed(6)}, ${finalCenter.z.toFixed(6)})`);

  // Determine smallest axis (= depth)
  const axes = [
    { name: 'X', value: finalSize.x },
    { name: 'Y', value: finalSize.y },
    { name: 'Z', value: finalSize.z },
  ];
  axes.sort((a, b) => a.value - b.value);
  const smallest = axes[0];

  console.log(`\n  Axis sizes: X=${finalSize.x.toFixed(6)}, Y=${finalSize.y.toFixed(6)}, Z=${finalSize.z.toFixed(6)}`);
  console.log(`  SMALLEST axis (depth): ${smallest.name} = ${smallest.value.toFixed(6)}`);

  // Front/back Z surface positions
  console.log(`\n  Front surface Z (max.z): ${finalMax.z.toFixed(6)}`);
  console.log(`  Back surface Z  (min.z): ${finalMin.z.toFixed(6)}`);

  console.log('');
}

async function main() {
  const models = [
    { name: 'tshirt_with_etecet.glb', path: '/home/pr1me/ClaudeCode/copycreativ/public/models/tshirt_with_etecet.glb' },
    { name: 'hoodie.glb', path: '/home/pr1me/ClaudeCode/copycreativ/public/models/hoodie.glb' },
  ];

  for (const model of models) {
    try {
      const gltf = await loadGLB(model.path);
      analyzeModel(model.name, gltf);
    } catch (err) {
      console.error(`Error loading ${model.name}:`, err);
    }
  }
}

main();
