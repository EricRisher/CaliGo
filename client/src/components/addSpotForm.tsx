"use client";
import Image from "next/image";
import { useState } from "react";

export function AddSpotForm({ closeForm }: { closeForm: () => void }) {
  const [spotName, setSpotName] = useState("");
  const [spotDescription, setSpotDescription] = useState("");
  const [spotLocation, setSpotLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);

  // Handle file input change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("spotName", spotName);
    formData.append("spotDescription", spotDescription);
    formData.append("spotLocation", spotLocation);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch("http://localhost:3001/spots", {
        method: "POST",
        body: formData,
        credentials: "include", // Ensure that cookies/credentials are sent
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success, update state, close form, etc.
      } else {
        const errorData = await response.json();
        console.error("Error submitting form:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while adding the spot.");
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
        Fill out the form below to add a new spot to the map.
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
            onChange={(e) => setSpotName(e.target.value)} // Update state on input change
          />
        </div>
        <div>
          <label htmlFor="spotDescription">Description:</label>
          <input
            type="text"
            id="spotDescription"
            name="spotDescription"
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
            value={spotDescription}
            onChange={(e) => setSpotDescription(e.target.value)} // Update state on input change
          />
        </div>
        <div>
          <label htmlFor="spotLocation">Location:</label>
          <input
            type="text"
            id="spotLocation"
            name="spotLocation"
            className="border border-gray-300 rounded w-full py-2 px-3"
            required
            value={spotLocation}
            onChange={(e) => setSpotLocation(e.target.value)} // Update state on input change
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            name="image"
            className="border border-gray-300 rounded w-full py-2 px-3"
            onChange={(e) => setImage(e.target.files?.[0] || null)} // Update state with the selected file
          />
        </div>
        <button
          type="submit"
          className="bg-secondary text-white py-2 px-4 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
}