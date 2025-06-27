function encodeQuoteNumber(customerId, status, major, minor) {
  return BigInt(customerId) * 10_000_000n +
         BigInt(status) * 1_000_000n +
         BigInt(major) * 100n +
         BigInt(minor);
}

function decodeQuoteNumber(quote_no) {
  const big = BigInt(quote_no) % 10_000_000n;
  return {
    customerId: BigInt(quote_no) / 10_000_000n,
    status: (big / 1_000_000n) % 10n,
    major: (big / 100n) % 10_000n,
    minor: big % 100n
  };
}


module.exports = {
  encodeQuoteNumber,
  decodeQuoteNumber
};
