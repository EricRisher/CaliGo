const { Spot } = require("../models"); // Adjust path to your models
const axios = require("axios");

const fetchCityFromCoordinates = async (latitude, longitude) => {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
    );

    const city =
      response.data.results[0]?.address_components.find((component) =>
        component.types.includes("locality")
      )?.long_name ||
      response.data.results[0]?.address_components.find((component) =>
        component.types.includes("administrative_area_level_1")
      )?.long_name ||
      response.data.results[0]?.address_components.find((component) =>
        component.types.includes("sublocality")
      )?.long_name;

    return city || "Unknown Location";
  } catch (error) {
    console.error(
      `Error fetching city for (${latitude}, ${longitude}):`,
      error.message
    );
    return "Unknown Location";
  }
};

const populateCityField = async () => {
  try {
    const spots = await Spot.findAll(); // Fetch all spots
    console.log(`Fetched ${spots.length} spots for processing.`);

    for (const spot of spots) {
      if (
        !spot.city ||
        spot.city === "Unknown Location" ||
        spot.city.trim() === ""
      ) {
        // Only update spots with a null or "Unknown Location" city field
        const cityName = await fetchCityFromCoordinates(
          spot.latitude,
          spot.longitude
        );

        // Update the city field
        spot.city = cityName;
        await spot.save();
        console.log(`Updated spot ${spot.id} with city: ${cityName}`);
      }
    }

    console.log("City field population complete!");
  } catch (error) {
    console.error("Error populating city field:", error.message);
  }
};

populateCityField();
