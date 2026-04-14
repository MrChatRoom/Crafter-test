export const inventory = [
  { type: "dirt", count: 15 },
  { type: "dirt", count: 15 },
  { type: "dirt", count: 10 },
  null,
  null
];

export let selectedSlot = 0;

export function changeSlot(num) {
  selectedSlot = num;
  updateHUD();
}

export function addBlock(type) {
  for (let slot of inventory) {
    if (slot && slot.type === type && slot.count < 15) {
      slot.count++;
      return;
    }
  }
}

export function removeBlock() {
  let slot = inventory[selectedSlot];
  if (slot && slot.count > 0) {
    slot.count--;
    if (slot.count === 0) inventory[selectedSlot] = null;
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
      div.appendChild(img);

      const count = document.createElement("div");
      count.className = "count";
      count.innerText = slot.count;
      div.appendChild(count);
    }

    hud.appendChild(div);
  });
}