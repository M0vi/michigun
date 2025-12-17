/* TABS */
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

/* COPY */
document.querySelector(".copy-button").addEventListener("click", () => {
    const area = document.getElementById("hidden-code");
    area.style.display = "block";
    area.select();
    document.execCommand("copy");
    area.style.display = "none";
});

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: 0, y: 0 };

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - .5) * .3;
        this.vy = (Math.random() - .5) * .3;
        this.size = Math.random() * 2 + 1;
    }
    draw() {
        ctx.fillStyle = "rgba(255,255,255,.3)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fill();
    }
    update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
            this.x -= dx * .01;
            this.y -= dy * .01;
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        this.draw();
    }
}

for (let i = 0; i < 70; i++) particles.push(new Particle());

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => p.update());
    requestAnimationFrame(animate);
}
animate();
