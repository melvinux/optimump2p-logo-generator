const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");
const stickerContainer = document.getElementById("sticker-container");

let baseImage = null;
const stickers = [];
let activeSticker = null;

// Transparent PNG stickers only
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Create sticker thumbnails
stickerSources.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.onclick = () => addSticker(src);
  stickerContainer.appendChild(img);
});

// Upload PFP
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;

    // 🔒 CRITICAL: canvas size matches image exactly
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
      size: canvas.width * 0.2
    });
    redraw();
  };
  img.src = src;
}

// Draw everything
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

// Mouse interaction (NO SHIFT)
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const mx = (e.clientX - rect.left) * scaleX;
  const my = (e.clientY - rect.top) * scaleY;

  activeSticker = stickers.find(s =>
    mx > s.x - s.size / 2 &&
    mx < s.x + s.size / 2 &&
    my > s.y - s.size / 2 &&
    my < s.y + s.size / 2
  );
});

canvas.addEventListener("mousemove", e => {
  if (!activeSticker) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  activeSticker.x = (e.clientX - rect.left) * scaleX;
  activeSticker.y = (e.clientY - rect.top) * scaleY;

  redraw();
});

canvas.addEventListener("mouseup", () => {
  activeSticker = null;
});

// Download — EXACT output
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};
