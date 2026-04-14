import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js";

export const world = {};
export const SIZE = 9;

export function createWorld(scene, textures) {
  const geo = new THREE.BoxGeometry(1,1,1);

  for (let x = 0; x < SIZE; x++) {
    for (let z = 0; z < SIZE; z++) {
      for (let y = 0; y < SIZE; y++) {

        let mat;

        // TOP LAYER = GRASS
        if (y === SIZE - 1) {
          mat = new THREE.MeshStandardMaterial({ map: textures.grassTop });
        }

        // SIDE / BELOW = DIRT
        else {
          mat = new THREE.MeshStandardMaterial({ map: textures.dirt });
        }

        const cube = new THREE.Mesh(geo, mat);
        cube.position.set(x, y, z);

        scene.add(cube);
        world[`${x},${y},${z}`] = cube;
      }
    }
  }
}  
