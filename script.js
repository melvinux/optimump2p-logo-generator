const pfpUpload = document.getElementById('pfpUpload');
const preview = document.getElementById('preview');
const editor = document.getElementById('editor');
const stickerContainer = document.getElementById('sticker-container');
const downloadBtn = document.getElementById('download');

// List your sticker paths here
const stickers = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png",
  "assets/stickers/Sticker.png"
];

// Load sticker previews
stickers.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.addEventListener("click", () => addSticker(src));
  stickerContainer.appendChild(img);
});

// Handle PFP upload
pfpUpload.addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

// Add sticker to editor
function addSticker(src) {
  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.classList.add("sticker");
  sticker.style.left = "100px";
  sticker.style.top = "100px";
  editor.appendChild(sticker);

  // Make sticker draggable
  interact(sticker).draggable({
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
  });
}

// Download final image
downloadBtn.addEventListener("click", () => {
  if (!preview.src) {
    alert("Please upload a PFP first!");
    return;
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const rect = preview.getBoundingClientRect();

  canvas.width = rect.width;
  canvas.height = rect.height;

  const baseImg = new Image();
  baseImg.src = preview.src;

  baseImg.onload = () => {
    ctx.drawImage(baseImg, 0, 0, rect.width, rect.height);

    const stickers = editor.querySelectorAll(".sticker");
    stickers.forEach(sticker => {
      const x = (parseFloat(sticker.getAttribute("data-x")) || 0);
      const y = (parseFloat(sticker.getAttribute("data-y")) || 0);
      ctx.drawImage(sticker, x + 100, y + 100, sticker.width, sticker.height);
    });

    const link = document.createElement("a");
    link.download = "Optimump2p_PFP.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
});
