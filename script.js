const canvas = document.getElementById('pfpCanvas');
const ctx = canvas.getContext('2d');

// Base background
ctx.fillStyle = '#a8c7ff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

document.getElementById('addCap').onclick = () => {
  ctx.fillStyle = '#000080';
  ctx.beginPath();
  ctx.arc(200, 100, 60, Math.PI, 0);
  ctx.fill();
};

document.getElementById('addSticker').onclick = () => {
  ctx.fillStyle = '#ff0000';
  ctx.fillRect(150, 250, 100, 100);
};

document.getElementById('download').onclick = () => {
  const link = document.createElement('a');
  link.download = 'optimump2p_pfp.png';
  link.href = canvas.toDataURL();
  link.click();
};
