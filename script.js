const upload = document.getElementById("pfpUpload");
const preview = document.getElementById("preview");
const editor = document.getElementById("editor");
const stickerContainer = document.getElementById("sticker-container");
const downloadBtn = document.getElementById("download");

const stickers = [
  "assets/optimum-sticker1.png",
  "assets/optimum-sticker2.png",
  "assets/optimum-sticker3.png"
];

// === Load sticker options ===
stickers.forEach((src, i) => {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "80px";
  img.style.cursor = "pointer";
  img.style.borderRadius = "8px";
  img.addEventListener("click", () => addSticker(src));
  stickerContainer.appendChild(img);
});

// === Upload PFP ===
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => (preview.src = ev.target.result);
  reader.readAsDataURL(file);
});

// === Add draggable + resizable sticker ===
function addSticker(src) {
  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.classList.add("sticker");
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
        },
      },
    })
    .resizable({
      edges: { left: true, right: true, bottom: true, top: true },
      listeners: {
        move(event) {
          let { x, y } = event.target.dataset;
          x = (parseFloat(x) || 0) + event.deltaRect.left;
          y = (parseFloat(y) || 0) + event.deltaRect.top;

          Object.assign(event.target.style, {
            width: `${event.rect.width}px`,
            height: `${event.rect.height}px`,
            transform: `translate(${x}px, ${y}px)`,
          });

          Object.assign(event.target.dataset, { x, y });
        },
      },
    });
}

// === High-quality Download (no shift) ===
downloadBtn.addEventListener("click", async () => {
  if (!preview.src) return alert("Please upload an image first.");

  const img = new Image();
  img.src = preview.src;
  await img.decode();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Use image's displayed bounding box for scaling reference
  const previewRect = preview.getBoundingClientRect();
  const scaleX = canvas.width / previewRect.width;
  const scaleY = canvas.height / previewRect.height;

  // Draw stickers accurately
  document.querySelectorAll(".sticker").forEach((sticker) => {
    const sRect = sticker.getBoundingClientRect();
    const eRect = editor.getBoundingClientRect();

    const x = (sRect.left - previewRect.left) * scaleX;
    const y = (sRect.top - previewRect.top) * scaleY;
    const width = sRect.width * scaleX;
    const height = sRect.height * scaleY;

    ctx.drawImage(sticker, x, y, width, height);
  });

  const link = document.createElement("a");
  link.download = "Optimump2p_PFP.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});


