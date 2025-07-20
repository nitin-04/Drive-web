import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const { folderId } = useParams();
  const navigate = useNavigate();

  const fetchFolders = async () => {
    try {
      const res = await axios.get(
        folderId ? `/folder/my-folders/${folderId}` : `/folder/my-folders`
      );
      setFolders(res.data.folders || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load folders");
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    fetchFolders();
  }, [folderId]);

  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      await axios.post("/folder/create", {
        name: newFolderName,
        parentId: folderId || null,
      });
      toast.success("Folder created successfully");
      setNewFolderName("");
      fetchFolders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create folder");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-6">
      <button
        onClick={handleLogout}
        className="px-10 absolute top-4 right-10 py-3 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
      <div className="max-w-4xl min-h-[300px] mx-auto my-10 bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between mt-4 items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">
            Welcome{user ? `, ${user.name || user.email}` : ""} 🎉
          </h1>
        </div>

        <form onSubmit={handleCreateFolder} className="flex gap-4 mb-8">
          <input
            type="text"
            placeholder="New Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Create
          </button>
        </form>

        {folders.length === 0 ? (
          <p className="text-gray-500 text-center">No folders found yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {folders.map((folder) => (
              <div
                key={folder._id}
                className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm hover:cursor-pointer hover:bg-blue-100"
                onClick={() =>
                  navigate(`/dashboard/folder/my-folders/${folder._id}`)
                }
              >
                <h2 className="text-xl font-semibold text-blue-600">
                  📁 {folder.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(folder.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
