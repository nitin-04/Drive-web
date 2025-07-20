import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FolderList from "../components/FolderList";
import ImageUpload from "../components/ImageUpload";
import ImageGrid from "../components/ImageGrid";
import API from "../api/axios";

export default function Drive() {
  const { folderId } = useParams();
  const [folders, setFolders] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);
  const token = localStorage.getItem("token");

  const fetchFolders = async () => {
    try {
      const res = await API.get("/folder/my-folders", {
        params: { parent: folderId || null },
        headers: { Authorization: `Bearer ${token}` },
      });

      const foldersData = res?.data?.folders;

      setFolders(Array.isArray(foldersData) ? foldersData : []);
    } catch (err) {
      console.error("Failed to fetch folders", err);
      setFolders([]); // fallback to prevent undefined errors
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
