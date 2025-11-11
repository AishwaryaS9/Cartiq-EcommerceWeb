import imagekit from "@/configs/imageKit";
import prisma from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const productId = formData.get("id");
        if (!productId) {
            return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
        }

        // Verify ownership
        const existingProduct = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!existingProduct || existingProduct.storeId !== storeId) {
            return NextResponse.json({ error: "Unauthorized or Product not found" }, { status: 403 });
        }

        // Extract product fields
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = Number(formData.get("mrp"));
        const price = Number(formData.get("price"));
        const stockQuantity = Number(formData.get("stockQuantity"));
        const category = formData.get("category");

        const replaceImages = formData.get("replaceImages") === "true";
        const removedImages = formData.get("removedImages")
            ? JSON.parse(formData.get("removedImages"))
            : [];
        const newImages = formData.getAll("images");

        let updatedImages = existingProduct.images || [];

        // Step 1: Remove deleted images
        if (removedImages.length > 0) {
            updatedImages = updatedImages.filter((url) => !removedImages.includes(url));
        }

        // Step 2: Upload new images if present
        if (newImages && newImages.length > 0 && newImages[0].size > 0) {
            const imagesUrl = await Promise.all(
                newImages.map(async (image) => {
                    const buffer = Buffer.from(await image.arrayBuffer());
                    const response = await imagekit.upload({
                        file: buffer,
                        fileName: image.name,
                        folder: "products",
                    });
                    const url = imagekit.url({
                        path: response.filePath,
                        transformation: [
                            { quality: "auto" },
                            { format: "webp" },
                            { width: "1024" },
                        ],
                    });
                    return url;
                })
            );

            // Replace or append based on mode
            updatedImages = replaceImages ? imagesUrl : [...updatedImages, ...imagesUrl];
        }

        // Step 3: Validation — at least one image must remain
        if (!updatedImages || updatedImages.length === 0) {
            return NextResponse.json(
                { error: "At least one product image must be present." },
                { status: 400 }
            );
        }

        // Step 4: Update product in DB
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                mrp,
                price,
                stockQuantity,
                category,
                images: updatedImages,
            },
        });

        return NextResponse.json({
            message: "Product updated successfully",
            product: updatedProduct,
        });
    } catch (error) {
        console.error("Product Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
