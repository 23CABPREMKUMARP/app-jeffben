import { NextResponse } from "next/server";
import connectDB from "@/src/lib/db";
import Booking from "@/src/models/Booking";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { token, scannedBy, location } = await req.json();

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 });
    }

    const booking = await Booking.findOne({ qrToken: token }).populate({
      path: "busId",
      populate: { path: "routeId" }
    });

    if (!booking) {
      return NextResponse.json({ success: false, message: "Invalid Ticket - Not Found" }, { status: 404 });
    }

    // Validation Logic
    if (booking.validationStatus === "Used") {
      return NextResponse.json({ 
        success: false, 
        message: "Ticket Already Used", 
        booking: {
          ticketId: booking.ticketId,
          status: "Used",
          usedAt: booking.scanHistory.find((h: any) => h.action === "Validated")?.timestamp
        }
      });
    }

    if (booking.validationStatus === "Cancelled") {
      return NextResponse.json({ success: false, message: "Ticket Cancelled", booking: { ticketId: booking.ticketId } });
    }

    if (booking.validationStatus === "Expired") {
      return NextResponse.json({ success: false, message: "Ticket Expired", booking: { ticketId: booking.ticketId } });
    }

    // Mark as Used
    booking.validationStatus = "Used";
    booking.scanHistory.push({
      scannedBy: scannedBy || "SYSTEM",
      timestamp: new Date(),
      location: location || "Boarding Gate",
      action: "Validated"
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Ticket Validated Successfully",
      booking: {
        ticketId: booking.ticketId,
        bus: booking.busId?.busNumber,
        route: booking.busId?.routeId?.routeName,
        seats: booking.seats,
        boardingPoint: booking.boardingPoint,
        status: "Valid"
      }
    });

  } catch (error) {
    console.error("QR Validation Error:", error);
    return NextResponse.json({ success: false, message: "Server Error during validation" }, { status: 500 });
  }
}
