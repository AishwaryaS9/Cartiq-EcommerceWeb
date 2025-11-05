import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const { favorites } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await prisma.user.update({
            where: { id: userId },
            data: { favorites },
        });

        return NextResponse.json({ message: "Favorites updated" });
    } catch (error) {
        console.error("Favorites POST error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { favorites: true },
        });

        return NextResponse.json({ favorites: user?.favorites || [] });
    } catch (error) {
        console.error("Favorites GET error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
