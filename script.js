const upload = document.getElementById("pfpUpload");
const preview = document.getElementById("preview");
const stickerContainer = document.getElementById("sticker-container");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");

// Sticker paths
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

// Handle PFP upload
upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      preview.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Add a draggable, resizable sticker
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

// Download with exact alignment and full quality
downloadBtn.addEventListener("click", async () => {
  if (!preview.src) return;

  const baseImage = new Image();
  baseImage.src = preview.src;
  await baseImage.decode();

  const canvas = document.createElement("canvas");
  canvas.width = baseImage.naturalWidth;
  canvas.height = baseImage.naturalHeight;
  const ctx = canvas.getContext("2d");

  // Draw the base PFP
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);

  // Use actual scaling ratio between preview and real image
  const previewRect = preview.getBoundingClientRect();
  const scaleX = canvas.width / previewRect.width;
  const scaleY = canvas.height / previewRect.height;

  // Draw each sticker correctly mapped
  const stickersOnCanvas = editor.querySelectorAll(".draggable");
  for (const sticker of stickersOnCanvas) {
    const sRect = sticker.getBoundingClientRect();

    const relX = (sRect.left - previewRect.left) * scaleX;
    const relY = (sRect.top - previewRect.top) * scaleY;
    const relW = sRect.width * scaleX;
    const relH = sRect.height * scaleY;

    const img = new Image();
    img.src = sticker.src;
    await img.decode();

    ctx.drawImage(img, relX, relY, relW, relH);
  }

  // Export the result
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png", 1.0); // full quality
  link.click();
});






