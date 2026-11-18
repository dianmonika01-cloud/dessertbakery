"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/services/admin.service";
import { sanitizeWhatsAppNumber } from "@/lib/utils";
import { ActionResponse } from "./auth.actions";

export async function updateSiteSettingsAction(
  formData: FormData
): Promise<ActionResponse> {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return {
      success: false,
      message: "Akses ditolak. Silakan login sebagai admin.",
    };
  }

  const id = String(formData.get("id") || "").trim();
  const store_name = String(formData.get("store_name") || "").trim();
  const tagline = String(formData.get("tagline") || "").trim();
  const rawWhatsApp = String(formData.get("whatsapp_number") || "").trim();
  const instagram_handle = String(
    formData.get("instagram_handle") || ""
  ).trim();
  const address = String(formData.get("address") || "").trim();
  const operating_hours = String(formData.get("operating_hours") || "").trim();
  const about_story = String(formData.get("about_story") || "").trim();
  const about_philosophy = String(
    formData.get("about_philosophy") || ""
  ).trim();

  if (!store_name || !rawWhatsApp) {
    return {
      success: false,
      message: "Nama toko dan nomor WhatsApp wajib diisi.",
    };
  }

  const whatsapp_number = sanitizeWhatsAppNumber(rawWhatsApp);
  if (whatsapp_number.length < 9) {
    return {
      success: false,
      message: "Format nomor WhatsApp tidak valid (minimal 9 digit angka).",
    };
  }

  const supabase = await createServerSupabaseClient();

  const payload = {
    store_name,
    tagline,
    whatsapp_number,
    instagram_handle,
    address,
    operating_hours,
    about_story,
    about_philosophy,
  };

  if (id) {
    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", id);

    if (error) {
      return {
        success: false,
        message: `Gagal menyimpan pengaturan: ${error.message}`,
      };
    }
  } else {
    const { error } = await supabase.from("site_settings").insert(payload);

    if (error) {
      return {
        success: false,
        message: `Gagal membuat pengaturan toko: ${error.message}`,
      };
    }
  }

  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/checkout");
  revalidatePath("/admin/settings");

  return {
    success: true,
    message:
      "Pengaturan informasi toko dan nomor WhatsApp berhasil diperbarui.",
  };
}
