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

          target.style.transform = `translate(${x}px, ${y}px) rotate(${target.dataset.rotation || 0}deg) scale(${target.dataset.scale || 1})`;
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

// Download final PFP (high-res and aligned)
downloadBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const rect = editor.getBoundingClientRect();

  canvas.width = rect.width * 2;
  canvas.height = rect.height * 2;
  ctx.scale(2, 2);

  const baseImage = new Image();
  baseImage.src = preview.src;
  baseImage.onload = () => {
    ctx.drawImage(baseImage, 0, 0, rect.width, rect.height);

    const stickers = editor.querySelectorAll(".draggable");
    stickers.forEach(sticker => {
      const x = (parseFloat(sticker.getAttribute("data-x")) || 0);
      const y = (parseFloat(sticker.getAttribute("data-y")) || 0);
      const rotation = parseFloat(sticker.dataset.rotation) || 0;
      const scale = parseFloat(sticker.dataset.scale) || 1;

      const img = new Image();
      img.src = sticker.src;

      img.onload = () => {
        const stickerRect = sticker.getBoundingClientRect();
        const relativeX = stickerRect.left - rect.left;
        const relativeY = stickerRect.top - rect.top;

        ctx.save();
        ctx.translate(relativeX + stickerRect.width / 2, relativeY + stickerRect.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -stickerRect.width / 2, -stickerRect.height / 2, stickerRect.width, stickerRect.height);
        ctx.restore();
      };
    });

    setTimeout(() => {
      const link = document.createElement("a");
      link.download = "optimump2p-pfp.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }, 1000);
  };
});



