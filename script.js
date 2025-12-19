document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("pfpCanvas");
  const ctx = canvas.getContext("2d");
  canvas.style.touchAction = "none";

  const upload = document.getElementById("pfpUpload");
  const downloadBtn = document.getElementById("download");
  const flipBtn = document.getElementById("flip");
  const deleteBtn = document.getElementById("delete");
  const stickerPicker = document.getElementById("stickerPicker");

  let baseImage = null;
  let flipped = false;
  const stickers = [];
  let activeSticker = null;
  let mode = null;

  const stickerSources = [
    "assets/stickers/mascot.2.png",
    "assets/stickers/optimum-sticker 1.png",
    "assets/stickers/optimum-sticker 2.png",
    "assets/stickers/Sticker.png"
  ];

  /* ---------- Sticker Picker ---------- */
  stickerSources.forEach(src => {
    const img = new Image();
    img.src = src;
    img.onclick = () => addSticker(src);
    stickerPicker.appendChild(img);
  });

  /* ---------- Upload ---------- */
  upload.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      baseImage = img;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      stickers.length = 0;
      activeSticker = null;
      redraw();
    };
    img.src = URL.createObjectURL(file);
  });

  /* ---------- Add Sticker ---------- */
  function addSticker(src) {
    const img = new Image();
    img.onload = () => {
      stickers.push({
        img,
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: canvas.width * 0.25
      });
      activeSticker = stickers[stickers.length - 1];
      redraw();
    };
    img.src = src;
  }

  /* ---------- Draw ---------- */
  function redraw(showOutline = true) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    if (flipped) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    if (baseImage) ctx.drawImage(baseImage, 0, 0);

    stickers.forEach(s => {
      ctx.drawImage(
        s.img,
        s.x - s.size / 2,
        s.y - s.size / 2,
        s.size,
        s.size
      );

      if (showOutline && s === activeSticker) {
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(
          s.x - s.size / 2,
          s.y - s.size / 2,
          s.size,
          s.size
        );
        ctx.setLineDash([]);
      }
    });

    ctx.restore();
  }

  /* ---------- Position ---------- */
  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left) * (canvas.width / rect.width);
    let y = (e.clientY - rect.top) * (canvas.height / rect.height);
    if (flipped) x = canvas.width - x;
    return { x, y };
  }

  /* ---------- Pointer Down ---------- */
  canvas.addEventListener("pointerdown", e => {
    const pos = getPos(e);
    activeSticker = null;
    mode = null;

    for (let i = stickers.length - 1; i >= 0; i--) {
      const s = stickers[i];
      const half = s.size / 2;

      const inside =
        pos.x > s.x - half &&
        pos.x < s.x + half &&
        pos.y > s.y - half &&
        pos.y < s.y + half;

      if (inside) {
        activeSticker = s;

        const edgeMargin = 20;
        const nearEdge =
          Math.abs(pos.x - (s.x - half)) < edgeMargin ||
          Math.abs(pos.x - (s.x + half)) < edgeMargin ||
          Math.abs(pos.y - (s.y - half)) < edgeMargin ||
          Math.abs(pos.y - (s.y + half)) < edgeMargin;

        mode = nearEdge ? "resize" : "drag";
        canvas.setPointerCapture(e.pointerId);
        redraw();
        return;
      }
    }

    redraw();
  });

  /* ---------- Pointer Move ---------- */
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
      activeSticker.size = Math.max(60, Math.hypot(dx, dy) * 2);
    }

    redraw();
  });

  /* ---------- Pointer Up ---------- */
  canvas.addEventListener("pointerup", e => {
    canvas.releasePointerCapture(e.pointerId);
    mode = null;
  });

  /* ---------- Flip ---------- */
  flipBtn.onclick = () => {
    flipped = !flipped;
    redraw();
  };

  /* ---------- Delete Sticker ---------- */
  deleteBtn.onclick = () => {
    if (!activeSticker) return;

    const index = stickers.indexOf(activeSticker);
    if (index !== -1) {
      stickers.splice(index, 1);
      activeSticker = stickers[stickers.length - 1] || null;
      redraw();
    }
  };

  /* ---------- Download ---------- */
  downloadBtn.onclick = () => {
    redraw(false);
    const link = document.createElement("a");
    link.download = "optimump2p-pfp.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    redraw();
  };
});

