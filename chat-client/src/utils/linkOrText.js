export const linkOrText = (str) => {
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (urlRegex.test(str)) {
    return "URL";
  } else {
    return "MSG";
  }
};
