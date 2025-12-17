const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");

// Base image
let baseImage = null;

// Stickers state
const stickers = [];
let activeSticker = null;

// Sticker images
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Load sticker buttons
stickerSources.forEach(src => {
  const btn = document.createElement("button");
  btn.textContent = "Add Sticker";
  btn.onclick = () => addSticker(src);
  document.querySelector(".controls").prepend(btn);
});

// Upload PFP
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;
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
      size: 100
    });
    redraw();
  };
  img.src = src;
}

// Redraw everything
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (baseImage) {
    ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  }

  stickers.forEach(sticker => {
    ctx.drawImage(
      sticker.img,
      sticker.x - sticker.size / 2,
      sticker.y - sticker.size / 2,
      sticker.size,
      sticker.size
    );
  });
}

// Drag logic
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  activeSticker = stickers.find(sticker =>
    mx > sticker.x - sticker.size / 2 &&
    mx < sticker.x + sticker.size / 2 &&
    my > sticker.y - sticker.size / 2 &&
    my < sticker.y + sticker.size / 2
  );
});

canvas.addEventListener("mousemove", e => {
  if (!activeSticker) return;

  const rect = canvas.getBoundingClientRect();
  activeSticker.x = e.clientX - rect.left;
  activeSticker.y = e.clientY - rect.top;
  redraw();
});

canvas.addEventListener("mouseup", () => {
  activeSticker = null;
});

// Download (NO SHIFT, FULL QUALITY)
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};






