const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");

let baseImage = null;
const stickers = [];

let activeSticker = null;
let isResizing = false;
let offsetX = 0;
let offsetY = 0;

const HANDLE_SIZE = 12;

// Transparent PNGs ONLY
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Create buttons
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

// Redraw canvas
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

    // Resize handle (bottom-right)
    ctx.fillStyle = "#0a66c2";
    ctx.fillRect(
      s.x + s.size / 2 - HANDLE_SIZE,
      s.y + s.size / 2 - HANDLE_SIZE,
      HANDLE_SIZE,
      HANDLE_SIZE
    );
  });
}

// Mouse helpers
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

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];

    const inSticker =
      x > s.x - s.size / 2 &&
      x < s.x + s.size / 2 &&
      y > s.y - s.size / 2 &&
      y < s.y + s.size / 2;

    const inHandle =
      x > s.x + s.size / 2 - HANDLE_SIZE &&
      y > s.y + s.size / 2 - HANDLE_SIZE;

    if (inHandle) {
      activeSticker = s;
      isResizing = true;
      return;
    }

    if (inSticker) {
      activeSticker = s;
      offsetX = x - s.x;
      offsetY = y - s.y;
      return;
    }
  }
});

// Mouse move
canvas.addEventListener("mousemove", e => {
  if (!activeSticker) return;

  const { x, y } = getMousePos(e);

  if (isResizing) {
    activeSticker.size = Math.max(40, x - activeSticker.x + activeSticker.size / 2);
  } else {
    activeSticker.x = x - offsetX;
    activeSticker.y = y - offsetY;
  }

  redraw();
});

// Mouse up
canvas.addEventListener("mouseup", () => {
  activeSticker = null;
  isResizing = false;
});

// Download (exact output)
downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

