/**
 * @file frontend/src/utils/whatsapp.js
 * @description Dynamic WhatsApp link generators synchronized with live dealership contact details.
 */

export const getActiveWhatsAppNumber = () => {
  try {
    const saved = localStorage.getItem('dealership_contact');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.phone) {
        const digits = String(parsed.phone).replace(/\D/g, '');
        if (digits.length === 10) return `91${digits}`;
        if (digits.length > 10) return digits;
      }
    }
  } catch {
    // Fallback
  }
  return '919876543210';
};

/**
 * Returns a general WhatsApp link for generic inquiries.
 */
export const getGeneralWhatsAppLink = () => {
  const phone = getActiveWhatsAppNumber();
  const message = 'Hello Sadguru Car Surat, I would like to know more about your cars.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Returns a car-specific WhatsApp link with pre-filled details.
 * @param {Object} car - The car object containing make, model, year, and price.
 */
export const getCarWhatsAppLink = (car) => {
  const phone = getActiveWhatsAppNumber();
  const title = car.title || `${car.make} ${car.model} ${car.year}`;
  const priceFormatted =
    typeof car.price === 'number'
      ? `₹${car.price.toLocaleString('en-IN')}`
      : car.price;

  const message = `Hello Sadguru Car Surat, I am interested in the ${title} priced at ${priceFormatted}. Is it still available?`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};

/**
 * Builds any custom WhatsApp link using the active dealership phone number.
 * @param {string} [message] - Message string (pre-encoded or raw)
 */
export const buildWhatsAppUrl = (message = '') => {
  const phone = getActiveWhatsAppNumber();
  return `https://wa.me/${phone}${message ? `?text=${message.startsWith('%') ? message : encodeURIComponent(message)}` : ''}`;
};

