const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");

let baseImage = null;
const stickers = [];
let activeSticker = null;

// transparent PNGs ONLY
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Create sticker buttons
stickerSources.forEach(src => {
  const btn = document.createElement("button");
  btn.textContent = "Add Sticker";
  btn.onclick = () => addSticker(src);
  document.querySelector(".controls").prepend(btn);
});

// Upload base image
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;

    // 🔑 MATCH CANVAS TO IMAGE — NO QUALITY LOSS
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

// Drag logic (NO SHIFT POSSIBLE)
canvas.addEventListener("mousedown", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
  const my = (e.clientY - rect.top) * (canvas.height / rect.height);

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
  activeSticker.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  activeSticker.y = (e.clientY - rect.top) * (canvas.height / rect.height);

  redraw();
});

canvas.addEventListener("mouseup", () => {
  activeSticker = null;
});

// Download — EXACTLY WHAT YOU SEE
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};





