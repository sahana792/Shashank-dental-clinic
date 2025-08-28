const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// 2. schema (rules for booking)
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  message: String,
}, { timestamps: true });  // <-- this adds createdAt & updatedAt automatically

// 3. model
const Booking = mongoose.model("Booking", bookingSchema);

// 4. routes

// POST booking
app.post("/book", async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: "Booking saved successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error saving booking" });
  }
});

// GET all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Error fetching bookings" });
  }
});

// DELETE booking by id
app.delete("/bookings/:id", async (req, res) => {
  try {
    const deleted = await Booking.findByIdAndDelete(req.params.id);
    if (deleted) {
      res.json({ message: "Booking deleted successfully!" });
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error deleting booking" });
  }
});
// UPDATE booking by id
app.put("/bookings/:id", async (req, res) => {
  try {
    const updated = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updated) {
      res.json({ message: "Booking updated successfully!" });
    } else {
      res.status(404).json({ error: "Booking not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error updating booking" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Dental Clinic Backend is running on http://localhost:${PORT}`);
});
