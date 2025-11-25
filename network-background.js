/*
========================================
NETWORK BACKGROUND COLOR CUSTOMIZATION
========================================

HOW TO CHANGE COLORS:
1. Find the section marked "CUSTOMIZE COLORS HERE" below
2. Edit RGB values in the format: { r: 255, g: 0, b: 0 }
3. Save the file and refresh your browser

POPULAR COLOR PRESETS:
- Blue:    { r: 59, g: 130, b: 246 }
- Green:   { r: 16, g: 185, b: 129 }
- Red:     { r: 239, g: 68, b: 68 }
- Purple:  { r: 168, g: 85, b: 247 }
- Pink:    { r: 236, g: 72, b: 153 }
- Yellow:  { r: 251, g: 191, b: 36 }
- Orange:  { r: 249, g: 115, b: 22 }
- Cyan:    { r: 6, g: 182, b: 212 }
- White:   { r: 255, g: 255, b: 255 }

TIPS:
- Add multiple colors to nodes array for variety
- Use same color for lineColor to match nodes
- Lower values = darker, Higher values = brighter
- RGB values range from 0 to 255

========================================
*/

// Animated Network Background
class NetworkBackground {
    constructor() {
        // ===== CUSTOMIZE COLORS HERE =====
        this.colors = {
            // Node colors - Add or remove colors as you want
            nodes: [
                { r: 59, g: 130, b: 246 },   // Blue
                { r: 255, g: 255, b: 255 },  // White
               
            ],
            
            // Connection line color
            lineColor: { r: 255, g: 255, b: 255 }, // White lines
            
            // Background color (optional - set to null to use CSS background)
            backgroundColor: null // null or { r: 10, g: 10, b: 10 }
        };
        
        // ===== OTHER SETTINGS =====
        this.particleCount = 100;          // Number of particles (30-150 recommended)
        this.maxDistance = 150;           // Max distance for connections (100-200)
        this.particleSpeed = 0.8;         // Particle movement speed (0.3-1.0)
        this.lineOpacity = 2.0;           // Connection line opacity (0.1-0.5)
        this.glowSize = 10;                // Particle glow size (4-10)
        this.mouseRepelDistance = 100;   // Mouse interaction distance (50-150)
        // =================================
        
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        
        this.init();
    }
    
    init() {
        // Setup canvas
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '0';
        this.canvas.style.pointerEvents = 'none';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        // Event listeners
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * this.particleSpeed,
                vy: (Math.random() - 0.5) * this.particleSpeed,
                radius: Math.random() * 1.5 + 0.5,
                color: this.getRandomColor()
            });
        }
    }
    
    getRandomColor() {
        return this.colors.nodes[Math.floor(Math.random() * this.colors.nodes.length)];
    }
    
    drawParticle(particle) {
        // Outer glow
        const gradient = this.ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.radius * this.glowSize
        );
        gradient.addColorStop(0, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.8)`);
        gradient.addColorStop(0.2, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.4)`);
        gradient.addColorStop(0.5, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0.1)`);
        gradient.addColorStop(1, `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 0)`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius * this.glowSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Core
        this.ctx.fillStyle = `rgba(${particle.color.r}, ${particle.color.g}, ${particle.color.b}, 1)`;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawConnections() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * this.lineOpacity;
                    const color = this.colors.lineColor;
                    
                    this.ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.vx *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.vy *= -1;
            }
            
            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.mouseRepelDistance) {
                    const force = (this.mouseRepelDistance - distance) / this.mouseRepelDistance;
                    particle.x -= (dx / distance) * force * 2;
                    particle.y -= (dy / distance) * force * 2;
                }
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateParticles();
        this.drawConnections();
        this.particles.forEach(particle => this.drawParticle(particle));
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize network background when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new NetworkBackground();
    });
} else {
    new NetworkBackground();
}