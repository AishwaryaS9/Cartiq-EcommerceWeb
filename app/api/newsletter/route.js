import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json(
                { message: "Invalid email address" },
                { status: 400 }
            );
        }

        // Check if user already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        });

        if (existing) {
            return NextResponse.json(
                { message: "You are already subscribed!" },
                { status: 409 }
            );
        }

        // Store in DB
        await prisma.newsletterSubscriber.create({
            data: { email }
        });

        return NextResponse.json(
            { message: "Subscribed successfully!" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Newsletter error:", error);

        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
