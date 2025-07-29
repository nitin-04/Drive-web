import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Trash, Search, ImageOff } from "lucide-react";
import {
  deleteImageById,
  getImagesByFolder,
  searchImages,
} from "../api/imageService";

const ImageGrid = ({ folderId, token, reloadFlag }) => {
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async () => {
    try {
      const results = await searchImages(folderId, searchTerm, token);
      if (!Array.isArray(results) || results.length === 0) {
        toast.info("No images found for this search.");
        setImages([]);
      } else {
        setImages(results);
      }
    } catch (error) {
      toast.error("Search failed");
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imgs = await getImagesByFolder(folderId, token);
        setImages(Array.isArray(imgs) ? imgs : []);
      } catch (error) {
        toast.error("Failed to load images");
        setImages([]);
      }
    };

    if (folderId) fetchImages();
  }, [folderId, reloadFlag]);

  useEffect(() => {
    const fetchAllImages = async () => {
      try {
        const imgs = await getImagesByFolder(folderId, token);
        setImages(Array.isArray(imgs) ? imgs : []);
      } catch {
        toast.error("Failed to reload images");
        setImages([]);
      }
    };

    if (searchTerm === "") {
      fetchAllImages();
    }
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await deleteImageById(id, token);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success("Image deleted");
    } catch (err) {
      toast.error("Failed to delete image");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <input
          type="text"
          placeholder="Search images by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          onClick={handleSearch}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <Search className="w-4 h-4" />
          Search
        </button>
      </div>

      {!Array.isArray(images) || images.length === 0 ? (
        <div className="text-center text-gray-500 mt-20 text-lg flex flex-col items-center gap-2">
          <ImageOff size={32} />
          No images to display
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img) => (
            <div
              key={img._id}
              className="group relative overflow-hidden rounded-lg shadow-md border border-gray-200"
            >
              <img
                src={img.imageUrl}
                alt={img.imageName || "Uploaded Image"}
                className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handleDelete(img._id)}
                  className="text-white hover:text-red-500 bg-black bg-opacity-50 p-2 rounded-full"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-sm text-center py-1 truncate">
                {img.imageName}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
