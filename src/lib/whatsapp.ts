type WhatsAppSettings = {
  siteName: string;
  tagline: string;
  phone: string;
  whatsappNumber: string;
};

export function buildWhatsAppSupportMessage(settings: WhatsAppSettings) {
  return `Assalamu Alaikum, I am contacting ${settings.siteName} – ${settings.tagline}. I need help with a product. I will send the product screenshot, name, or link here. For urgent support, the contact number shown on the website is ${settings.phone}.`;
}

export function buildWhatsAppSupportLink(settings: WhatsAppSettings) {
  const number = settings.whatsappNumber.replace(/\D/g, '');
  return `https://wa.me/${number}?text=${encodeURIComponent(buildWhatsAppSupportMessage(settings))}`;
}
