const canvas = document.getElementById("pfpCanvas");
const ctx = canvas.getContext("2d");

const upload = document.getElementById("pfpUpload");
const downloadBtn = document.getElementById("download");
const stickerPicker = document.getElementById("stickerPicker");

let baseImage = null;
const stickers = [];
let activeSticker = null;
let mode = null; // "drag" or "resize"

// 🔒 Transparent PNGs only
const stickerSources = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];


// ---------- Sticker Picker (Images, not buttons) ----------
stickerSources.forEach(src => {
  const img = new Image();
  img.src = src;
  img.onclick = () => addSticker(src);
  stickerPicker.appendChild(img);
});


// ---------- Upload Base Image ----------
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    baseImage = img;

    // 🔑 Canvas matches image EXACTLY (no blur, no shift)
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


// ---------- Redraw ----------
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

    // resize handle
    ctx.fillStyle = "#0a66c2";
    ctx.fillRect(
      s.x + s.size / 2 - 10,
      s.y + s.size / 2 - 10,
      10,
      10
    );
  });
}


// ---------- Mouse / Touch Helpers ----------
function getPointerPos(e) {
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
  const pos = getPointerPos(e);

  activeSticker = null;
  mode = null;

  for (let i = stickers.length - 1; i >= 0; i--) {
    const s = stickers[i];

    // resize handle
    if (
      pos.x > s.x + s.size / 2 - 12 &&
      pos.x < s.x + s.size / 2 &&
      pos.y > s.y + s.size / 2 - 12 &&
      pos.y < s.y + s.size / 2
    ) {
      activeSticker = s;
      mode = "resize";
      return;
    }

    // drag body
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
}


// ---------- Pointer Move ----------
function pointerMove(e) {
  if (!activeSticker) return;

  const pos = getPointerPos(e);

  if (mode === "drag") {
    activeSticker.x = pos.x;
    activeSticker.y = pos.y;
  }

  if (mode === "resize") {
    activeSticker.size = Math.max(
      40,
      Math.abs(pos.x - activeSticker.x) * 2
    );
  }

  redraw();
}


// ---------- Pointer Up ----------
function pointerUp() {
  activeSticker = null;
  mode = null;
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
