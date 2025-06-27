export const decodeQuoteNumber = (quote_no) => {
  const str = quote_no.toString().padStart(8, '0');
  const customerId = parseInt(str.slice(0, str.length - 7));
  const status = parseInt(str.slice(-7, -6));
  const major = parseInt(str.slice(-6, -2));
  const minor = parseInt(str.slice(-2));
  return { customerId, status, major, minor };
};

export const formatQuoteNumber = (quote_no) => {
  const { customerId, status, major, minor } = decodeQuoteNumber(quote_no);
  return (
    customerId.toString().padStart(5, '0') +
    status.toString() +
    major.toString().padStart(4, '0') +
    minor.toString().padStart(2, '0')
  );
};
