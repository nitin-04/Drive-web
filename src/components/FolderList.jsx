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
    if (!newFolderName.trim()) return;

    try {
      await API.post("/folder/create", {
        name: newFolderName,
        parent: folderId || null,
      });

      toast.success("Folder created!");
      setNewFolderName("");
      window.location.reload();
    } catch (err) {
      toast.error("Folder creation failed");
      console.error(err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {folderId && (
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 text-blue-600 hover:underline absolute top-4 left-4"
        >
          ⬅ Back to Dashboard
        </button>
      )}

      <div className="mt-6 flex items-center gap-2 w-5">
        <input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          className="border px-3 py-1 rounded-md flex-1"
        />
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1.5 rounded-md hover:bg-green-700 transition"
        >
          <FolderPlus size={18} />
          Create
        </button>
      </div>

      <div className="space-y-2 w-80 mt-6">
        {Array.isArray(folders) ? (
          folders.length === 0 ? (
            <p className="text-gray-500">No folders found.</p>
          ) : (
            folders.map((folder) => (
              <div
                key={folder._id}
                onClick={() => navigate(`/dashboard/folder/${folder._id}`)}
                className="flex items-center gap-2 bg-gray-300 p-3 rounded-lg hover:bg-blue-200 hover:text-blue-700 cursor-pointer transition"
              >
                <Folder className="text-yellow-500" size={20} />
                {folder.name}
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
