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

export const getLevelBonus = (price: number, degree: number): number => {
  if (price === 500) {
    if (degree === 1) return 100;
    if (degree >= 2 && degree <= 3) return 50;
    if (degree >= 4 && degree <= 5) return 25;

    return 0;
  }

  if (price === 3500) {
    if (degree === 1 || degree === 2) return 400;
    if (degree === 3) return 100;
    if (degree === 4 || degree === 5) return 50;
    if (degree >= 6) return 25;

    return 0;
  }

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

  const currentTotal = price === 3500 ? current3500 : current500;

  const firstBonus = price === 3500 ? 400 : 100;
  const maxTotal = price === 3500 ? 550 : 250;

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
