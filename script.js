const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");
const stickerPicker = document.getElementById("stickerPicker");

let baseImage = null;
const stickers = [];
let activeSticker = null;
let mode = null; // "drag" | "resize"

// 🔹 STICKERS (transparent PNGs)
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

    // 🔑 LOCK canvas to image resolution (no blur)
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
      size: canvas.width * 0.2
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

    // Resize handle
    ctx.fillStyle = "#0a66c2";
    ctx.fillRect(
      s.x + s.size / 2 - 12,
      s.y + s.size / 2 - 12,
      12,
      12
    );
  });
}

// ---------- Mouse Position ----------
function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY
  };
}

// ---------- Pointer Down ----------
canvas.addEventListener("mousedown", e => {
  const pos = getPos(e);
  activeSticker = null;
  mode = null;

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];

    // Resize corner
    if (
      pos.x > s.x + s.size / 2 - 20 &&
      pos.y > s.y + s.size / 2 - 20
    ) {
      activeSticker = s;
      mode = "resize";
      return;
    }

    // Drag body
    if (
      pos.x > s.x - s.size / 2 &&
      pos.x < s.x + s.size / 2 &&
      pos.y > s.y - s.size / 2 &&
      pos.y < s.y + s.size / 2
    ) {
      activeSticker = s;
      mode = "drag";
      return;
    }
  }
});

// ---------- Pointer Move ----------
canvas.addEventListener("mousemove", e => {
  if (!activeSticker) return;

  const pos = getPos(e);

  if (mode === "drag") {
    activeSticker.x = pos.x;
    activeSticker.y = pos.y;
  }

  if (mode === "resize") {
    const dx = pos.x - activeSticker.x;
    activeSticker.size = Math.max(40, dx * 2);
  }

  redraw();
});

// ---------- Pointer Up ----------
canvas.addEventListener("mouseup", () => {
  activeSticker = null;
  mode = null;
});

// ---------- Download ----------
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
