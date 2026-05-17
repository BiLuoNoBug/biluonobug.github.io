// CSS Houdini Paint Worklets

// 1. Animated Gradient Worklet
registerPaint('animated-gradient', class {
  static get inputProperties() {
    return ['--gradient-color', '--animation-progress'];
  }

  paint(ctx, size, props) {
    const color = props.get('--gradient-color');
    const progress = parseFloat(props.get('--animation-progress') || 0);
    
    const gradient = ctx.createLinearGradient(
      progress * size.width, 0,
      (1 - progress) * size.width, size.height
    );
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.5, this.shiftColor(color, 40));
    gradient.addColorStop(1, color);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size.width, size.height);
  }

  shiftColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + amount);
    const b = Math.min(255, (num & 0x0000FF) + amount);
    return `rgb(${r}, ${g}, ${b})`;
  }
});

// 2. Dot Pattern Worklet
registerPaint('dot-pattern', class {
  static get inputProperties() {
    return ['--dot-color', '--dot-size', '--dot-spacing'];
  }

  paint(ctx, size, props) {
    const color = props.get('--dot-color').toString().trim() || '#4ecdc4';
    const dotSize = parseInt(props.get('--dot-size')?.toString() || '8');
    const spacing = parseInt(props.get('--dot-spacing')?.toString() || '20');
    
    const time = Date.now() / 1000;
    const offset = Math.sin(time) * 5;
    
    ctx.fillStyle = color;
    
    for (let x = spacing / 2 + offset; x < size.width; x += spacing) {
      for (let y = spacing / 2; y < size.height; y += spacing) {
        const pulse = 1 + Math.sin(time * 2 + x * 0.1) * 0.3;
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
});

// 3. Grid Pattern Worklet
registerPaint('grid-pattern', class {
  static get inputProperties() {
    return ['--grid-color', '--grid-size'];
  }

  paint(ctx, size, props) {
    const color = props.get('--grid-color')?.toString().trim() || '#ffe66d';
    const gridSize = parseInt(props.get('--grid-size')?.toString() || '30');
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() / 500) * 0.2;
    
    // Vertical lines
    for (let x = 0; x <= size.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, size.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= size.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size.width, y);
      ctx.stroke();
    }
  }
});

console.log('Houdini Paint Worklets loaded');