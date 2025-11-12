/* ---------------------------------------------------
   p5.js — sketch principal (interactivo)
--------------------------------------------------- */
let running = false;
let points = [];
let diameter = 48;
let speed = 4;
let palette = "pastel";
let bgShift = 0;

function setup(){
  const cnv = createCanvas(640, 400);
  cnv.parent("p5-container");
  noStroke();
}

function draw(){
  // fondo animado suave
  bgShift += 0.003 * speed;
  const g = drawingContext.createLinearGradient(0, 0, width, height);
  const c1 = color(20 + 20 * sin(bgShift), 30, 60);
  const c2 = color(15, 25 + 25 * cos(bgShift*0.8), 55);
  g.addColorStop(0, c1.toString());
  g.addColorStop(1, c2.toString());
  drawingContext.fillStyle = g;
  rect(0, 0, width, height);

  // partículas si está corriendo
  if (running){
    for (let i = 0; i < 2; i++){
      const vx = random(-1, 1) * speed * 0.6;
      const vy = random(-1, 1) * speed * 0.6;
      points.push({ x: mouseX || width/2, y: mouseY || height/2, vx, vy, life: 255 });
    }
  }

  // actualizar/dibujar partículas
  for (let p of points){
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 2;

    const col = pickColor(palette, p.life);
    fill(col.r, col.g, col.b, p.life);
    circle(p.x, p.y, diameter);
  }
  // limpiar partículas muertas
  points = points.filter(p => p.life > 0 && p.x>-50 && p.x<width+50 && p.y>-50 && p.y<height+50);
}

function mousePressed(){
  // estallido de puntos en clic
  for (let i = 0; i < 24; i++){
    const a = random(TWO_PI);
    const r = random(0.5, 1.4) * speed;
    points.push({ x: mouseX, y: mouseY, vx: cos(a)*r, vy: sin(a)*r, life: 255 });
  }
}

function pickColor(mode, t){
  if (mode === "neon"){
    return { r: 120 + (t%135), g: 255 - (t%120), b: 200 + (t%55) };
  } else if (mode === "mono"){
    const v = 160 + (t % 80);
    return { r: v, g: v, b: v };
  }
  // pastel
  return { r: 255, g: 180 + (t%60), b: 200 + (t%40) };
}

/* UI: controles */
document.getElementById("btn-toggle").addEventListener("click", () => {
  running = !running;
  document.getElementById("btn-toggle").textContent = running ? "⏸ Pausar animación" : "▶ Iniciar animación";
});
document.getElementById("btn-clear").addEventListener("click", () => {
  points = [];
  background(11, 15, 38);
});
document.getElementById("size").addEventListener("input", (e) => {
  diameter = parseInt(e.target.value, 10);
});
document.getElementById("speed").addEventListener("input", (e) => {
  speed = parseInt(e.target.value, 10);
});
document.getElementById("palette").addEventListener("change", (e) => {
  palette = e.target.value;
});


/* ---------------------------------------------------
   Processing.js — sketch embebido en el <canvas>
   Cuadrado que rebota y rota con color variable.
--------------------------------------------------- */
(function initProcessing(){
  const code = function(processing){
    var W = 640, H = 400;
    processing.size(W, H);
    processing.smooth();

    var x = W/2, y = H/2, vx = 3, vy = 2.2, angle = 0;
    var s = 70;

    processing.draw = function(){
      processing.background(12, 16, 38);

      // rebotes
      x += vx; y += vy; angle += 0.02;
      if (x < s/2 || x > W - s/2) vx *= -1;
      if (y < s/2 || y > H - s/2) vy *= -1;

      // color pulsante
      var r = 120 + 120 * Math.abs(Math.sin(angle));
      var g = 180 + 60 * Math.abs(Math.cos(angle*0.7));
      var b = 220;
      processing.fill(r, g, b);
      processing.noStroke();

      // dibujar cuadrado rotando alrededor de su centro
      processing.pushMatrix();
      processing.translate(x, y);
      processing.rotate(angle);
      processing.rectMode(processing.CENTER);
      processing.rect(0, 0, s, s, 12);
      processing.popMatrix();
    };
  };
  const canvas = document.getElementById("processing-canvas");
  new Processing(canvas, code);
})();
