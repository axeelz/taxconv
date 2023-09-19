import { useState, useEffect } from "react";
import { App, Card, Input, Space, Statistic, Switch, Typography } from "antd";

const { Title } = Typography;

function WebApp() {
  const [input, setInput] = useState(0);
  const [result, setResult] = useState(0);
  const [rate, setRate] = useState(0);
  const [priceWithTax, setPriceWithTax] = useState(0);
  const [includeTax, setIncludeTax] = useState(true);

  const displayedPriceWithTax = priceWithTax.toFixed(2);
  const displayedResult = result.toFixed(2);
  const displayedRate = rate.toFixed(4);

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
    if (includeTax) {
      setResult(priceWithTax * rate);
    } else {
      setResult(input * rate);
    }
  }, [priceWithTax, rate, includeTax]);

  return (
    <App>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "90vh",
          width: "100vw",
        }}>
        <Space direction="vertical" size="large" style={{ width: 320 }}>
          <Title level={2}>Enter the amount</Title>
          <Input
            type="number"
            inputMode="decimal"
            step="0.01"
            size="large"
            placeholder="50"
            onChange={(e) => setInput(e.target.value)}
            addonAfter="CA$"
          />
          <Switch
            checkedChildren="Include tax"
            unCheckedChildren="Exclude tax"
            defaultChecked
            onChange={(checked) => setIncludeTax(checked)}
          />
          <Space
            style={{
              alignItems: "center",
              width: "100%",
              justifyContent: "flex-start",
              flexWrap: "wrap",
              opacity: input > 0 ? 1 : 0,
              transition: "opacity 0.3s ease-in-out",
            }}
            size="large">
            {includeTax ? (
              <>
                <Statistic title="Price + tax" value={`${displayedPriceWithTax} CA$`} />
                <Card bordered={true}>
                  <Statistic title={`$${displayedPriceWithTax} in €`} value={`${displayedResult} €`} />
                </Card>
              </>
            ) : (
              <Card bordered={true}>
                <Statistic title={`$${input} in €`} value={`${displayedResult} €`} />
              </Card>
            )}
          </Space>
        </Space>
      </div>
      <div style={{ textAlign: "center", width: "100%" }}>
        Quebec tax rate = 14,975% <br /> 1 CA$ = {displayedRate} €
      </div>
    </App>
  );
}

export default WebApp;
