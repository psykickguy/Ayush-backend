import Branch from "../../models/Branch.js";

// Helper function to calculate distance (Haversine Formula)
// Returns distance in Kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";
  
  const R = 6371; // Radius of earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d.toFixed(1) + " km";
};

const deg2rad = (deg) => deg * (Math.PI / 180);

// @desc    Get all hospitals for patient app
// @route   GET /api/patient/hospitals?lat=...&lng=...
export const getHospitals = async (req, res) => {
  try {
    const { lat, lng, search } = req.query; // User's location from App

    // 1. Build Query
    let query = { status: "active" };
    
    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    // 2. Fetch Branches
    const branches = await Branch.find(query);

    // 3. Format Data for App (Add Distance)
    const formattedHospitals = branches.map((branch) => {
      const distance = calculateDistance(
        parseFloat(lat), 
        parseFloat(lng), 
        branch.latitude, 
        branch.longitude
      );

      return {
        _id: branch._id,
        name: branch.name,
        address: branch.address || branch.location,
        specialties: branch.specialties || ["General Ayurveda"],
        rating: branch.rating,
        images: branch.images.length > 0 ? branch.images : ["https://via.placeholder.com/150"],
        distance: distance, // "5.2 km" or "N/A"
        type: branch.type,
        timings: `${branch.workingHours.open} - ${branch.workingHours.close}`
      };
    });

    res.json(formattedHospitals);

  } catch (error) {
    console.error("Error fetching hospitals:", error);
    res.status(500).json({ message: "Server Error" });
  }
};