import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Spot {
  id: number;
  spotName: string;
  description: string;
  location: string;
  image: string;
  creator: {
    id: number;
  };
}

interface User {
  id: number;
}

function EditSpotForm({
  spot,
  closeForm,
  loggedInUser,
}: {
  spot: Spot;
  closeForm: () => void;
  loggedInUser: User | null; // Add logged-in user prop
}) {
  const [spotName, setSpotName] = useState(spot.spotName);
  const [spotDescription, setSpotDescription] = useState(spot.description);
  const [spotCoordinates, setSpotCoordinates] = useState(spot.location);
  const [image, setImage] = useState<File | null>(null);

  // Validate ownership
  const isOwner = loggedInUser?.id === spot.creator.id;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOwner) {
      alert("You are not authorized to edit this spot.");
      return;
    }

    // Validate location format: "latitude, longitude"
    const coords = spotCoordinates.split(",").map((coord) => coord.trim());
    if (
      coords.length !== 2 ||
      isNaN(Number(coords[0])) ||
      isNaN(Number(coords[1]))
    ) {
      alert("Please enter location in 'latitude, longitude' format.");
      return;
    }

    const latitude = parseFloat(coords[0]);
    const longitude = parseFloat(coords[1]);

    const formData = new FormData();
    formData.append("spotName", spotName);
    formData.append("description", spotDescription);
    formData.append("latitude", latitude.toString());
    formData.append("longitude", longitude.toString());
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spots/${spot.id}`,
        {
          method: "PUT",
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Spot updated successfully!");
        closeForm(); // Close the form on success
      } else {
        const errorData = await response.json();
        console.error("Error updating spot:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating spot:", error);
      alert("An error occurred while updating the spot.");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this spot?")) {
      return; // Exit if the user cancels
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/spots/${spot.id}`,
        {
          method: "DELETE",
          credentials: "include", // Ensure credentials are sent
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        alert("Spot deleted successfully!");
        closeForm(); // Close the form
        location.reload();
      } else {
        const errorData = await response.json();
        console.error("Error deleting spot:", errorData.error);
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting spot:", error);
      alert("An error occurred while deleting the spot.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-end z-50 mx-auto">
      <div className="bg-white w-full max-w-[100vw] rounded-t-lg p-6">
        <div className="flex justify-between items-center">
          <button onClick={closeForm}>
            <Image src="/icons/close.png" alt="Close" width={24} height={24} />
          </button>
        </div>
        <div className="rounded-lg mt-4">
          <button
            type="button"
            className="flex flex-row p-2 justify-end bg-slate-200 rounded-lg"
            onClick={handleDelete}
          >
            <Image
              src="/icons/delete.png"
              alt="Delete"
              width={24}
              height={24}
              className="cursor-pointer mr-2"
            />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditSpotForm;
