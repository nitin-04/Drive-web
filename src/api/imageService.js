import axios from "axios";

export const getImagesByFolder = async (folderId, token) => {
  const res = await axios.get(`/api/images/${folderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //   console.log("res.data.images:", res);

  return res.data.images;
};

export const searchImages = async (folderId, query, token) => {
  const res = await axios.get(`/api/images/${folderId}/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.images;
};

export const deleteImageById = async (imageId, token) => {
  const res = await axios.delete(
    `http://localhost:2000/api/images/${imageId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
