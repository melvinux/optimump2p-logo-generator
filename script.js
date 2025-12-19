document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pfpCanvas");
  const ctx = canvas.getContext("2d");
  canvas.style.touchAction = "none";

  const upload = document.getElementById("pfpUpload");
  const downloadBtn = document.getElementById("download");
  const stickerPicker = document.getElementById("stickerPicker");

  let baseImage = null;
  const stickers = [];
  let activeSticker = null;
  let mode = null;

  const stickerSources = [
    "assets/stickers/mascot.2.png",
    "assets/stickers/optimum-sticker 1.png",
    "assets/stickers/optimum-sticker 2.png",
    "assets/stickers/Sticker.png"
  ];

  // Sticker picker
  stickerSources.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onclick = () => addSticker(src);
    stickerPicker.appendChild(img);
  });

  // Upload image
  upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      baseImage = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      redraw();
    };
    img.src = URL.createObjectURL(file);
  });

  // Add sticker
  function addSticker(src) {
    const img = new Image();
    img.onload = () => {
      stickers.push({
        img,
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: canvas.width * 0.2
      });
      redraw();
    };
    img.src = src;
  }

  // Draw
  function redraw(showHandles = true) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (baseImage) ctx.drawImage(baseImage, 0, 0);

  stickers.forEach(s => {
    ctx.drawImage(
      s.img,
      s.x - s.size / 2,
      s.y - s.size / 2,
      s.size,
      s.size
    );

    // Only draw blue resize dot if showHandles is true
    if (showHandles) {
      ctx.fillStyle = "#0a66c2";
      ctx.fillRect(
        s.x + s.size / 2 - 14,
        s.y + s.size / 2 - 14,
        14,
        14
      );
    }
  });
}


  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  // Pointer down
  canvas.addEventListener("pointerdown", e => {
    const pos = getPos(e);
    activeSticker = null;
    mode = null;

    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];

      if (
        pos.x > s.x + s.size / 2 - 24 &&
        pos.y > s.y + s.size / 2 - 24
      ) {
        activeSticker = s;
        mode = "resize";
        canvas.setPointerCapture(e.pointerId);
        return;
      }

      if (
        pos.x > s.x - s.size / 2 &&
        pos.x < s.x + s.size / 2 &&
        pos.y > s.y - s.size / 2 &&
        pos.y < s.y + s.size / 2
      ) {
        activeSticker = s;
        mode = "drag";
        canvas.setPointerCapture(e.pointerId);
        return;
      }
    }
  });

  // Pointer move
  canvas.addEventListener("pointermove", e => {
    if (!activeSticker) return;
    const pos = getPos(e);

    if (mode === "drag") {
      activeSticker.x = pos.x;
      activeSticker.y = pos.y;
    }

    if (mode === "resize") {
      const dx = pos.x - activeSticker.x;
      const dy = pos.y - activeSticker.y;
      activeSticker.size = Math.max(40, Math.hypot(dx, dy) * 2);
    }

    redraw();
  });

  // Pointer up
  canvas.addEventListener("pointerup", e => {
    canvas.releasePointerCapture(e.pointerId);
    activeSticker = null;
    mode = null;
  });

  // Download
  downloadBtn.onclick = () => {
    const link = document.createElement("a");
    link.download = "optimump2p-pfp.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };
});
