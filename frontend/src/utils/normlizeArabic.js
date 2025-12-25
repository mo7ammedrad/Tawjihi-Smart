// utils/normalizeArabic.js
export const normalizeArabic = (str) => {
  if (!str) return "";
  return str.startsWith("ال") ? str.slice(2) : str;
};
