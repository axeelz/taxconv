import { useState, useEffect } from "react";
import { App, Card, Input, Select, Space, Statistic, Switch, Typography } from "antd";

const { Title, Text } = Typography;

const PROVINCES = {
  QC: { code: "QC", name: "Quebec", taxPercent: 14.975 },
  BC: { code: "BC", name: "British Columbia", taxPercent: 12 },
};

function WebApp() {
  const [input, setInput] = useState(0);
  const [rate, setRate] = useState(0);
  const [includeTax, setIncludeTax] = useState(true);
  const [province, setProvince] = useState("BC");

  const selectedProvince = PROVINCES[province];
  const taxMultiplier = 1 + selectedProvince.taxPercent / 100;
  const priceWithTax = input * taxMultiplier;
  const result = (includeTax ? priceWithTax : input) * rate;

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/CAD")
      .then((res) => res.json())
      .then((data) => setRate(data.rates.EUR))
      .catch(console.error);
  }, []);

  return (
    <App>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "75vh",
          width: "100vw",
        }}>
        <Space direction="vertical" size="large" style={{ width: 320 }}>
          <Title level={2} style={{ marginBottom: 0 }}>
            Enter the amount
          </Title>
          <Input
            size="large"
            placeholder="50"
            onChange={(e) => {
              const normalized = parseFloat(e.target.value.replace(",", "."));
              setInput(Number.isFinite(normalized) ? normalized : 0);
            }}
            addonAfter="CA$"
            type="text"
            inputMode="decimal"
          />
          <Select
            size="large"
            value={province}
            onChange={setProvince}
            options={Object.values(PROVINCES).map((p) => ({
              value: p.code,
              label: `${p.name} (${p.code})`,
            }))}
          />
          <Switch checkedChildren="Add tax" unCheckedChildren="Exclude tax" defaultChecked onChange={setIncludeTax} />
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
                <Statistic title="Price + tax" value={`${priceWithTax.toFixed(2)} CA$`} />
                <Card bordered={true}>
                  <Statistic title={`$${priceWithTax.toFixed(2)} in €`} value={`${result.toFixed(2)} €`} />
                </Card>
              </>
            ) : (
              <Card bordered={true}>
                <Statistic title={`$${input} in €`} value={`${result.toFixed(2)} €`} />
              </Card>
            )}
          </Space>
        </Space>
      </div>
      <div style={{ maxWidth: 320, margin: "0 auto", paddingBottom: 10 }}>
        <Text type="secondary">
          This is a simple tool for European travelers in Canada that helps converting prices from Canadian dollars to
          euros while taking into account the provincial tax rate.
        </Text>
      </div>
      <div style={{ maxWidth: 320, margin: "0 auto" }}>
        {selectedProvince.name} tax rate = <Text code>{selectedProvince.taxPercent}%</Text> <br /> 1 CA$ ={" "}
        <Text code>{rate.toFixed(4)} €</Text>
      </div>
    </App>
  );
}

export default WebApp;
