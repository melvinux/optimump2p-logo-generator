/* ================================
   Canvas & Context
================================ */
const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");
const stickerContainer = document.getElementById("sticker-container");

/* ================================
   State
================================ */
let baseImage = null;
const stickers = [];
let activeSticker = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

/* ================================
   Sticker sources (transparent PNGs)
================================ */
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

/* ================================
   Load sticker picker
================================ */
stickerSources.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.alt = "Sticker";
  img.addEventListener("click", () => addSticker(src));
  stickerContainer.appendChild(img);
});

/* ================================
   Upload base image
================================ */
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;

    // 🔑 Canvas = image size (no scaling, no blur)
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    redraw();
  };
  img.src = URL.createObjectURL(file);
});

/* ================================
   Add sticker
================================ */
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

/* ================================
   Redraw canvas
================================ */
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

/* ================================
   Mouse position helper
================================ */
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

/* ================================
   Drag logic (NO SHIFT)
================================ */
canvas.addEventListener("mousedown", e => {
  const { x, y } = getMousePos(e);

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];
    if (
      x > s.x - s.size / 2 &&
      x < s.x + s.size / 2 &&
      y > s.y - s.size / 2 &&
      y < s.y + s.size / 2
    ) {
      activeSticker = s;
      dragOffsetX = x - s.x;
      dragOffsetY = y - s.y;
      break;
    }
  }
});

canvas.addEventListener("mousemove", e => {
  if (!activeSticker) return;

  const { x, y } = getMousePos(e);
  activeSticker.x = x - dragOffsetX;
  activeSticker.y = y - dragOffsetY;

  redraw();
});

canvas.addEventListener("mouseup", () => {
  activeSticker = null;
});

canvas.addEventListener("mouseleave", () => {
  activeSticker = null;
});

/* ================================
   Download (EXACT PIXELS)
================================ */
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
