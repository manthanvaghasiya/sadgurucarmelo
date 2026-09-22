import { getOptimizedUrl } from './imageUtils';

/**
 * Generates a high-definition (1200x800) branded Car Details Summary Image using HTML5 Canvas.
 * Includes Sadguru branding, car photo, price, and complete technical specifications.
 * @param {Object} car - The car object with make, model, price, kms, specs, etc.
 * @returns {Promise<string>} Data URL of the generated JPEG image.
 */
export async function generateCarDetailCard(car) {
  return new Promise((resolve) => {
    try {
      if (!car) {
        resolve(null);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      const W = 1200;
      const H = 800;
      canvas.width = W;
      canvas.height = H;

      // 1. Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // 2. Top Header Bar (Dark Slate #0f172a)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, W, 105);

      // Accent gradient bar
      const grad = ctx.createLinearGradient(0, 105, W, 105);
      grad.addColorStop(0, '#ea580c');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#ea580c');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 105, W, 5);

      // Header Content - Sadguru Branding
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('SADGURU CAR SURAT', 40, 52);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('PREMIUM CERTIFIED PRE-OWNED CARS • SURAT', 40, 80);

      // Header Right Contact Info
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 21px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('📞 +91 99136 34447', W - 40, 48);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('Trilok Car Bazar, Simada Canal Rd, Surat', W - 40, 76);
      ctx.textAlign = 'left'; // Reset

      // Helper to draw rounded rectangle
      const drawRoundRect = (x, y, w, h, r, fill, stroke) => {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        if (fill) {
          ctx.fillStyle = fill;
          ctx.fill();
        }
        if (stroke) {
          ctx.strokeStyle = stroke;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      };

      // Left: Car Image Box
      const imgBoxX = 40;
      const imgBoxY = 130;
      const imgBoxW = 520;
      const imgBoxH = 480;
      drawRoundRect(imgBoxX, imgBoxY, imgBoxW, imgBoxH, 16, '#f8fafc', '#e2e8f0');

      // Right: Details Section
      const rightX = 590;

      // Car Title & Year
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const carTitle = `${car.make || 'Car'} ${car.model || ''}`;
      ctx.fillText(carTitle.substring(0, 26), rightX, 170);

      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const subTitle = `${car.variant ? car.variant + ' • ' : ''}Model Year: ${car.year || car.registerYear || 'N/A'}`;
      ctx.fillText(subTitle, rightX, 200);

      // Price Banner Card
      drawRoundRect(rightX, 218, 570, 75, 12, '#fff7ed', '#fed7aa');
      ctx.fillStyle = '#c2410c';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('SPECIAL OFFER PRICE', rightX + 20, 242);

      ctx.fillStyle = '#ea580c';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const priceFormatted = car.price ? `₹${Number(car.price).toLocaleString('en-IN')}` : 'Ask for Price';
      ctx.fillText(priceFormatted, rightX + 20, 280);

      // Specifications Grid (2 cols x 4 rows)
      const specs = [
        { label: 'KMs Driven', val: car.kms ? `${Number(car.kms).toLocaleString('en-IN')} KM` : 'N/A', icon: '🛣️' },
        { label: 'Fuel Type', val: car.fuelType || 'Petrol', icon: '⛽' },
        { label: 'Transmission', val: car.transmission || 'Manual', icon: '🕹️' },
        { label: 'Ownership', val: car.owner || '1st Owner', icon: '👤' },
        { label: 'Registration', val: car.registration || 'GJ (Gujarat)', icon: '🏛️' },
        { label: 'Insurance', val: car.insurance || 'Valid Insurance', icon: '🛡️' },
        { label: 'Color', val: car.color || 'Original', icon: '🎨' },
        { label: 'Body Type', val: car.bodyType || 'Car', icon: '🚗' },
      ];

      const gridStartX = rightX;
      const gridStartY = 310;
      const cardW = 275;
      const cardH = 65;
      const gapX = 20;
      const gapY = 12;

      specs.forEach((s, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = gridStartX + col * (cardW + gapX);
        const cy = gridStartY + row * (cardH + gapY);

        drawRoundRect(cx, cy, cardW, cardH, 10, '#f8fafc', '#e2e8f0');

        ctx.font = '18px sans-serif';
        ctx.fillText(s.icon, cx + 12, cy + 38);

        ctx.fillStyle = '#64748b';
        ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(s.label.toUpperCase(), cx + 42, cy + 28);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(String(s.val).substring(0, 18), cx + 42, cy + 50);
      });

      // Trust Badges Box
      const badgeY = 560;
      drawRoundRect(imgBoxX + 15, badgeY, 490, 42, 8, '#f0fdf4', '#bbf7d0');
      ctx.fillStyle = '#16a34a';
      ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓ 150-Point Certified  •  ✓ Genuine KM  •  ✓ Loan Available', imgBoxX + 260, badgeY + 26);
      ctx.textAlign = 'left';

      // Bottom Footer Bar
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(0, 730, W, 70);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 730);
      ctx.lineTo(W, 730);
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('📍 Trilok Car Bazar, Simada Canal BRTS Rd, Canal Chokdi, Varachha, Surat', 40, 770);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('sadgurucarsurat.com  •  WhatsApp: +91 99136 34447', W - 40, 770);
      ctx.textAlign = 'left';

      // Load car hero image and render inside imgBox
      const rawHero = car.image || (car.images && car.images[0]);
      if (rawHero) {
        const heroUrl = getOptimizedUrl(rawHero, 800);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          try {
            const pad = 15;
            const drawW = imgBoxW - pad * 2;
            const drawH = 390;
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const boxAspect = drawW / drawH;
            let rw = drawW;
            let rh = drawH;
            let rx = imgBoxX + pad;
            let ry = imgBoxY + pad;

            if (imgAspect > boxAspect) {
              rh = drawW / imgAspect;
              ry += (drawH - rh) / 2;
            } else {
              rw = drawH * imgAspect;
              rx += (drawW - rw) / 2;
            }

            ctx.drawImage(img, rx, ry, rw, rh);
            resolve(canvas.toDataURL('image/jpeg', 0.92));
          } catch (e) {
            console.warn('Canvas export fallback:', e);
            resolve(canvas.toDataURL('image/jpeg', 0.92));
          }
        };
        img.onerror = () => {
          resolve(canvas.toDataURL('image/jpeg', 0.92));
        };
        img.src = heroUrl;
      } else {
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      }
    } catch (err) {
      console.error('Failed to generate car detail card:', err);
      resolve(null);
    }
  });
}
