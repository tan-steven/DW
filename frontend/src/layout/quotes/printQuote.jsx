import React from "react";

const PrintQuote = ({ quote }) => {
  // Check if quote and required fields exist
  if (!quote || !quote.quote_no) {
    return <div>No quote data available for printing</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Quote #{quote.quote_no}</h2>
      <p><strong>Date:</strong> {quote.date || 'N/A'}</p>
      <p><strong>Customer:</strong> {quote.customer || 'N/A'}</p>
      <p><strong>Total:</strong> ${quote.total?.toFixed(2) || '0.00'}</p>
      <p><strong>Sub Total:</strong> ${quote.sub_total?.toFixed(2) || '0.00'}</p>

      <h3>Details:</h3>
      {Array.isArray(quote.details) && quote.details.length > 0 ? (
        quote.details.map((line, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <p><strong>Material:</strong> {line.material || 'N/A'}</p>
            <p><strong>Product Type:</strong> {line.product_type || 'N/A'}</p>
            <p><strong>Units:</strong> {line.unit || '0'}</p>
            <p><strong>Size:</strong> {line.width || '0'} x {line.height || '0'}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>No details available</p>
      )}
    </div>
  );
};

export default PrintQuote;