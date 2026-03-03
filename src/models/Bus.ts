import mongoose from "mongoose";

const BusSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 4.5 },
    seats: { type: Number, required: true },
    amenities: [String],
    from: { type: String, required: true },
    to: { type: String, required: true },
});

export default mongoose.models.Bus || mongoose.model("Bus", BusSchema);
