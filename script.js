const canvas = document.getElementById('pfpCanvas');
const ctx = canvas.getContext('2d');

// --- Base background ---
ctx.fillStyle = '#a8c7ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// --- Upload and Preview PFP ---
const pfpUpload = document.getElementById('pfpUpload');
const pfpPreview = document.getElementById('pfpPreview');
let uploadedImg = null;

pfpUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImg = new Image();
    uploadedImg.onload = () => {
      drawCanvas();
      pfpPreview.src = e.target.result;
      pfpPreview.style.display = "block";
      pfpPreview.style.maxWidth = "200px";
      pfpPreview.style.borderRadius = "10px";
    };
    uploadedImg.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

// --- Function to draw uploaded image ---
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#a8c7ff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (uploadedImg) {
    const scale = Math.min(canvas.width / uploadedImg.width, canvas.height / uploadedImg.height);
    const x = (canvas.width - uploadedImg.width * scale) / 2;
    const y = (canvas.height - uploadedImg.height * scale) / 2;
    ctx.drawImage(uploadedImg, x, y, uploadedImg.width * scale, uploadedImg.height * scale);
  }
}

// --- Add Sticker 1 ---
document.getElementById('addSticker1').onclick = () => {
  const sticker1 = new Image();
  sticker1.src = 'assets/optimum-sticker1.png'; // change filename to match your image
  sticker1.onload = () => {
    ctx.drawImage(sticker1, 250, 50, 100, 100); // adjust position & size as needed
  };
};

// --- Add Sticker 2 ---
document.getElementById('addSticker2').onclick = () => {
  const sticker2 = new Image();
  sticker2.src = 'assets/optimum-sticker2.png'; // change filename to match your image
  sticker2.onload = () => {
    ctx.drawImage(sticker2, 50, 250, 100, 100); // adjust position & size as needed
  };
};

// --- Download PFP ---
document.getElementById('download').onclick = () => {
  const link = document.createElement('a');
  link.download = 'optimump2p_pfp.png';
  link.href = canvas.toDataURL();
  link.click();
};
