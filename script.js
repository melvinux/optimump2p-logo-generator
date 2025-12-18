const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");
const controls = document.querySelector(".controls");

let baseImage = null;
let stickers = [];
let activeSticker = null;
let mode = null; // "drag" or "resize"

// 👉 YOUR TRANSPARENT PNG STICKERS
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Create sticker buttons
stickerSources.forEach((src, i) => {
  const btn = document.createElement("button");
  btn.textContent = `Add Sticker ${i + 1}`;
  btn.onclick = () => addSticker(src);
  controls.prepend(btn);
});

// Upload base image
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;

    // 🔒 CRITICAL: canvas = image resolution (no blur, no shift)
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    redraw();
  };
  img.src = URL.createObjectURL(file);
});

// Add sticker
function addSticker(src) {
  const img = new Image();
  img.onload = () => {
    stickers.push({
      img,
      x: canvas.width / 2,
      y: canvas.height / 2,
      size: canvas.width * 0.25
    });
    redraw();
  };
  img.src = src;
}

// Redraw everything
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (baseImage) {
    ctx.drawImage(baseImage, 0, 0);
  }

  stickers.forEach(s => {
    ctx.drawImage(
      s.img,
      s.x - s.size / 2,
      s.y - s.size / 2,
      s.size,
      s.size
    );
  });
}

// Mouse helpers (NO SHIFT EVER)
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (canvas.width / rect.width),
    y: (e.clientY - rect.top) * (canvas.height / rect.height)
  };
}

// Mouse down
canvas.addEventListener("mousedown", e => {
  const { x, y } = getMousePos(e);

  activeSticker = null;
  mode = null;

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];

    const half = s.size / 2;
    const resizeZone = 12;

    // Resize corner (bottom-right)
    if (
      x > s.x + half - resizeZone &&
      x < s.x + half &&
      y > s.y + half - resizeZone &&
      y < s.y + half
    ) {
      activeSticker = s;
      mode = "resize";
      return;
    }

    // Drag zone
    if (
      x > s.x - half &&
      x < s.x + half &&
      y > s.y - half &&
      y < s.y + half
    ) {
      activeSticker = s;
      mode = "drag";
      return;
    }
  }
});

// Mouse move
canvas.addEventListener("mousemove", e => {
  if (!activeSticker) return;

  const { x, y } = getMousePos(e);

  if (mode === "drag") {
    activeSticker.x = x;
    activeSticker.y = y;
  }

  if (mode === "resize") {
    const dx = x - activeSticker.x;
    const dy = y - activeSticker.y;
    activeSticker.size = Math.max(40, Math.max(dx, dy) * 2);
  }

  redraw();
});

// Mouse up
canvas.addEventListener("mouseup", () => {
  activeSticker = null;
  mode = null;
});

// Download (EXACT EXPORT)
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
