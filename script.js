const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");
const stickerPicker = document.getElementById("stickerPicker");

let baseImage = null;
const stickers = [];
let activeSticker = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isResizing = false;

// Transparent PNG stickers
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// ---------- Sticker Picker ----------
stickerSources.forEach(src => {
  const img = new Image();
  img.src = src;
  img.onclick = () => addSticker(src);
  stickerPicker.appendChild(img);
});

// ---------- Upload ----------
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;

    // HARD LOCK canvas to image resolution
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    redraw();
  };
  img.src = URL.createObjectURL(file);
});

// ---------- Add Sticker ----------
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

// ---------- Draw ----------
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

    // resize handle (visible + reliable)
    ctx.fillStyle = "#0a66c2";
    ctx.fillRect(
      s.x + s.size / 2 - 14,
      s.y + s.size / 2 - 14,
      14,
      14
    );
  });
}

// ---------- Pointer Position (LOCKED) ----------
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY
  };
}

// ---------- Pointer Down ----------
function pointerDown(e) {
  e.preventDefault();
  const pos = getPos(e);

  activeSticker = null;
  isResizing = false;

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];

    // Resize handle FIRST
    if (
      pos.x >= s.x + s.size / 2 - 14 &&
      pos.x <= s.x + s.size / 2 &&
      pos.y >= s.y + s.size / 2 - 14 &&
      pos.y <= s.y + s.size / 2
    ) {
      activeSticker = s;
      isResizing = true;
      return;
    }

    // Drag body
    if (
      pos.x >= s.x - s.size / 2 &&
      pos.x <= s.x + s.size / 2 &&
      pos.y >= s.y - s.size / 2 &&
      pos.y <= s.y + s.size / 2
    ) {
      activeSticker = s;
      dragOffsetX = pos.x - s.x;
      dragOffsetY = pos.y - s.y;
      return;
    }
  }
}

// ---------- Pointer Move ----------
function pointerMove(e) {
  if (!activeSticker) return;
  e.preventDefault();

  const pos = getPos(e);

  if (isResizing) {
    activeSticker.size = Math.max(
      40,
      Math.abs(pos.x - activeSticker.x) * 2
    );
  } else {
    activeSticker.x = pos.x - dragOffsetX;
    activeSticker.y = pos.y - dragOffsetY;
  }

  redraw();
}

// ---------- Pointer Up ----------
function pointerUp() {
  activeSticker = null;
  isResizing = false;
}

// ---------- Events ----------
canvas.addEventListener("mousedown", pointerDown);
canvas.addEventListener("mousemove", pointerMove);
canvas.addEventListener("mouseup", pointerUp);

canvas.addEventListener("touchstart", pointerDown, { passive: false });
canvas.addEventListener("touchmove", pointerMove, { passive: false });
canvas.addEventListener("touchend", pointerUp);

// ---------- Download ----------
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
