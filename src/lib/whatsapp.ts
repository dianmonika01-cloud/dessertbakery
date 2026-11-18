import { CartItem, CheckoutFormData } from "@/types/database";
import { formatRupiah, sanitizeWhatsAppNumber } from "@/lib/utils";

interface BuildWhatsAppOrderParams {
  storeName: string;
  adminWhatsAppNumber: string;
  customer: CheckoutFormData;
  items: CartItem[];
  totalAmount: number;
}

/**
 * Menyusun teks pesan pesanan WhatsApp yang rapi dan terstruktur
 */
export function buildWhatsAppOrderMessage({
  storeName,
  customer,
  items,
  totalAmount,
}: Omit<BuildWhatsAppOrderParams, "adminWhatsAppNumber">): string {
  const orderDate = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  const itemLines = items
    .map((item, idx) => {
      const lineTotal = Number(item.product.price) * item.quantity;
      return `${idx + 1}. *${item.product.name}*\n   ${item.quantity} x ${formatRupiah(
        Number(item.product.price)
      )} = ${formatRupiah(lineTotal)}`;
    })
    .join("\n\n");

  const notesText = customer.orderNotes.trim()
    ? customer.orderNotes.trim()
    : "-";

  return [
    `Halo *${storeName}*, saya ingin melakukan pemesanan produk melalui website:`,
    "",
    "*DATA PEMESAN*",
    `Nama: ${customer.customerName.trim()}`,
    `No. Telepon/WA: ${customer.phoneNumber.trim()}`,
    `Alamat Pengiriman: ${customer.deliveryAddress.trim()}`,
    `Catatan Pesanan: ${notesText}`,
    `Waktu Pesan: ${orderDate}`,
    "",
    "*RINCIAN PESANAN*",
    itemLines,
    "",
    "--------------------------------",
    `*TOTAL PEMBAYARAN: ${formatRupiah(totalAmount)}*`,
    "--------------------------------",
    "",
    "Mohon informasi ketersediaan pesanan dan instruksi pembayaran selanjutnya. Terima kasih.",
  ].join("\n");
}

/**
 * Menghasilkan URL WhatsApp Click to Chat dengan URL encoding yang benar
 */
export function generateWhatsAppCheckoutUrl(
  params: BuildWhatsAppOrderParams
): string {
  const cleanAdminPhone = sanitizeWhatsAppNumber(params.adminWhatsAppNumber);
  const message = buildWhatsAppOrderMessage({
    storeName: params.storeName,
    customer: params.customer,
    items: params.items,
    totalAmount: params.totalAmount,
  });

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanAdminPhone}?text=${encodedMessage}`;
}
