import { useState, useEffect } from "react";
import { Input, Statistic } from "antd";

function App() {
  const [input, setInput] = useState(0);
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);
  const [priceWithTax, setPriceWithTax] = useState(0);

  useEffect(() => {
    // Get rate from API when component is mounted
    fetch("https://open.er-api.com/v6/latest/CAD")
      .then((res) => res.json())
      .then((data) => {
        // Set result to the rate
        setRate(data.rates.EUR);
        console.log("Rate fetched from API " + data.rates.EUR);
      });
  }, []);

  useEffect(() => {
    // Add 14,975% tax to input
    setPriceWithTax(input * 1.14975);
  }, [input]);

  useEffect(() => {
    // Calculate result when input or rate changes
    setResult(priceWithTax * rate);
  }, [priceWithTax, rate]);

  return (
    <>
      <div className="card">
        <p>Enter the amount in CAD</p>
        <Input size="large" placeholder="CAD" onChange={(e) => setInput(e.target.value)} />
        <Statistic title="Price with tax" value={`${priceWithTax.toFixed(2)} $`} style={{ marginTop: "1rem" }} />
        <Statistic title="Price in EUR" value={`${result.toFixed(2)} €`} style={{ marginTop: "1rem" }} />
      </div>
    </>
  );
}

export default App;
