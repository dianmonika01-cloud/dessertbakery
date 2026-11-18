"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/services/admin.service";
import { slugify } from "@/lib/utils";
import { ActionResponse } from "./auth.actions";

export async function saveCategoryAction(
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
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const is_active = formData.get("is_active") === "true";

  if (!name) {
    return {
      success: false,
      message: "Nama kategori wajib diisi.",
    };
  }

  const slug = slugify(name);
  const supabase = await createServerSupabaseClient();

  if (id) {
    const { error } = await supabase
      .from("categories")
      .update({ name, slug, description, is_active })
      .eq("id", id);

    if (error) {
      return {
        success: false,
        message: `Gagal memperbarui kategori: ${error.message}`,
      };
    }
  } else {
    const { error } = await supabase
      .from("categories")
      .insert({ name, slug, description, is_active });

    if (error) {
      return {
        success: false,
        message: `Gagal menambah kategori: ${error.message}`,
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/about");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");

  return {
    success: true,
    message: id
      ? "Kategori berhasil diperbarui."
      : "Kategori baru berhasil ditambahkan.",
  };
}

export async function deleteCategoryAction(
  id: string
): Promise<ActionResponse> {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return {
      success: false,
      message: "Akses ditolak. Silakan login sebagai admin.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    return {
      success: false,
      message:
        "Gagal menghapus kategori. Pastikan tidak ada produk yang masih terhubung ke kategori ini.",
    };
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/about");
  revalidatePath("/admin");
  revalidatePath("/admin/categories");

  return {
    success: true,
    message: "Kategori berhasil dihapus.",
  };
}
