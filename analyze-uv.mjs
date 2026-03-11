import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'fs';
import path from 'path';

// Polyfill minimal browser APIs for three.js in Node
if (typeof document === 'undefined') {
  globalThis.document = {
    createElementNS: () => ({
      getContext: () => null,
      style: {},
    }),
    createElement: () => ({
      getContext: () => null,
      style: {},
    }),
  };
}
if (typeof self === 'undefined') {
  globalThis.self = globalThis;
}

const MODELS_DIR = '/home/pr1me/ClaudeCode/copycreativ/public/models';

const models = [
  { name: 'hoodie', file: 'hoodie.glb' },
  { name: 'tshirt_with_etecet', file: 'tshirt_with_etecet.glb' },
];

function directionLabel(nx, ny, nz) {
  const ax = Math.abs(nx), ay = Math.abs(ny), az = Math.abs(nz);
  if (az >= ax && az >= ay) {
    return nz >= 0 ? 'FRONT (+Z)' : 'BACK (-Z)';
  } else if (ax >= ay && ax >= az) {
    return nx >= 0 ? 'RIGHT SIDE (+X)' : 'LEFT SIDE (-X)';
  } else {
    return ny >= 0 ? 'TOP (+Y)' : 'BOTTOM (-Y)';
  }
}

function analyzeMesh(mesh) {
  const geo = mesh.geometry;
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const normal = geo.attributes.normal;
  const index = geo.index;

  if (!pos || !uv) {
    return { name: mesh.name, error: 'Missing position or UV attributes' };
  }

  const matName = Array.isArray(mesh.material)
    ? mesh.material.map(m => m.name).join(', ')
    : mesh.material?.name || '(unnamed)';

  // Overall UV bounding box
  let uvMinU = Infinity, uvMaxU = -Infinity;
  let uvMinV = Infinity, uvMaxV = -Infinity;
  for (let i = 0; i < uv.count; i++) {
    const u = uv.getX(i), v = uv.getY(i);
    if (u < uvMinU) uvMinU = u;
    if (u > uvMaxU) uvMaxU = u;
    if (v < uvMinV) uvMinV = v;
    if (v > uvMaxV) uvMaxV = v;
  }

  // Analyze faces by normal direction
  const groups = {};
  const faceCount = index ? index.count / 3 : pos.count / 3;

  const vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
  const edge1 = new THREE.Vector3(), edge2 = new THREE.Vector3();
  const faceNormal = new THREE.Vector3();

  // If the mesh has a world matrix, we need normal matrix
  const normalMatrix = new THREE.Matrix3().getNormalMatrix(mesh.matrixWorld);

  for (let f = 0; f < faceCount; f++) {
    let a, b, c;
    if (index) {
      a = index.getX(f * 3);
      b = index.getX(f * 3 + 1);
      c = index.getX(f * 3 + 2);
    } else {
      a = f * 3;
      b = f * 3 + 1;
      c = f * 3 + 2;
    }

    // Compute face normal from vertex positions (world space)
    vA.fromBufferAttribute(pos, a);
    vB.fromBufferAttribute(pos, b);
    vC.fromBufferAttribute(pos, c);

    // Apply world transform
    vA.applyMatrix4(mesh.matrixWorld);
    vB.applyMatrix4(mesh.matrixWorld);
    vC.applyMatrix4(mesh.matrixWorld);

    edge1.subVectors(vB, vA);
    edge2.subVectors(vC, vA);
    faceNormal.crossVectors(edge1, edge2).normalize();

    const label = directionLabel(faceNormal.x, faceNormal.y, faceNormal.z);

    if (!groups[label]) {
      groups[label] = {
        faceCount: 0,
        uvMinU: Infinity, uvMaxU: -Infinity,
        uvMinV: Infinity, uvMaxV: -Infinity,
        totalArea: 0,
      };
    }
    const g = groups[label];
    g.faceCount++;

    // UV range for this face's vertices
    for (const vi of [a, b, c]) {
      const u = uv.getX(vi), v = uv.getY(vi);
      if (u < g.uvMinU) g.uvMinU = u;
      if (u > g.uvMaxU) g.uvMaxU = u;
      if (v < g.uvMinV) g.uvMinV = v;
      if (v > g.uvMaxV) g.uvMaxV = v;
    }

    // UV area of the triangle (for weighting)
    const uA = uv.getX(a), vA2 = uv.getY(a);
    const uB = uv.getX(b), vB2 = uv.getY(b);
    const uC = uv.getX(c), vC2 = uv.getY(c);
    g.totalArea += Math.abs((uB - uA) * (vC2 - vA2) - (uC - uA) * (vB2 - vA2)) / 2;
  }

  return {
    name: mesh.name || '(unnamed)',
    material: matName,
    vertexCount: pos.count,
    faceCount,
    uvBounds: { minU: uvMinU, maxU: uvMaxU, minV: uvMinV, maxV: uvMaxV },
    directionGroups: groups,
  };
}

async function loadAndAnalyze(filePath, modelName) {
  const data = fs.readFileSync(filePath);
  const arrayBuffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);

  const loader = new GLTFLoader();

  return new Promise((resolve, reject) => {
    loader.parse(arrayBuffer, '', (gltf) => {
      const results = [];

      // Update world matrices
      gltf.scene.updateMatrixWorld(true);

      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          results.push(analyzeMesh(child));
        }
      });
      resolve({ modelName, meshes: results });
    }, (err) => reject(err));
  });
}

function fmt(n) {
  return n.toFixed(4);
}

function printResults(result) {
  console.log('\n' + '='.repeat(80));
  console.log(`MODEL: ${result.modelName}`);
  console.log('='.repeat(80));

  for (const mesh of result.meshes) {
    if (mesh.error) {
      console.log(`\n  Mesh: ${mesh.name} -- ERROR: ${mesh.error}`);
      continue;
    }

    console.log(`\n  Mesh: "${mesh.name}"`);
    console.log(`  Material: "${mesh.material}"`);
    console.log(`  Vertices: ${mesh.vertexCount}  |  Faces: ${mesh.faceCount}`);
    console.log(`  Overall UV bounds: U [${fmt(mesh.uvBounds.minU)}, ${fmt(mesh.uvBounds.maxU)}]  V [${fmt(mesh.uvBounds.minV)}, ${fmt(mesh.uvBounds.maxV)}]`);
    console.log('');
    console.log('  Direction Groups (by face normal):');
    console.log('  ' + '-'.repeat(76));
    console.log('  ' + 'Direction'.padEnd(20) + 'Faces'.padEnd(10) + 'UV Area'.padEnd(12) + 'U range'.padEnd(24) + 'V range');
    console.log('  ' + '-'.repeat(76));

    // Sort by face count descending
    const sorted = Object.entries(mesh.directionGroups).sort((a, b) => b[1].faceCount - a[1].faceCount);

    for (const [dir, g] of sorted) {
      const pct = ((g.faceCount / mesh.faceCount) * 100).toFixed(1);
      const uRange = `[${fmt(g.uvMinU)}, ${fmt(g.uvMaxU)}]`;
      const vRange = `[${fmt(g.uvMinV)}, ${fmt(g.uvMaxV)}]`;
      console.log('  ' + dir.padEnd(20) + `${g.faceCount} (${pct}%)`.padEnd(10) + fmt(g.totalArea).padEnd(12) + uRange.padEnd(24) + vRange);
    }
    console.log('  ' + '-'.repeat(76));

    // Summary interpretation
    console.log('\n  UV MAPPING INTERPRETATION:');
    for (const [dir, g] of sorted) {
      if (g.faceCount < mesh.faceCount * 0.02) continue; // skip tiny groups
      const uMid = (g.uvMinU + g.uvMaxU) / 2;
      const vMid = (g.uvMinV + g.uvMaxV) / 2;
      const uSpan = g.uvMaxU - g.uvMinU;
      const vSpan = g.uvMaxV - g.uvMinV;
      console.log(`    ${dir}: UV center ~(${fmt(uMid)}, ${fmt(vMid)}), span ~(${fmt(uSpan)} x ${fmt(vSpan)}), UV area=${fmt(g.totalArea)}`);
    }
  }
}

// Main
(async () => {
  for (const model of models) {
    const filePath = path.join(MODELS_DIR, model.file);
    try {
      const result = await loadAndAnalyze(filePath, model.name);
      printResults(result);
    } catch (err) {
      console.error(`Error loading ${model.name}:`, err);
    }
  }
})();
