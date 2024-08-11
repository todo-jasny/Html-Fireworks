function startFireworks(canvas, options) {
    // Default options
    const defaultOptions = {
        particleCount: 100,
        particleSpeedMin: 2,
        particleSpeedMax: 7,
        particleGravity: 1,
        particleDecayMin: 0.01,
        particleDecayMax: 0.03,
        fireworkColors: ['random', 'red', 'white', 'blue'], // Include 'random' as an option
        particleAlphaMin: 0.5,
        particleAlphaMax: 1.0
    };

    // Merge default options with provided options
    options = { ...defaultOptions, ...options };

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];

    function triggerFireworks() {     
        const x = Math.random() * (canvas.width - 100);
        const y = Math.random() * (canvas.height - 100);
        let color = options.fireworkColors[Math.floor(Math.random() * options.fireworkColors.length)];
        if (color === 'random') {
            color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Generate random HSL color
        }
        fireworks.push(new Firework(x, y, color));
    }

    class Firework {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.particles = [];
            for (let i = 0; i < options.particleCount; i++) {
                this.particles.push(new Particle(x, y, color));
            }
        }

        update() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.update();
                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }
        }

        draw() {
            this.particles.forEach(p => p.draw());
        }
    }

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.speed = Math.random() * (options.particleSpeedMax - options.particleSpeedMin) + options.particleSpeedMin;
            this.angle = Math.random() * Math.PI * 2;
            this.gravity = options.particleGravity;
            this.alpha = 1; // Start with full alpha
            this.decay = Math.random() * (options.particleDecayMax - options.particleDecayMin) + options.particleDecayMin;
            this.color = color;
        }

        update() {
            this.speed *= 0.98;
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed + this.gravity;
            this.alpha -= this.decay;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((firework, index) => {
            firework.update();
            firework.draw();
            if (firework.particles.length === 0) {
                fireworks.splice(index, 1);
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Expose triggerFireworks function globally for button click
    window.triggerFireworks = triggerFireworks;
}
