    // ═══════════════════════════════════════════════════
    // 绘制第一章：点（从点到球的分级效果）
    // ═══════════════════════════════════════════════════
    function drawChapter1(ctx, cx, cy, width, height) {
      const hasMain = ctrl[0].connected;
      const hasSub = ctrl[1].connected;
      const mainE = STATE.mainEnergy;
      const subE = STATE.subEnergy;
      const totalE = (mainE + subE) / 2;
      
      const pulseSpeed = 0.003;
      const time = Date.now() * pulseSpeed;
      
      // 阶段：0=静态小点, 1=基础球体, 2=发展部(单手高能量), 3=高潮(双手高能量)
      let stage = 0;
      if (hasSub && totalE > 70) {
        stage = 3;
      } else if (hasMain && mainE > 50) {
        stage = 2;
      } else if (hasMain) {
        stage = 1;
      }
      
      if (stage === 0) {
        // 静态：一个很小的点
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
        
      } else if (stage === 1) {
        // 基础球体（主手连接，低能量）
        const baseRadius = 40;
        const pulse = Math.sin(time * 2) * 0.1 + 1;
        const radius = baseRadius * pulse;
        drawWireframeSphere(ctx, cx, cy, radius, 6, 4, 0.02, time);
        
      } else if (stage === 2) {
        // 发展部：单手高能量，球体炸开
        const baseRadius = 50 + (mainE - 50) * 0.8;
        const explodeFactor = (mainE - 50) / 50;
        const pulse = Math.sin(time * 3) * 0.15 + 1;
        const radius = baseRadius * pulse;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 + explodeFactor * 0.3})`;
        ctx.lineWidth = 1 + explodeFactor * 0.5;
        drawWireframeSphere(ctx, cx, cy, radius, 10, 6, 0.1 * explodeFactor, time);
        
        // 炸开粒子
        drawExplosionParticles(ctx, cx, cy, radius, explodeFactor, 20);
        
      } else if (stage === 3) {
        // 高潮：双手高能量，最大炸开
        const baseRadius = 60 + (totalE - 70) * 1.2;
        const explodeFactor = (totalE - 70) / 30;
        const pulse = Math.sin(time * 4) * 0.2 + 1;
        const radius = baseRadius * pulse;
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.8 + explodeFactor * 0.2})`;
        ctx.lineWidth = 1.2 + explodeFactor * 0.8;
        drawWireframeSphere(ctx, cx, cy, radius, 14, 8, 0.2 * explodeFactor, time);
        
        // 更多炸开粒子
        drawExplosionParticles(ctx, cx, cy, radius, explodeFactor, 40);
      }
    }
    
    // 辅助函数：绘制线框球体
    function drawWireframeSphere(ctx, cx, cy, radius, meridians, parallels, noiseAmp, time) {
      ctx.strokeStyle = ctx.strokeStyle || 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = ctx.lineWidth || 1;
      
      // 经线
      for (let i = 0; i < meridians; i++) {
        const angle = (i / meridians) * Math.PI * 2;
        ctx.beginPath();
        for (let j = 0; j <= 30; j++) {
          const lat = (j / 30) * Math.PI - Math.PI / 2;
          const noise = Math.sin(lat * 4 + time + i) * noiseAmp;
          const r = radius * (1 + noise);
          const x = cx + r * Math.cos(lat) * Math.cos(angle);
          const y = cy + r * Math.sin(lat);
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // 纬线
      for (let i = 0; i < parallels; i++) {
        const lat = ((i + 1) / (parallels + 1)) * Math.PI - Math.PI / 2;
        const y = cy + radius * Math.sin(lat);
        const r = radius * Math.cos(lat);
        ctx.beginPath();
        for (let j = 0; j <= 40; j++) {
          const angle = (j / 40) * Math.PI * 2;
          const noise = Math.sin(angle * 3 + time * 1.5) * noiseAmp * 0.8;
          const rr = r * (1 + noise);
          const x = cx + rr * Math.cos(angle);
          const py = y + (Math.random() - 0.5) * noiseAmp * 10;
          if (j === 0) ctx.moveTo(x, py);
          else ctx.lineTo(x, py);
        }
        ctx.stroke();
      }
    }
    
    // 辅助函数：绘制炸开粒子
    function drawExplosionParticles(ctx, cx, cy, radius, factor, maxCount) {
      const count = Math.floor(factor * maxCount);
      if (count <= 0) return;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${0.4 + factor * 0.4})`;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = radius * (1 + Math.random() * 0.5 * factor);
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist;
        const size = 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
