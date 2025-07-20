import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import { UploadCloud, Loader2 } from "lucide-react";
import API from "../api/axios";

const ImageUpload = ({ folderId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [],
    },
  });

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("No image selected");

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("imageName", selectedFile.name);
    formData.append("folderId", folderId);

    try {
      setUploading(true);
      const res = await API.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Image uploaded!");
      setSelectedFile(null);
      setPreview(null);
      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6 max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed p-8 rounded-lg text-center transition ${
          isDragActive ? "border-green-500 bg-green-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 mb-2">
          {isDragActive ? "Drop the image here..." : "Drag & Drop files here"}
        </p>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          Browse Files
        </button>
      </div>

      {preview && (
        <div className="mt-4 flex items-center gap-4">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded shadow"
          />
          <div>
            {!uploading ? (
              <button
                onClick={handleUpload}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700"
              >
                <UploadCloud size={18} />
                Upload
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 text-gray-600 animate-pulse">
                <Loader2 size={18} className="animate-spin" />
                Uploading...
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
