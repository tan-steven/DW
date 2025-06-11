// src/utils/quoteNumber.js

// Bit allocations (must match backend)
// 20 bits for customerId (max 1,048,575)
// 2 bits for status (0–3)
// 20 bits for major (max 1,048,575)
// 10 bits for minor (max 1023)

export const encodeQuoteNumber = (customerId, status, major, minor) => {
  return (BigInt(customerId) << 32n) | (BigInt(status) << 30n) | (BigInt(major) << 10n) | BigInt(minor);
};

export const decodeQuoteNumber = (quoteNumber) => {
  const num = BigInt(quoteNumber);
  return {
    customerId: Number((num >> 32n) & 0xFFFFFn),
    status: Number((num >> 30n) & 0x3n),
    major: Number((num >> 10n) & 0xFFFFFn),
    minor: Number(num & 0x3FFn),
  };
};
