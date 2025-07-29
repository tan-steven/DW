import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "./axiosConfig";

const PrintQuote = () => {
  const { type, quote_no } = useParams();
  const [record, setRecord] = useState(null);
  const [details, setDetails] = useState([]);
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let basePath = "";
      switch (type) {
        case "order":
          basePath = "/api/orders";
          break;
        case "invoice":
          basePath = "/api/invoices";
          break;
        default:
          basePath = "/api/quotes";
      }

      try {
        const rRes = await axios.get(`${basePath}/quote-no/${quote_no}`);
        const dRes = await axios.get(`${basePath}/${quote_no}`);
        
        const quoteStr = quote_no.toString();
        let customerId
        if (quoteStr.length >= 7) {
            const customerPart = quoteStr.substring(0, quoteStr.length - 7);
            customerId = parseInt(customerPart);
        }
        // Fetch customer information if available
        if (customerId){
          axios
            .get(`/api/customers`)
            .then((res) => {
              const customerRes = res.data.find(c => c.id == customerId);
              setCustomerInfo(customerRes);
            })
            .catch((err) => console.error("Error fetching customer", err));
        }

        setRecord(rRes.data);
        setDetails(dRes.data);

        setTimeout(() => window.print(), 500);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [type, quote_no]);

  if (!record) return <div>Loading...</div>;

  return (
    <div style={{ 
      padding: "40px", 
      fontFamily: "Arial, sans-serif", 
      color: "#000",
      maxWidth: "8.5in",
      margin: "0 auto",
      backgroundColor: "#fff"
    }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 40 }}>
        <div>
          <h1 style={{ 
            fontSize: 28, 
            fontWeight: "bold", 
            margin: 0,
            fontFamily: "Times New Roman, serif"
          }}>
            Diamond
          </h1>
          <div style={{ fontSize: 11, marginTop: 5, lineHeight: 1.3 }}>
            <div>99 EAST COTTAGE STREET</div>
            <div>BOSTON, MA 02125</div>
            <div>USA</div>
            <div>Phone: (617) 282-1688</div>
          </div>
        </div>
        
        <div style={{ textAlign: "right", fontSize: 11 }}>
          <div style={{ marginBottom: 3 }}><strong>{type.toUpperCase()}: {record.quote_no}</strong></div>
          <div style={{ marginBottom: 3 }}><strong>ORDER: {record.quote_no}</strong></div>
          <div style={{ marginBottom: 3 }}><strong>ORDER DATE: {new Date(record.date).toLocaleDateString()}</strong></div>
          {record.delivery_date && (
            <div><strong>EST. DELIVERY DATE: {new Date(record.delivery_date).toLocaleDateString()}</strong></div>
          )}
        </div>
      </div>

      {/* Document Title */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ fontSize: 18, fontWeight: "bold", margin: 0 }}>
          {type.toUpperCase()}
        </h2>
      </div>

      {/* Information Sections */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 11 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>{type.toUpperCase()} INFORMATION</div>
          <div>Diamond Windows & Doors Mfg., Inc.</div>
          <div>99 East Cottage St</div>
          <div>Boston, MA 02125</div>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>SHIPPING INFORMATION</div>
          {customerInfo ? (
            <>
              <div>{customerInfo.company}</div>
              <div>{customerInfo.name}</div>
              <div>{customerInfo.address}</div>
            </>
          ) : (
            <>
              <div>Customer: {record.customer}</div>
              <div>Address: {}</div>
            </>
          )}
        </div>
      </div>

      {/* Ship Via */}
      <div style={{ marginBottom: 20, fontSize: 11 }}>
        <strong>SHIP VIA:</strong> TBD
      </div>

      {/* Table Header */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 20 }}>
        <thead>
          <tr style={{ backgroundColor: "#666", color: "white" }}>
            <th style={{ padding: "8px 4px", textAlign: "left", border: "1px solid #000", width: "60px" }}>{type.toUpperCase()}</th>
            <th style={{ padding: "8px 4px", textAlign: "left", border: "1px solid #000", width: "80px" }}>{type.toUpperCase()} DATE</th>
            <th style={{ padding: "8px 4px", textAlign: "left", border: "1px solid #000", width: "80px" }}>PO NUMBER</th>
            <th style={{ padding: "8px 4px", textAlign: "left", border: "1px solid #000", width: "100px" }}>CUSTOMER REF</th>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000" }}>TERMS</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <td style={{ padding: "8px 4px", border: "1px solid #000" }}>{record.quote_no}</td>
            <td style={{ padding: "8px 4px", border: "1px solid #000" }}>{new Date(record.date).toLocaleDateString()}</td>
            <td style={{ padding: "8px 4px", border: "1px solid #000" }}>{record.po_number || ""}</td>
            <td style={{ padding: "8px 4px", border: "1px solid #000" }}>{record.customer}</td>
            <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000" }}>Net 30 DAYS</td>
          </tr>
        </tbody>
      </table>

      {/* Items Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ backgroundColor: "#666", color: "white" }}>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000", width: "40px" }}>ITEM</th>
            <th style={{ padding: "8px 4px", textAlign: "left", border: "1px solid #000" }}>DESCRIPTION</th>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000", width: "40px" }}>QTY</th>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000", width: "40px" }}>QTY B/O</th>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000", width: "40px" }}>QTY PRV</th>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000", width: "40px" }}>QTY INV</th>
            <th style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #000", width: "80px" }}>SIZE</th>
            <th style={{ padding: "8px 4px", textAlign: "right", border: "1px solid #000", width: "70px" }}>PRICE</th>
            <th style={{ padding: "8px 4px", textAlign: "right", border: "1px solid #000", width: "80px" }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, i) => (
            <React.Fragment key={i}>
              <tr style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #ccc", verticalAlign: "top" }}>
                  {i + 1}
                </td>
                <td style={{ padding: "8px 4px", border: "1px solid #ccc", verticalAlign: "top" }}>
                  <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                    {item.product_line} {item.product_type}
                  </div>
                </td>
                <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #ccc", verticalAlign: "top" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #ccc", verticalAlign: "top" }}>
                  0
                </td>
                <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #ccc", verticalAlign: "top" }}>
                  0
                </td>
                <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #ccc", verticalAlign: "top" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "center", border: "1px solid #ccc", verticalAlign: "top" }}>
                  {item.width} {item.width < 12 ? '1/' : ''}{item.width % 12 > 0 ? (item.width % 12) : ''} W X {item.height} {item.height < 12 ? '1/' : ''}{item.height % 12 > 0 ? (item.height % 12) : ''} H
                </td>
                <td style={{ padding: "8px 4px", textAlign: "right", border: "1px solid #ccc", verticalAlign: "top" }}>
                  ${parseFloat(item.price).toFixed(2)}
                </td>
                <td style={{ padding: "8px 4px", textAlign: "right", border: "1px solid #ccc", verticalAlign: "top" }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
              <tr style={{ backgroundColor: i % 2 === 0 ? "#f9f9f9" : "white" }}>
                <td style={{ border: "1px solid #ccc" }}></td>
                <td style={{ padding: "4px 8px", border: "1px solid #ccc", fontSize: 10, lineHeight: 1.3 }} colSpan="8">
                  {item.material}, {item.fit}, {item.CL} FRAME, EXTERIOR PAINT, {item.GL} Glass,<br />
                  Screen={item.SC}, Grid={item.GRD}<br />
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {/* Footer with timestamp */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        marginTop: 30, 
        fontSize: 10,
        color: "#666"
      }}>
        <div>
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
        <div>
          1 of 1
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
          .page-break { page-break-before: always; }
        }
      `}</style>
    </div>
  );
};

export default PrintQuote;