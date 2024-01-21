import axios from "axios";

export const imgbbUploader = async (image) => {
  const imageData = new FormData();
  imageData.append("image", image);
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imgbb_API}`,
    imageData
  );
  return data.data.display_url;
};
