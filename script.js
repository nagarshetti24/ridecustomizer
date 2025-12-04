const canvas = document.getElementById("bikeCanvas");
const ctx = canvas.getContext("2d");

const img = new Image();
img.src = "bike-base.png";

img.onload = () => {
  canvas.width = img.width;
  canvas.height = img.height;
  draw();
};

const parts = {
  tank:        { colorInput: "tankColor",    hueRange: [0, 50],    satMin: 10, valMin: 40 },
  side:        { colorInput: "sideColor",    hueRange: [40, 90],   satMin: 5,  valMin: 40 },
  tail:        { colorInput: "tailColor",    hueRange: [10, 70],   satMin: 10, valMin: 35 },
  fender:      { colorInput: "fenderColor",  hueRange: [0, 70],    satMin: 5,  valMin: 55 },
  fork:        { colorInput: "forkColor",    hueRange: [0, 40],    satMin: 0,  valMin: 70 }
};

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img, 0, 0);

  Object.keys(parts).forEach(key => applyColorZone(parts[key]));
}

function applyColorZone(part) {
  const color = document.getElementById(part.colorInput).value;
  const [r, g, b] = hexToRGB(color);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const d = imageData.data;

  for (let i = 0; i < d.length; i += 4) {
    const R = d[i], G = d[i+1], B = d[i+2];

    const hsv = rgbToHsv(R, G, B);

    if (
      hsv.s >= part.satMin &&
      hsv.v >= part.valMin &&
      hsv.h >= part.hueRange[0] && hsv.h <= part.hueRange[1]
    ) {
      d[i]   = (R * 0.2) + r * 0.8;
      d[i+1] = (G * 0.2) + g * 0.8;
      d[i+2] = (B * 0.2) + b * 0.8;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function hexToRGB(hex) {
  const bigint = parseInt(hex.slice(1), 16);
  return [(bigint>>16)&255, (bigint>>8)&255, bigint&255];
}

function rgbToHsv(r, g, b) {
  r /= 255; g/=255; b/=255;
  let max = Math.max(r,g,b), min = Math.min(r,g,b);
  let h, s, v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) h = 0;
  else {
    switch(max){
      case r: h = (g-b)/d + (g<b?6:0); break;
      case g: h = (b-r)/d + 2; break;
      case b: h = (r-g)/d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.floor(h*360), s: Math.floor(s*100), v: Math.floor(v*100) };
}

document.querySelectorAll("input[type=color]").forEach(inp => {
  inp.addEventListener("input", draw);
});
