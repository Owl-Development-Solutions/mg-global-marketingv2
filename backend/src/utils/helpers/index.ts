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

export const getLevelBonus = (degree: number): number => {
  console.log("degree", degree);

  if (degree >= 1 && degree <= 2) return 50;
  if (degree >= 3 && degree <= 4) return 25;
  if (degree === 5) return 25;
  return 0;
};

export const getDirectBonus = (price: number): number => {
  if (price === 500) return 100;
  if (price === 3500) return 400;
  return 0;
};

export const getIndirectBonus = ({
  price,
  current500,
  current3500,
}: {
  price: number;
  current500: number;
  current3500: number;
}): number => {
  console.log(price, current500, current3500);

  if (price === 0) return 0;

  const currentTotal = price === 3500 ? current3500 : current500;

  const firstBonus = price === 3500 ? 50 : 50;
  const maxTotal = price === 3500 ? 150 : 150;

  if (currentTotal >= maxTotal) return 0;

  if (currentTotal === 0) {
    return firstBonus;
  }

  if (currentTotal === firstBonus || currentTotal === firstBonus + 50) {
    return 50;
  }

  if (currentTotal === firstBonus + 100 || currentTotal === firstBonus + 125) {
    return 25;
  }

  return 0;
};
