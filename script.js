const buttons = document.querySelectorAll(".tab-button");
const tabs = document.querySelectorAll(".tab-content");

buttons.forEach(btn => {
    btn.addEventListener("click", () => {
        buttons.forEach(b => b.classList.remove("active"));
        tabs.forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById(btn.dataset.tab).classList.add("active");
    });
});

const copyBtn = document.getElementById("copyBtn");
const codeEl = document.getElementById("code");
const msg = document.getElementById("copy-msg");

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(codeEl.innerText.trim());
        msg.textContent = "Copiado com sucesso!";
    } catch {
        msg.textContent = "Erro ao copiar";
    }
    setTimeout(() => msg.textContent = "", 2000);
});

const audio = document.getElementById("ambientSound");
let analyser, dataArray;
let started = false;

document.addEventListener("click", () => {
    if (!started) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const source = ctx.createMediaElementSource(audio);
        analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        audio.volume = 0.25;
        audio.play().catch(()=>{});
        started = true;
    }
});

const canvas = document.getElementById("particles");
const ctx2 = canvas.getContext("2d");
let particles = [];
const COUNT = 70;

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

for (let i = 0; i < COUNT; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
    });
}

const favCanvas = document.createElement("canvas");
favCanvas.width = 32;
favCanvas.height = 32;
const fctx = favCanvas.getContext("2d");
const fav = document.getElementById("dynamic-favicon");
let hue = 0;

function updateFavicon(glow) {
    fctx.clearRect(0,0,32,32);
    const g = fctx.createRadialGradient(16,16,4,16,16,16);
    g.addColorStop(0,`hsla(${hue},100%,60%,${glow})`);
    g.addColorStop(1,"transparent");
    fctx.fillStyle = g;
    fctx.fillRect(0,0,32,32);
    fav.href = favCanvas.toDataURL("image/png");
    hue = (hue + 2) % 360;
}

function animate() {
    ctx2.clearRect(0,0,canvas.width,canvas.height);
    let energy = 0;

    if (analyser) {
        analyser.getByteFrequencyData(dataArray);
        energy = dataArray.slice(0,20).reduce((a,b)=>a+b,0)/20/255;
    }

    document.documentElement.style.setProperty("--bg-glow", energy * 0.6);
    document.documentElement.style.setProperty("--bg-x", `${50 + energy * 10}%`);
    document.documentElement.style.setProperty("--bg-y", `${50 + energy * 6}%`);
    document.documentElement.style.setProperty("--particle-glow", `${2 + energy * 6}px`);

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.r + energy, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(255,255,255,${0.4 + energy})`;
        ctx2.fill();
    });

    updateFavicon(0.3 + energy);
    requestAnimationFrame(animate);
}

animate();
