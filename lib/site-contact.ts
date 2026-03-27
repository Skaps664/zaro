export const SITE_CONTACT = {
  email: "info@zaruscents.com",
  phone: "923369911322",
  location: "Peshawar, Pakistan",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "923259327819",
}

export function toWhatsappDigits(value: string) {
  return value.replace(/[^\d]/g, "")
}
