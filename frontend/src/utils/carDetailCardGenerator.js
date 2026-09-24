/**
 * Generates a high-definition (900x740) Car Details Summary Image using HTML5 Canvas.
 * Exactly matches the user's specification card layout:
 * - Car Title & Variant / Model Year
 * - Special Offer Price Banner (peach background + bold orange price)
 * - 2x4 Grid of Car Specifications (KMS, Fuel, Transmission, Ownership, Registration, Insurance, Color, Body Type)
 * - Clean pure white background
 *
 * @param {Object} car - The car object
 * @returns {Promise<string>} Data URL of the generated JPEG image
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

      const W = 900;
      const H = 550;
      canvas.width = W;
      canvas.height = H;

      // 1. Pure White Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

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

      const paddingX = 40;
      const contentW = W - paddingX * 2; // 820px

      // 2. Car Make & Model Title
      ctx.fillStyle = '#0f172a';
      ctx.font = '900 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const makeModel = `${car.make || ''} ${car.model || ''}`.trim().toUpperCase();
      ctx.fillText(makeModel || 'CAR DETAILS', paddingX, 52);

      // 3. Variant & Model Year
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const variantStr = (car.variant || '').toUpperCase();
      const yearStr = `Model Year: ${car.year || car.registerYear || car.manufacturingYear || 'N/A'}`;
      const subtitle = variantStr ? `${variantStr} • ${yearStr}` : yearStr;
      ctx.fillText(subtitle, paddingX, 78);

      // 4. Special Offer Price Banner Box
      const priceBoxY = 96;
      const priceBoxH = 76;
      drawRoundRect(paddingX, priceBoxY, contentW, priceBoxH, 12, '#fff7ed', '#fed7aa');

      ctx.fillStyle = '#c2410c';
      ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('SPECIAL OFFER PRICE', paddingX + 22, priceBoxY + 25);

      ctx.fillStyle = '#ea580c';
      ctx.font = '900 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const priceText = car.price ? `₹${Number(car.price).toLocaleString('en-IN')}` : 'Ask for Price';
      ctx.fillText(priceText, paddingX + 22, priceBoxY + 62);

      // 5. Specifications Grid (2 Columns x 4 Rows)
      const specs = [
        {
          label: 'KMS DRIVEN',
          val: car.kms ? `${Number(car.kms).toLocaleString('en-IN')} KM` : 'N/A',
          icon: '🛣️'
        },
        {
          label: 'FUEL TYPE',
          val: car.fuelType || 'Diesel',
          icon: '⛽'
        },
        {
          label: 'TRANSMISSION',
          val: car.transmission || 'Manual',
          icon: '🕹️'
        },
        {
          label: 'OWNERSHIP',
          val: car.owner || '1st Owner',
          icon: '👤'
        },
        {
          label: 'REGISTRATION',
          val: (car.registration || 'GJ-05').toUpperCase(),
          icon: '🏛️'
        },
        {
          label: 'INSURANCE',
          val: car.insurance || 'Valid Insurance',
          icon: '🛡️'
        },
        {
          label: 'COLOR',
          val: (car.color || 'BLACK').toUpperCase(),
          icon: '🎨'
        },
        {
          label: 'BODY TYPE',
          val: (car.bodyType || 'SUV').toUpperCase(),
          icon: '🚗'
        }
      ];

      const gridStartY = 188;
      const cardW = (contentW - 14) / 2; // 403px
      const cardH = 74;
      const gapX = 14;
      const gapY = 10;

      specs.forEach((s, idx) => {
        const col = idx % 2;
        const row = Math.floor(idx / 2);
        const cx = paddingX + col * (cardW + gapX);
        const cy = gridStartY + row * (cardH + gapY);

        // Card Container
        drawRoundRect(cx, cy, cardW, cardH, 12, '#f8fafc', '#e2e8f0');

        // Emoji / Icon
        ctx.font = '22px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
        ctx.fillText(s.icon, cx + 14, cy + 46);

        // Label
        ctx.fillStyle = '#64748b';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(s.label, cx + 52, cy + 28);

        // Value
        ctx.fillStyle = '#0f172a';
        ctx.font = '900 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(String(s.val).substring(0, 24), cx + 52, cy + 54);
      });

      resolve(canvas.toDataURL('image/jpeg', 0.95));
    } catch (err) {
      console.error('Failed to generate car detail card:', err);
      resolve(null);
    }
  });
}
