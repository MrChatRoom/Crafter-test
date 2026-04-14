import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";

export let camera;

const keys = {};

export function setupPlayer() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.set(5, 2, 5);

  document.body.addEventListener("click", () => {
    document.body.requestPointerLock();
  });

  document.addEventListener("mousemove", (e) => {
    if (document.pointerLockElement) {
      camera.rotation.y -= e.movementX * 0.002;
      camera.rotation.x -= e.movementY * 0.002;
    }
  });

  document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
  document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);
}

export function updatePlayer() {
  const speed = 0.08;

  if (keys["w"]) camera.translateZ(-speed);
  if (keys["s"]) camera.translateZ(speed);
  if (keys["a"]) camera.translateX(-speed);
  if (keys["d"]) camera.translateX(speed);
}
