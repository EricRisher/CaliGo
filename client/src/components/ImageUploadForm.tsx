"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

interface ImageUploadFormProps {
  spotId: number;
  apiUrl: string;
  onClose: () => void;
  onUploadSuccess: (uploadedImages: string[]) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  spotId,
  apiUrl,
  onClose,
  onUploadSuccess,
}) => {
  const [images, setImages] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setImages(files);

      // Generate image previews
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls(previews);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!images) {
      setError("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    Array.from(images).forEach((file) => {
      formData.append("images", file);
    });

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/spots/${spotId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      onUploadSuccess(response.data); // Pass uploaded images back to parent
      onClose(); // Close the form after successful upload
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      console.error("Image upload error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed-overlay" onClick={onClose}>
      <div
        className="fixed-modal transition-slide-up-active"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="flex justify-start items-center p-4 border-b">
          <button onClick={onClose} className="cursor-pointer">
            <Image
              src="/icons/close.png"
              alt="Close"
              width={32}
              height={32}
              className="cursor-pointer mr-4"
            />
          </button>
          <h2 className="font-bold mb-0">Add Photos</h2>
        </div>
        <p className="text-gray-600 px-4">
          Select one or more images to upload for this spot. Only logged-in
          users can upload.
        </p>
        {error && <p className="text-red-500 px-4">{error}</p>}
        <form
          className="flex flex-col space-y-4 px-4 py-8"
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor="images" className="block font-medium mb-2">
              Images:
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              className="border border-gray-300 rounded w-full py-2 px-3"
              onChange={handleImageChange}
            />
          </div>
          {previewUrls.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 font-medium">Image Previews:</p>
              <div className="grid grid-cols-2 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative w-full h-40">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="btn-primary">
              Cancel
            </button>
            <button
              type="submit"
              className={`btn-secondary ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ImageUploadForm;
