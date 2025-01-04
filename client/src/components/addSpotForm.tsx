"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export function AddSpotForm({ closeForm }: { closeForm: () => void }) {
  const [spotName, setSpotName] = useState("");
  const [spotDescription, setSpotDescription] = useState("");
  const [spotCoordinates, setSpotCoordinates] = useState(""); // Combined lat, long input
  const [coordinatesError, setCoordinatesError] = useState<string | null>(null); // Error for validation
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For preview
  const [isSubmitting, setIsSubmitting] = useState(false); // State to track submission

  // Disable scrolling when the form is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = ""; // Restore scrolling when component unmounts
    };
  }, []);

  // Validate coordinates format dynamically
  const validateCoordinates = (value: string) => {
    const coords = value.split(",").map((coord) => coord.trim());
    if (
      coords.length !== 2 ||
      isNaN(Number(coords[0])) ||
      isNaN(Number(coords[1]))
    ) {
      setCoordinatesError("Please use the format: 'latitude, longitude'.");
    } else {
      const latitude = parseFloat(coords[0]);
      const longitude = parseFloat(coords[1]);
      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        setCoordinatesError(
          "Latitude must be between -90 and 90. Longitude must be between -180 and 180."
        );
      } else {
        setCoordinatesError(null); // Clear error if valid
      }
    }
  };

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);

      // Generate a preview URL
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if there are validation errors
    if (coordinatesError) {
      alert("Please fix errors before submitting.");
      return;
    }

    setIsSubmitting(true); // Set submission state

    const coords = spotCoordinates
      .split(",")
      .map((coord: string) => coord.trim());
    const latitude = parseFloat(coords[0]);
    const longitude = parseFloat(coords[1]);
    const location = `${latitude},${longitude}`; // Concatenate to form location string

    const formData = new FormData();
    formData.append("spotName", spotName);
    formData.append("description", spotDescription);
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());
    formData.append("location", location); // Append location here

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/spots`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        closeForm(); // Optionally close the form on success
      } else {
        const errorData = await response.json();
        console.error("Error submitting form:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while adding the spot.");
    } finally {
      setIsSubmitting(false); // Reset submission state after completion
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="flex align-middle">
        <button onClick={closeForm} className="flex justify-end">
          <Image
            src="/icons/close.png"
            alt="Close"
            width={32}
            height={32}
            className="cursor-pointer mr-5"
          />
        </button>
        <h2 className="m-0">Add a Spot!</h2>
      </div>
      <p className="text-gray-600">
        Fill out the form below to add a new spot to the map. All fields are
        required
      </p>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="spotName">Name:</label>
          <input
            type="text"
            id="spotName"
            name="spotName"
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
            value={spotName}
            onChange={(e) => setSpotName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="spotCoordinates">Coordinates (lat, long):</label>
          <input
            type="text"
            id="spotCoordinates"
            name="spotCoordinates"
            className={`border ${
              coordinatesError ? "border-red-500" : "border-gray-300"
            } rounded w-full py-2 px-3`}
            required
            value={spotCoordinates}
            onChange={(e) => {
              setSpotCoordinates(e.target.value);
              validateCoordinates(e.target.value); // Validate on each change
            }}
          />
          {coordinatesError && (
            <p className="text-red-500 text-sm mt-1">{coordinatesError}</p>
          )}
        </div>
        <div>
          <label htmlFor="spotDescription">Description:</label>
          <textarea
            id="spotDescription"
            name="spotDescription"
            className="border border-gray-300 rounded w-full py-2 px-3"
            rows={4}
            required
            value={spotDescription}
            onChange={(e) => setSpotDescription(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            className="border border-gray-300 rounded w-full py-2 px-3"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-4 m-auto ">
              <p>Image Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded"
              />
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`bg-secondary text-white py-2 px-4 rounded-lg ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
