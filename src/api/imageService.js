import API from "./axios";

export const getImagesByFolder = async (folderId, token) => {
  const res = await API.get(`/images/${folderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  //   console.log("res.data.images:", res);

  return res.data.images;
};

export const searchImages = async (folderId, query, token) => {
  const res = await API.get(`/images/${folderId}/search?query=${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.images || [];
};

export const deleteImageById = async (imageId, token) => {
  const res = await API.delete(`/images/${imageId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data || [];
};
