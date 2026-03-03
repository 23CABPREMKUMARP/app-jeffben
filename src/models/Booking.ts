import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    busId: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    seats: [{ type: String, required: true }],
    totalAmount: { type: Number, required: true },
    paymentId: { type: String },
    status: { type: String, enum: ["pending", "confirmed", "failed"], default: "pending" },
    bookingDate: { type: Date, default: Date.now },
    passengerDetails: {
        name: String,
        email: String,
        phone: String,
    }
});

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
