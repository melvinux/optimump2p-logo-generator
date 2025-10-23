const upload = document.getElementById("pfpUpload");
const preview = document.getElementById("preview");
const stickerContainer = document.getElementById("sticker-container");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");

// Stickers list
const stickers = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Load sticker thumbnails
stickers.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "80px";
  img.style.cursor = "pointer";
  img.style.borderRadius = "10px";
  img.addEventListener("click", () => addSticker(src));
  stickerContainer.appendChild(img);
});

// Upload preview
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => (preview.src = e.target.result);
  reader.readAsDataURL(file);
});

// Add draggable, resizable sticker
function addSticker(src) {
  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.classList.add("draggable");
  sticker.style.position = "absolute";
  sticker.style.top = "50%";
  sticker.style.left = "50%";
  sticker.style.width = "100px";
  sticker.style.transform = "translate(-50%, -50%)";
  sticker.style.cursor = "move";
  editor.appendChild(sticker);

  interact(sticker)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute("data-x", x);
          target.setAttribute("data-y", y);
        }
      }
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          const target = event.target;
          target.style.width = event.rect.width + "px";
          target.style.height = event.rect.height + "px";
        }
      }
    });
}

// Download image with perfect alignment and quality
downloadBtn.addEventListener("click", async () => {
  if (!preview.src) return;

  const baseImage = new Image();
  baseImage.src = preview.src;
  await baseImage.decode();

  const naturalWidth = baseImage.naturalWidth;
  const naturalHeight = baseImage.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  const ctx = canvas.getContext("2d");

  const editorRect = editor.getBoundingClientRect();
  const previewRect = preview.getBoundingClientRect();

  // Draw base image
  ctx.drawImage(baseImage, 0, 0, naturalWidth, naturalHeight);

  // Draw stickers using relative positions
  const stickersOnCanvas = editor.querySelectorAll(".draggable");
  for (const sticker of stickersOnCanvas) {
    const sRect = sticker.getBoundingClientRect();

    const relX = (sRect.left - previewRect.left) / previewRect.width;
    const relY = (sRect.top - previewRect.top) / previewRect.height;
    const relW = sRect.width / previewRect.width;
    const relH = sRect.height / previewRect.height;

    const img = new Image();
    img.src = sticker.src;
    await img.decode();

    ctx.drawImage(
      img,
      relX * naturalWidth,
      relY * naturalHeight,
      relW * naturalWidth,
      relH * naturalHeight
    );
  }

  // Download result
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});





