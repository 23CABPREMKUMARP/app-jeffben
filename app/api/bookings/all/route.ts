import { NextResponse } from "next/server";
import connectDB from "@/src/lib/db";
import Booking from "@/src/models/Booking";
import Bus from "@/src/models/Bus";
import Route from "@/src/models/Route";

export async function GET() {
  try {
    try {
      await connectDB();
    } catch (dbError) {
      console.warn("Matrix Hub Link Offline: Switching to Simulation Data Protocol.");
      // Return empty bookings if DB is disconnected
      return NextResponse.json([]); 
    }

    const bookings = await Booking.find()
      .populate({
        path: "busId",
        populate: { path: "routeId" }
      })
      .sort({ bookingDate: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Critical Matrix Sync Error:", error);
    // Absolute fallback: Return empty so the frontend doesn't crash
    return NextResponse.json([]);
  }
}
