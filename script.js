const bike = document.getElementById("bike");
let isDragging = false;
let lastX = 0;
let rotation = 0;
let velocity = 0;

bike.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastX = e.clientX;
});
window.addEventListener("mouseup", () => { isDragging = false; });
window.addEventListener("mousemove", (e) => {
    if (isDragging) {
        let dx = e.clientX - lastX;
        lastX = e.clientX;
        rotation += dx * 0.5;
        velocity = dx * 0.25;
        bike.style.transform = `rotateY(${rotation}deg)`;
    }
});

bike.addEventListener("touchstart", (e) => {
    isDragging = true;
    lastX = e.touches[0].clientX;
});
bike.addEventListener("touchend", () => { isDragging = false; });
bike.addEventListener("touchmove", (e) => {
    if (isDragging) {
        let dx = e.touches[0].clientX - lastX;
        lastX = e.touches[0].clientX;
        rotation += dx * 0.5;
        velocity = dx * 0.25;
        bike.style.transform = `rotateY(${rotation}deg)`;
    }
});

function animate() {
    if (!isDragging) {
        if (Math.abs(velocity) > 0.1) {
            rotation += velocity;
            velocity *= 0.95;
            bike.style.transform = `rotateY(${rotation}deg)`;
        }
    }
    requestAnimationFrame(animate);
}
animate();
