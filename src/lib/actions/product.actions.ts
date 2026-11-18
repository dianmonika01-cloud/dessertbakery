"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { verifyAdminSession } from "@/lib/services/admin.service";
import { slugify } from "@/lib/utils";
import { ActionResponse } from "./auth.actions";

export async function uploadProductImageAction(
  formData: FormData
): Promise<{ success: boolean; url?: string; message: string }> {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return {
      success: false,
      message: "Akses ditolak. Hanya admin yang dapat mengunggah foto produk.",
    };
  }

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return {
      success: false,
      message: "Pilih file gambar terlebih dahulu.",
    };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    return {
      success: false,
      message: "Format gambar harus berupa JPG, PNG, atau WEBP.",
    };
  }

  const maxSizeInBytes = 4 * 1024 * 1024; // 4 MB
  if (file.size > maxSizeInBytes) {
    return {
      success: false,
      message: "Ukuran file gambar maksimal 4 MB.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `products/${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return {
      success: false,
      message: `Gagal mengunggah gambar: ${uploadError.message}`,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(fileName);

  return {
    success: true,
    url: publicUrl,
    message: "Foto produk berhasil diunggah.",
  };
}

export async function saveProductAction(
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
  const customSlug = String(formData.get("slug") || "").trim();
  const category_id = String(formData.get("category_id") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const price = Number(formData.get("price"));
  const stock = Number(formData.get("stock"));
  const image_url = String(formData.get("image_url") || "").trim();
  const is_best_seller = formData.get("is_best_seller") === "true";
  const is_active = formData.get("is_active") === "true";

  if (!name || !category_id || !description || !image_url) {
    return {
      success: false,
      message: "Nama produk, kategori, deskripsi, dan foto produk wajib diisi.",
    };
  }

  if (Number.isNaN(price) || price < 0) {
    return {
      success: false,
      message: "Harga produk harus berupa angka valid (minimal 0).",
    };
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return {
      success: false,
      message: "Stok produk harus berupa bilangan bulat (minimal 0).",
    };
  }

  const slug = slugify(customSlug || name);
  if (!slug) {
    return {
      success: false,
      message: "Slug produk tidak valid.",
    };
  }

  const supabase = await createServerSupabaseClient();

  const payload = {
    name,
    slug,
    category_id,
    description,
    price,
    stock,
    image_url,
    is_best_seller,
    is_active,
  };

  if (id) {
    const { error } = await supabase
      .from("products")
      .update(payload)
      .eq("id", id);

    if (error) {
      return {
        success: false,
        message: `Gagal memperbarui produk: ${error.message}`,
      };
    }
  } else {
    const { error } = await supabase.from("products").insert(payload);

    if (error) {
      return {
        success: false,
        message: `Gagal menambahkan produk baru: ${error.message}`,
      };
    }
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath(`/menu/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  return {
    success: true,
    message: id
      ? "Data produk berhasil diperbarui."
      : "Produk baru berhasil ditambahkan.",
  };
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  const { isAdmin } = await verifyAdminSession();
  if (!isAdmin) {
    return {
      success: false,
      message: "Akses ditolak. Silakan login sebagai admin.",
    };
  }

  if (!id) {
    return {
      success: false,
      message: "ID produk tidak ditemukan.",
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return {
      success: false,
      message: `Gagal menghapus produk: ${error.message}`,
    };
  }

  revalidatePath("/");
  revalidatePath("/menu");
  revalidatePath("/admin");
  revalidatePath("/admin/products");

  return {
    success: true,
    message: "Produk berhasil dihapus.",
  };
}
