export const imageHeightWidth = (image) => {
  return new Promise((resolve, reject) => {
    if (!image) {
      reject(new Error("No Image Selected!"));
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          resolve({ width, height });
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(image);
    }
  });
};
