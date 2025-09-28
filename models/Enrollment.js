import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  cloudinaryId: { type: String, required: true },
  name: { type: String },
  size: { type: Number },
});

const enrollmentSchema = new mongoose.Schema(
  {
    hospitalName: { type: String, required: true, trim: true },
    facilityType: { type: String, required: true },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
        }
    },
    contactEmail: { type: String },
    contactPhone: { type: String },
    registrationNumber: { type: String },
    documents: [documentSchema], // Array to store multiple documents
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Optional: for geospatial queries
enrollmentSchema.index({ location: '2dsphere' });

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
export default Enrollment;