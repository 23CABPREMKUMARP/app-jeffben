import { NextResponse } from "next/server";
import connectDB from "@/src/lib/db";
import Bus from "@/src/models/Bus";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    try {
        await connectDB();
        const buses = await Bus.find({ from, to });

        if (buses.length > 0) {
            return NextResponse.json(buses);
        }
    } catch (error) {
        console.error("Database error:", error);
    }

    // Fallback to dummy data if DB fails or is empty
    const dummyBuses = [
        {
            id: "1",
            name: "Express Connect",
            type: "A/C Sleeper (2+1)",
            departure: "09:30 PM",
            arrival: "06:00 AM",
            price: 1250,
            rating: 4.8,
            seats: 12,
            amenities: ["WiFi", "Water", "Snacks", "Charging"],
        },
        {
            id: "2",
            name: "Royal Travels",
            type: "Scania Multi-Axle A/C Semi-Sleeper",
            departure: "10:00 PM",
            arrival: "07:30 AM",
            price: 950,
            rating: 4.5,
            seats: 24,
            amenities: ["Water", "Charging", "Movie"],
        },
    ];

    return NextResponse.json(dummyBuses);
}
