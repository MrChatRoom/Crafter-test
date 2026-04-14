export const inventory = [
  { type: "dirt", count: 0 },
  null,
  null,
  null,
  null
];

export let selectedSlot = 0;

export function changeSlot(i) {
  selectedSlot = i;
}

export function addBlock(type) {
  for (let slot of inventory) {
    if (slot && slot.type === type && slot.count < 15) {
      slot.count++;
      return;
    }
  }

  for (let i = 0; i < inventory.length; i++) {
    if (!inventory[i]) {
      inventory[i] = { type, count: 1 };
      return;
    }
  }
}

export function removeBlock() {
  const slot = inventory[selectedSlot];
  if (slot && slot.count > 0) {
    slot.count--;
    if (slot.count <= 0) inventory[selectedSlot] = null;
  }
}

export function updateHUD() {
  const hud = document.getElementById("hud");
  hud.innerHTML = "";

  inventory.forEach((slot, i) => {
    const div = document.createElement("div");
    div.className = "slot";
    if (i === selectedSlot) div.classList.add("selected");

    if (slot) {
      const img = document.createElement("img");
      img.src = `textures/${slot.type}.png`;

      const count = document.createElement("div");
      count.className = "count";
      count.textContent = slot.count;

      div.appendChild(img);
      div.appendChild(count);
    }

    hud.appendChild(div);
  });
}
