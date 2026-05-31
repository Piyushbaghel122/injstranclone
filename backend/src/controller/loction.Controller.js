
import locationModel from "../models/location.models.js";

export async function createLocation(req, res) {
  try {
    const { location, latitude, longitude, userId } = req.body;
    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!location || Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({
        message: "Location, latitude and longitude are required",
      });
    }

    const savedLocation = await locationModel.create({
      location,
      latitude: lat,
      longitude: lng,
      coordinates: {
        type: "Point",
        coordinates: [lng, lat],
      },
      userId,
    });

    return res.status(201).json({
      message: "Location saved successfully",
      location: savedLocation,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Location save failed",
      error: error.message,
    });
  }
}

export async function getLocations(req, res) {
  try {
    const locations = await locationModel
      .find()
      .sort({ createdAt: -1 })
      .limit(100);

    return res.status(200).json({
      message: "Locations fetched successfully",
      count: locations.length,
      locations,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Locations fetch failed",
      error: error.message,
    });
  }
}
