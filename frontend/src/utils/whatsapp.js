const PHONE_NUMBER = '919913634447';

/**
 * Returns a general WhatsApp link for generic inquiries.
 */
export const getGeneralWhatsAppLink = () => {
  const message = 'Hello Sadguru Car Melo, I would like to know more about your cars.';
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Returns a car-specific WhatsApp link with pre-filled details.
 * @param {Object} car - The car object containing make, model, year, and price.
 */
export const getCarWhatsAppLink = (car) => {
  const title = car.title || `${car.make} ${car.model} ${car.year}`;
  const priceFormatted = typeof car.price === 'number' 
    ? `₹${car.price.toLocaleString('en-IN')}`
    : car.price;
  
  const message = `Hello Sadguru Car Melo, I am interested in the ${title} priced at ${priceFormatted}. Is it still available?`;
  return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
};
