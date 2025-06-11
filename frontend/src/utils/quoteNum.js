export const decodeQuoteNumber = (quoteNumber) => {
  const num = BigInt(quoteNumber);
  return {
    customerId: Number((num >> 32n) & 0xFFFFFn),
    status: Number((num >> 30n) & 0x3n),
    major: Number((num >> 10n) & 0xFFFFFn),
    minor: Number(num & 0x3FFn),
  };
};

export const formatQuoteNumber = (quoteNumber) => {
  const { customerId, status, major, minor } = decodeQuoteNumber(quoteNumber);
  return (
    customerId.toString().padStart(5, '0') +
    status.toString() +
    major.toString().padStart(4, '0') +
    minor.toString().padStart(2, '0')
  );
};