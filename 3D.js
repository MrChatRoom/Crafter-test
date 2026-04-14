import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";

import { createWorld, world, SIZE } from "./world.js";
import { setupPlayer, updatePlayer, camera } from "./player.js";
import { addBlock, removeBlock, changeSlot, updateHUD } from "./inventory.js";

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT (IMPORTANT FIX)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(10, 20, 10);
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// TEXTURES (FIX GRASS OVERLAY HERE)
function makeGrassTexture(base, overlay) {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;

  const ctx = canvas.getContext("2d");

  ctx.drawImage(base.image, 0, 0);

  // overlay on top
  ctx.drawImage(overlay.image, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

const loader = new THREE.TextureLoader();

const dirt = loader.load("textures/dirt.png");

const grassSideBase = loader.load("textures/grass_side.png");
const grassSideOverlay = loader.load("textures/grass_side_overlay.png");

const grassTopBase = loader.load("textures/grass_top.png");
const grassTopOverlay = loader.load("textures/grass_top_overlay.png");

const textures = {
  dirt,
  grassTop: grassTopBase, // simplified stable version
  grassSide: makeGrassTexture(grassSideBase, grassSideOverlay)
};

// world
createWorld(scene, textures);

// player
setupPlayer();

// raycast
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0,0);

window.addEventListener("contextmenu", e => e.preventDefault());

window.addEventListener("mousedown", (e) => {
  raycaster.setFromCamera(center, camera);
  const hits = raycaster.intersectObjects(Object.values(world));

  if (!hits.length) return;

  const hit = hits[0].object;

  // BREAK
  if (e.button === 0) {
    scene.remove(hit);
    delete world[`${hit.position.x},${hit.position.y},${hit.position.z}`];

    addBlock("dirt"); // 🔥 FIX: give item back
    updateHUD();
  }

  // PLACE
  if (e.button === 2) {
    const normal = hits[0].face.normal;
    const pos = hit.position.clone().add(normal);

    const geo = new THREE.BoxGeometry(1,1,1);
    const mat = new THREE.MeshStandardMaterial({ map: dirt });

    const cube = new THREE.Mesh(geo, mat);
    cube.position.copy(pos);

    scene.add(cube);
    world[`${pos.x},${pos.y},${pos.z}`] = cube;

    removeBlock();
    updateHUD();
  }
});

// slots
window.addEventListener("keydown", e => {
  if (e.key >= "1" && e.key <= "5") {
    changeSlot(Number(e.key) - 1);
    updateHUD();
  }
});

// loop
function animate() {
  requestAnimationFrame(animate);

  updatePlayer(SIZE);

  renderer.render(scene, camera);
}

updateHUD();
animate();
