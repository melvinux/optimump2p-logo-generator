// --- Setup Canvas ---
const canvas = document.getElementById('pfpCanvas');
const ctx = canvas.getContext('2d');

// Base background
ctx.fillStyle = '#a8c7ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// --- Load Optimump2p Logo ---
const logo = new Image();
logo.src = 'assets/optimump2p-logo.png';

// --- Upload and Preview PFP ---
const pfpUpload = document.getElementById('pfpUpload');
const pfpPreview = document.getElementById('pfpPreview');

pfpUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw uploaded image centered and scaled
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      // Draw Optimump2p watermark (bottom-right)
      logo.onload = () => {
        const logoSize = 60; // adjust if too big/small
        const logoX = canvas.width - logoSize - 10;
        const logoY = canvas.height - logoSize - 10;
        ctx.globalAlpha = 0.9; // slightly transparent
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
        ctx.globalAlpha = 1.0;
      };
      if (logo.complete) logo.onload();

      // Also show preview
      pfpPreview.src = e.target.result;
      pfpPreview.style.display = "block";
      pfpPreview.style.maxWidth = "200px";
      pfpPreview.style.borderRadius = "10px";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// --- Add Cap ---
document.getElementById('addCap').onclick = () => {
  ctx.fillStyle = '#000080';
  ctx.beginPath();
  ctx.arc(200, 100, 60, Math.PI, 0);
  ctx.fill();
  if (logo.complete) logo.onload();
};

// --- Add Sticker ---
document.getElementById('addSticker').onclick = () => {
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(150, 250, 100, 100);
  if (logo.complete) logo.onload();
};

// --- Download PFP ---
document.getElementById('download').onclick = () => {
  const link = document.createElement('a');
  link.download = 'optimump2p_pfp.png';
  link.href = canvas.toDataURL();
  link.click();
};

