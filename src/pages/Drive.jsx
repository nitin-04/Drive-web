import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FolderList from "../components/FolderList";
import ImageUpload from "../components/ImageUpload";
import ImageGrid from "../components/ImageGrid"; // ✅ Import your ImageGrid component

export default function Drive() {
  const { folderId } = useParams();
  const [folders, setFolders] = useState([]);
  const token = localStorage.getItem("token");
  const [reloadFlag, setReloadFlag] = useState(false);

  const fetchFolders = async () => {
    try {
      const res = await axios.get("/api/folder/my-folders", {
        params: { parent: folderId || null },
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(res.data.folders);
    } catch (err) {
      console.error("Failed to fetch folders", err);
      setFolders([]);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, [folderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        My Drive
      </h1>

      <FolderList folders={folders} />
      <ImageUpload
        folderId={folderId}
        authToken={token}
        onUploadSuccess={() => {
          setReloadFlag((prev) => !prev);
        }}
      />
      <ImageGrid folderId={folderId} token={token} reloadFlag={reloadFlag} />
    </div>
  );
}
