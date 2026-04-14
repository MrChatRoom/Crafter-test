import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";
import { createWorld, world } from "./world.js";
import { setupPlayer, updatePlayer, camera } from "./player.js";
import { removeBlock, changeSlot, updateHUD } from "./inventory.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT (important or everything looks black)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// texture
const texture = new THREE.TextureLoader().load("textures/dirt.png");
texture.magFilter = THREE.NearestFilter;

// world
createWorld(scene, texture);

// player
setupPlayer(scene);

// raycaster
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

// prevent right click menu
window.addEventListener("contextmenu", e => e.preventDefault());

// CLICK SYSTEM
window.addEventListener("mousedown", (e) => {
  raycaster.setFromCamera(center, camera);
  const hits = raycaster.intersectObjects(Object.values(world));

  if (!hits.length) return;

  const hit = hits[0].object;

  // LEFT CLICK = BREAK
  if (e.button === 0) {
    scene.remove(hit);
    delete world[`${hit.position.x},${hit.position.y},${hit.position.z}`];
  }

  // RIGHT CLICK = PLACE
  if (e.button === 2) {
    const normal = hits[0].face.normal;
    const pos = hit.position.clone().add(normal);

    const geo = new THREE.BoxGeometry(1,1,1);
    const mat = new THREE.MeshStandardMaterial({ map: texture });
    const cube = new THREE.Mesh(geo, mat);

    cube.position.copy(pos);
    scene.add(cube);

    world[`${pos.x},${pos.y},${pos.z}`] = cube;

    removeBlock();
    updateHUD();
  }
});

// SLOT SWITCHING
window.addEventListener("keydown", (e) => {
  if (e.key >= "1" && e.key <= "5") {
    changeSlot(Number(e.key) - 1);
  }
});

function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  renderer.render(scene, camera);
}

updateHUD();
animate();
