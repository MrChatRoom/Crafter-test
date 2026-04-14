import * as THREE from "three";
import { createWorld, world } from "./world.js";
import { setupPlayer, updatePlayer, camera } from "./player.js";
import { inventory, selectedSlot, changeSlot, removeBlock, updateHUD } from "./inventory.js";

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// texture
const texture = new THREE.TextureLoader().load("textures/dirt.png");
texture.magFilter = THREE.NearestFilter;

// world
createWorld(scene, texture);

// player
setupPlayer(scene);

// raycaster
const raycaster = new THREE.Raycaster();

// mouse click
window.addEventListener("mousedown", e => {
  raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
  const intersects = raycaster.intersectObjects(Object.values(world));

  if (intersects.length > 0) {
    const hit = intersects[0].object;

    if (e.button === 0) {
      // break
      scene.remove(hit);
      delete world[`${hit.position.x},${hit.position.y},${hit.position.z}`];
    }

    if (e.button === 2) {
      // place
      const pos = hit.position.clone().add(intersects[0].face.normal);
      const geo = new THREE.BoxGeometry(1,1,1);
      const mat = new THREE.MeshBasicMaterial({ map: texture });
      const cube = new THREE.Mesh(geo, mat);

      cube.position.copy(pos);
      scene.add(cube);

      world[`${pos.x},${pos.y},${pos.z}`] = cube;
      removeBlock();
      updateHUD();
    }
  }
});

// slot switching
window.addEventListener("keydown", e => {
  if (e.key >= "1" && e.key <= "5") {
    changeSlot(parseInt(e.key) - 1);
  }
});

// loop
function animate() {
  requestAnimationFrame(animate);
  updatePlayer();
  renderer.render(scene, camera);
}

updateHUD();
animate();