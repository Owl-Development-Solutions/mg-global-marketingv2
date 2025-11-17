export const generateUniqueIdentifier = (length: number): string => {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uniqueIdentifier = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueIdentifier += characters.charAt(randomIndex);
  }
  return uniqueIdentifier;
};

export const generateCodes = (existingCodes: Set<string>, count: number) => {
  const generated = new Set();
  const existing = new Set(existingCodes);

  while (generated.size < count) {
    const code = generateUniqueIdentifier(9);

    //only add if not in existing array and not already generated new
    if (!existing.has(code) && !generated.has(code)) {
      generated.add(code);
    }
  }

  return Array.from(generated);
};
