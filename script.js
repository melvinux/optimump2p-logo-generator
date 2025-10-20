// === PFP Generator Script ===
const uploadInput = document.getElementById("pfpUpload");
const preview = document.getElementById("preview");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");
const stickerContainer = document.getElementById("sticker-container");

const stickers = ["assets/sticker1.png", "assets/sticker2.png"]; // Add your sticker paths

// --- Load sticker options ---
stickers.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "80px";
  img.style.cursor = "pointer";
  img.style.borderRadius = "10px";
  img.addEventListener("click", () => addSticker(src));
  stickerContainer.appendChild(img);
});

uploadInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      preview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// --- Add sticker to editor ---
function addSticker(src) {
  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.className = "sticker";
  sticker.style.position = "absolute";
  sticker.style.top = "50%";
  sticker.style.left = "50%";
  sticker.style.width = "100px";
  sticker.style.transform = "translate(-50%, -50%)";
  sticker.style.cursor = "move";

  editor.appendChild(sticker);

  // Make draggable and resizable
  interact(sticker)
    .draggable({
      listeners: {
        move(event) {
          const target = event.target;
          const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
          target.style.transform = `translate(${x}px, ${y}px)`;
          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }
      }
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
            transform: `translate(${x}px, ${y}px)`
          });

          Object.assign(event.target.dataset, { x, y });
        }
      },
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 30, height: 30 },
          max: { width: 400, height: 400 }
        })
      ]
    });
}

// --- Download combined image ---
downloadBtn.addEventListener("click", () => {
  if (!preview.src) return alert("Upload your PFP first!");

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const img = new Image();
  img.src = preview.src;

  img.onload = () => {
    const width = img.width;
    const height = img.height;

    // Set export canvas size same as original upload (for full quality)
    canvas.width = width;
    canvas.height = height;

    // Draw uploaded image
    ctx.drawImage(img, 0, 0, width, height);

    // Draw stickers at correct scaled positions
    const baseRect = preview.getBoundingClientRect();
    const scaleX = width / baseRect.width;
    const scaleY = height / baseRect.height;

    const stickersOnCanvas = editor.querySelectorAll(".sticker");
    stickersOnCanvas.forEach(st => {
      const rect = st.getBoundingClientRect();
      const relX = (rect.left - baseRect.left) * scaleX;
      const relY = (rect.top - baseRect.top) * scaleY;
      const stWidth = rect.width * scaleX;
      const stHeight = rect.height * scaleY;

      const sImg = new Image();
      sImg.src = st.src;
      ctx.drawImage(sImg, relX, relY, stWidth, stHeight);
    });

    // Download full-quality PNG
    const link = document.createElement("a");
    link.download = "optimump2p-pfp.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };
});
