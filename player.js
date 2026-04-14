import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";

export let camera;

const keys = {};
let velocityY = 0;
let canJump = false;

export function setupPlayer() {
  camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000);
  camera.position.set(4, 10, 4);

  document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

  document.addEventListener("mousemove", e => {
    if (!document.pointerLockElement) return;

    camera.rotation.y -= e.movementX * 0.002;

    camera.rotation.x -= e.movementY * 0.002;

    // ❌ FIX: no flipping
    camera.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, camera.rotation.x));
  });

  document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);
}

export function updatePlayer(worldSize) {
  const speed = 0.08;

  // direction from camera
  const dir = new THREE.Vector3();

  if (keys["w"]) dir.z -= 1;
  if (keys["s"]) dir.z += 1;
  if (keys["a"]) dir.x -= 1;
  if (keys["d"]) dir.x += 1;

  dir.applyAxisAngle(new THREE.Vector3(0,1,0), camera.rotation.y);
  dir.normalize();

  camera.position.addScaledVector(dir, speed);

  // GRAVITY
  velocityY -= 0.01;
  camera.position.y += velocityY;

  // GROUND COLLISION (simple)
  if (camera.position.y < worldSize + 2) {
    velocityY = 0;
    camera.position.y = worldSize + 2;
    canJump = true;
  }

  // JUMP
  if (keys[" "] && canJump) {
    velocityY = 0.2;
    canJump = false;
  }
}
