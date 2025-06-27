import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "./axiosConfig";

const PrintQuote = () => {
  const { type, quote_no } = useParams();
  const [record, setRecord] = useState(null);
  const [details, setDetails] = useState([]);

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

      const rRes = await axios.get(`${basePath}/quote-no/${quote_no}`);
      const dRes = await axios.get(`${basePath}/${quote_no}`);

      setRecord(rRes.data);
      setDetails(dRes.data);

      setTimeout(() => window.print(), 500);
    };

    fetchData();
  }, [type, quote_no]);

  if (!record) return <div>Loading...</div>;

  return (
    <div style={{ padding: 40, fontFamily: "Arial", color: "#000" }}>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <h1 style={{ margin: 0 }}>Diamond WINDOWS & DOORS MFG</h1>
        <p>99 EAST COTTAGE STREET, BOSTON, MA. 02125</p>
        <p>TEL: (617) 282-1688 &nbsp;&nbsp; FAX: (617) 282-2298</p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <p><strong>ACCOUNT NO.:</strong> {record.customer}</p>
          <p><strong>{type.toUpperCase()} NO.:</strong> {record.quote_no}</p>
          <p><strong>DATE:</strong> {record.date}</p>
        </div>
        <div>
          <p><strong>SHIP TO:</strong></p>
          <p>Address Placeholder</p>
        </div>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid black" }}>
            <th align="left">ITEM</th>
            <th align="left">QTY</th>
            <th align="left">DESCRIPTION</th>
            <th align="right">UNIT PRICE</th>
            <th align="right">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item, i) => (
            <tr key={i} style={{ borderBottom: "1px solid #ccc" }}>
              <td>{i + 1}</td>
              <td>{item.unit}</td>
              <td>
                {item.material} {item.product_type} {item.CL}<br />
                {item.width}" x {item.height}" @ {item.at} units<br />
                {item.GL} {item.GRD ? "WITH GRD" : "NO GRD"} {item.SC}
              </td>
              <td align="right">${parseFloat(record.total / details.length).toFixed(2)}</td>
              <td align="right">${(record.total / details.length).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: 20, textAlign: "right" }}>
        <p><strong>SUBTOTAL:</strong> ${record.sub_total}</p>
        <p><strong>TOTAL:</strong> ${record.total}</p>
      </div>

      <div style={{ marginTop: 30, fontSize: 12 }}>
        <p>* 1.5% MONTHLY INTEREST CHARGES ON PAST DUE ACCOUNTS.</p>
        <p>* ALL PRICES SUBJECT TO CHANGE WITHOUT NOTICE.</p>
        <p>* ALL CLAIMS FOR SHORTAGES OR DAMAGES MUST BE MADE WITHIN 10 DAYS.</p>
        <p>* NO MERCHANDISE IS RETURNABLE WITHOUT CONSENT.</p>
      </div>
    </div>
  );
};

export default PrintQuote;
