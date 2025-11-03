import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";
import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";

export async function PATCH(request, { params }) {
  try {
    const { userId } = getAuth(request);
    console.log("User ID:", userId);
    const storeId = await authSeller(userId);
    console.log("Store ID:", storeId);
    const { id } = params;
    console.log("Product ID:", id);

    if (!storeId) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";
    let fields = {};
    let image = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      fields = {
        name: formData.get("name"),
        description: formData.get("description"),
        mrp: formData.get("mrp"),
        price: formData.get("price"),
        category: formData.get("category"),
        inStock: formData.get("inStock"),
      };
      image = formData.get("image");
    } else if (contentType.includes("application/json")) {
      fields = await request.json();
    } else {
      return NextResponse.json(
        { error: 'Unsupported Content-Type. Use "multipart/form-data" or "application/json".' },
        { status: 400 }
      );
    }

    // Ensure the product belongs to this store
    const product = await prisma.product.findFirst({
      where: { id, storeId },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let updatedImages = product.images;

    // Replace image if new one uploaded
    if (image && typeof image !== "string") {
      const buffer = Buffer.from(await image.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: image.name,
        folder: "products",
      });

      const optimizedImage = imagekit.url({
        path: uploadResponse.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });

      updatedImages = [optimizedImage];
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: fields.name ?? product.name,
        description: fields.description ?? product.description,
        mrp: fields.mrp ? parseFloat(fields.mrp) : product.mrp,
        price: fields.price ? parseFloat(fields.price) : product.price,
        category: fields.category ?? product.category,
        inStock:
          fields.inStock !== undefined
            ? fields.inStock === "true" || fields.inStock === true
            : product.inStock,
        images: updatedImages,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("PATCH /store/product/[id] error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
