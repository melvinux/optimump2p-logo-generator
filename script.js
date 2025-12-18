const upload = document.getElementById("pfpUpload");
const preview = document.getElementById("preview");
const editor = document.getElementById("editor");
const downloadBtn = document.getElementById("download");
const canvas = document.getElementById("exportCanvas");
const ctx = canvas.getContext("2d");

upload.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  preview.src = URL.createObjectURL(file);
});

// Add sticker thumbnails
const stickers = [
  "assets/stickers/mascot.2.png",
  "assets/stickers/optimum-sticker 1.png",
  "assets/stickers/optimum-sticker 2.png"
];

stickers.forEach(src => {
  const img = document.createElement("img");
  img.src = src;
  img.style.width = "60px";
  img.style.cursor = "pointer";
  img.onclick = () => addSticker(src);
  document.getElementById("sticker-container").appendChild(img);
});

function addSticker(src) {
  const sticker = document.createElement("img");
  sticker.src = src;
  sticker.className = "sticker";
  sticker.style.left = "110px";
  sticker.style.top = "110px";

  const handle = document.createElement("div");
  handle.className = "sticker-handle";
  sticker.appendChild(handle);

  editor.appendChild(sticker);

  makeDraggable(sticker);
  makeResizable(sticker, handle);
}

// Drag logic
function makeDraggable(el) {
  let startX, startY;

  el.onmousedown = e => {
    if (e.target.classList.contains("sticker-handle")) return;
    startX = e.clientX - el.offsetLeft;
    startY = e.clientY - el.offsetTop;

    document.onmousemove = ev => {
      el.style.left = ev.clientX - startX + "px";
      el.style.top = ev.clientY - startY + "px";
    };

    document.onmouseup = () => {
      document.onmousemove = null;
    };
  };
}

// Resize logic
function makeResizable(sticker, handle) {
  handle.onmousedown = e => {
    e.stopPropagation();
    const startSize = sticker.offsetWidth;
    const startX = e.clientX;

    document.onmousemove = ev => {
      sticker.style.width = startSize + (ev.clientX - startX) + "px";
    };

    document.onmouseup = () => {
      document.onmousemove = null;
    };
  };
}

// EXPORT (no shift, full quality)
downloadBtn.onclick = () => {
  const img = new Image();
  img.onload = () => {
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.drawImage(img, 0, 0);

    const scale = img.naturalWidth / editor.offsetWidth;

    document.querySelectorAll(".sticker").forEach(s => {
      ctx.drawImage(
        s,
        s.offsetLeft * scale,
        s.offsetTop * scale,
        s.offsetWidth * scale,
        s.offsetHeight * scale
      );
    });

    const link = document.createElement("a");
    link.download = "optimump2p-pfp.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
  img.src = preview.src;
};

