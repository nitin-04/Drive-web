import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FolderPlus, Folder } from "lucide-react";
import API from "../api/axios";

export default function FolderList({ folders }) {
  const [newFolderName, setNewFolderName] = useState("");
  const { folderId } = useParams();
  const navigate = useNavigate();

  const handleCreate = async () => {
    const name = newFolderName.trim();
    if (!name) return;

    try {
      await API.post("/folder/create", {
        name,
        parent: folderId || null,
      });

      toast.success("Folder created!");
      setNewFolderName("");
      window.location.reload();
    } catch (err) {
      toast.error("Folder creation failed");
      console.error("Folder creation error:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {folderId && (
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-blue-600 hover:underline text-sm font-medium"
        >
          ⬅ Back to Dashboard
        </button>
      )}

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Create a New Folder
      </h2>

      <div className="flex items-center gap-3 max-w-md">
        <input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="Enter folder name"
          className="border border-gray-300 px-4 py-2 rounded-md w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          <FolderPlus size={18} />
          Create
        </button>
      </div>

      <div className="mt-8 space-y-3 max-w-md">
        {Array.isArray(folders) ? (
          folders.length === 0 ? (
            <p className="text-gray-500 italic">No folders found.</p>
          ) : (
            folders.map((folder) => (
              <div
                key={folder._id}
                onClick={() => navigate(`/dashboard/folder/${folder._id}`)}
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
              >
                <Folder className="text-yellow-500" size={22} />
                <span className="font-medium text-gray-700">{folder.name}</span>
              </div>
            ))
          )
        ) : (
          <p className="text-red-500">Error: folders not loaded.</p>
        )}
      </div>
    </div>
  );
}
