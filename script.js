const upload = document.getElementById("pfpUpload");
const preview = document.getElementById("preview");
const stickerContainer = document.getElementById("sticker-container");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");

// List of stickers
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

// Add draggable/resizable sticker
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
          let { width, height } = event.rect;
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
        }
      }
    });
}

// Download final PFP (fixed alignment + high quality)
downloadBtn.addEventListener("click", async () => {
  const rect = editor.getBoundingClientRect();
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Double resolution for clarity
  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  // Draw base image
  const baseImage = new Image();
  baseImage.src = preview.src;
  await baseImage.decode();
  ctx.drawImage(baseImage, 0, 0, rect.width, rect.height);

  // Draw each sticker exactly by offset within editor
  const stickerEls = editor.querySelectorAll(".draggable");
  for (const sticker of stickerEls) {
    const stickerRect = sticker.getBoundingClientRect();
    const editorRect = editor.getBoundingClientRect();

    const relativeX = stickerRect.left - editorRect.left;
    const relativeY = stickerRect.top - editorRect.top;
    const width = stickerRect.width;
    const height = stickerRect.height;

    const img = new Image();
    img.src = sticker.src;
    await img.decode();
    ctx.drawImage(img, relativeX, relativeY, width, height);
  }

  // Export as PNG
  const link = document.createElement("a");
  link.download = "optimump2p-pfp.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});




