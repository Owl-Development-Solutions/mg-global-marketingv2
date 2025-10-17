export const generateUniqueIdentifier = (): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uniqueIdentifier = "";
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueIdentifier += characters.charAt(randomIndex);
  }
  return uniqueIdentifier;
};
