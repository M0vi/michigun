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

const luaTitle = document.querySelector(".lua-title");
let hue = 0;

setInterval(() => {
    hue = (hue + 2) % 360;
    luaTitle.style.color = `hsl(${hue}, 100%, 65%)`;
}, 80);

const copyBtn = document.getElementById("copyBtn");
const codeEl = document.getElementById("code");
const msg = document.getElementById("copy-msg");

copyBtn.addEventListener("click", () => {
    const ta = document.createElement("textarea");
    ta.value = codeEl.innerText;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);

    copyBtn.classList.add("copied");
    msg.textContent = "copiado!";

    setTimeout(() => {
        copyBtn.classList.remove("copied");
        msg.textContent = "";
    }, 1600);
});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let stars = [];
const STAR_COUNT = 120;
const mouse = { x: null, y: null };

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - .5) * .4,
        vy: (Math.random() - .5) * .4,
        r: Math.random() * 1.5 + .5
    });
}

function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);

    stars.forEach(s => {
        s.x += s.vx;
        s.y += s.vy;

        if (s.x < 0 || s.x > canvas.width) s.vx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,.7)";
        ctx.fill();
    });

    for (let i = 0; i < stars.length; i++) {
        for (let j = i; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 110) {
                ctx.strokeStyle = `rgba(255,255,255,${1 - dist/110})`;
                ctx.beginPath();
                ctx.moveTo(stars[i].x, stars[i].y);
                ctx.lineTo(stars[j].x, stars[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

animate();
