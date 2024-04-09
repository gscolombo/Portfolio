export default function smokeBackground(width, height) {
    const [sin, cos, random, floor, sqrt, pi] = [Math.sin, Math.cos, Math.random, Math.floor, Math.sqrt, Math.PI];
    const canvas = document.getElementById("smoke");
    const ctx = canvas.getContext('2d');
    const dpr = 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr)

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Smoke points
    const randint = (min, max) => floor(random() * (max - min + 1) + min); 
    const wobble = (t) => sin(t*(pi/180));
    const triangle = (x, y, h, s, t = 0) => {
        const v = [(sqrt(3)*h)/3, h/3];
        ctx.beginPath();
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(t * pi/180);
        ctx.moveTo(-v[0]*s, -v[1]*s);
        ctx.lineTo(0, 3*v[1]);
        ctx.lineTo(v[0], -v[1]);
        ctx.lineTo(-v[0]*s, -v[1]*s);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    let points = [...new Array(10)].map(() => [randint(0, canvas.width), randint(0, canvas.height), 
                                               randint(200, 400), randint(-2, 2)]);
    let times = points.map(() => randint(0, 360));
    draw();

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        times = times.map((t) => t += 1/4);

        // Background
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Translate points coordinates in random fashion
        points = points.map(([x, y, h, s], i) => [
            x + wobble(times[i]), 
            y + wobble(times[i]), 
            h, s
        ]);
        
        // Redraw points
        ctx.fillStyle = 'rgba(5,5,5,0.5)';
        ctx.strokeStyle = 'red';
        points.forEach(([x, y, h, s], i) => triangle(x, y, h, s, times[i]));

        requestAnimationFrame(draw);
    }
}
