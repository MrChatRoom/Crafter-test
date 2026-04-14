import * as THREE from "three";

export const world = {};
export const size = 10;

export function createWorld(scene, texture) {
  const geo = new THREE.BoxGeometry(1,1,1);

  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      const mat = new THREE.MeshBasicMaterial({ map: texture });
      const cube = new THREE.Mesh(geo, mat);

      cube.position.set(x, 0, z);
      scene.add(cube);

      world[`${x},0,${z}`] = cube;
    }
  }
}