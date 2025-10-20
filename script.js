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

// === Add sticker buttons ===
stickers.forEach((src, i) => {
  const btn = document.createElement("button");
  btn.textContent = `Sticker ${i + 1}`;
  btn.addEventListener("click", () => addSticker(src));
  stickerContainer.appendChild(btn);
});

// === Upload PFP ===
upload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => (preview.src = ev.target.result);
  reader.readAsDataURL(file);
});

// === Add Sticker ===
function addSticker(src) {
  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.classList.add("sticker");
  sticker.style.position = "absolute";
  sticker.style.top = "50%";
  sticker.style.left = "50%";
  sticker.style.width = "80px";
  sticker.style.cursor = "move";
  sticker.style.transform = "translate(-50%, -50%)";
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

// === Download ===
downloadBtn.addEventListener("click", async () => {
  if (!preview.src) return alert("Please upload an image first.");

  const img = new Image();
  img.src = preview.src;
  await img.decode();

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // Match original image size
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;

  // Draw main PFP
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  // Scale factor (display vs. actual image)
  const scale = canvas.width / preview.clientWidth;

  // Draw stickers at correct scaled position
  document.querySelectorAll(".sticker").forEach((sticker) => {
    const rect = sticker.getBoundingClientRect();
    const parentRect = editor.getBoundingClientRect();
    const x = (rect.left - parentRect.left) * scale;
    const y = (rect.top - parentRect.top) * scale;
    const width = rect.width * scale;
    const height = rect.height * scale;
    ctx.drawImage(sticker, x, y, width, height);
  });

  const link = document.createElement("a");
  link.download = "Optimump2p_PFP.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

