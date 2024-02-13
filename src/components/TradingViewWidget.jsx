import React, { useState, useEffect, useRef, memo } from "react";
import PortfolioChart from "./PortfolioChart";
import btc from "../assets/btc-icon.png";
import eth from "../assets/eth-icon.png";
import xrp from "../assets/xrp-icon.png";
// import { PieChart } from "react-minimal-pie-chart";

function TradingViewWidget(props) {
  const [selectedContainer, setSelectedContainer] = useState("chart");
  const [portfolioValue, setPortfolioValue] = useState(1000);
  const [btcUsdValue, setBtcUsdValue] = useState(0);
  const [ethUsdValue, setEthUsdValue] = useState(0);
  const [xrpUsdValue, setXrpUsdValue] = useState(0);
  const [cryptoUsdValue, setCryptoUsdValue] = useState(0);

  const container = useRef();
  const ethContainer = useRef();
  const xrpContainer = useRef();

  useEffect(() => {
    if (container.current && props.selectedCoin === "BTC-USD") {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "COINBASE:BTCUSD",
        interval: "5",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(13, 11, 14, 1)",
        gridColor: "rgba(13, 11, 14, 1)",
        hide_legend: true,
        save_image: false,
        hide_volume: true,
        support_host: "https://www.tradingview.com",
      });
      container.current.appendChild(script);
    }
  }, [props.selectedCoin]); // Dependency on props.selectedCoin to re-run effect when it changes

  useEffect(() => {
    if (ethContainer.current && props.selectedCoin === "ETH-USD") {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "COINBASE:ETHUSD",
        interval: "5",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(13, 11, 14, 1)",
        gridColor: "rgba(13, 11, 14, 1)",
        hide_legend: true,
        save_image: false,
        hide_volume: true,
        support_host: "https://www.tradingview.com",
      });
      ethContainer.current.appendChild(script);
    }
  }, [props.selectedCoin]);

  useEffect(() => {
    if (xrpContainer.current && props.selectedCoin === "XRP-USD") {
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "COINBASE:XRPUSD",
        interval: "5",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        backgroundColor: "rgba(13, 11, 14, 1)",
        gridColor: "rgba(13, 11, 14, 1)",
        hide_legend: true,
        save_image: false,
        hide_volume: true,
        support_host: "https://www.tradingview.com",
      });
      xrpContainer.current.appendChild(script);
    }
  }, [props.selectedCoin]);

  // calculate portfolio value

  useEffect(() => {
    const btcValue =
      Number(props.realtimeBtcPrice) *
      Number(props.portfolioHoldings.btcAmount);
    const ethValue =
      Number(props.realtimeEthPrice) *
      Number(props.portfolioHoldings.ethAmount);
    const xrpValue =
      Number(props.realtimeXrpPrice) *
      Number(props.portfolioHoldings.xrpAmount);
    const cash = Number(props.cash);
    const cryptoValue = (btcValue + ethValue + xrpValue).toFixed(2);
    const portfolioValue = (btcValue + ethValue + xrpValue + cash).toFixed(2);
    setPortfolioValue(portfolioValue);
    const btcValueRouded = btcValue.toFixed(2);
    const ethValueRounded = ethValue.toFixed(2);
    setBtcUsdValue(btcValueRouded);
    setEthUsdValue(ethValueRounded);
    setXrpUsdValue(xrpValue);
    setCryptoUsdValue(cryptoValue);
  }, [
    props.realtimeBtcPrice,
    props.realtimeEthPrice,
    props.realtimeXrpPrice,
    props.portfolioHoldings,
    props.cash,
  ]);

  // const defaultLabelStyle = {
  //   fontSize: "13px",
  //   fontFamily: "sans-serif",
  // };

  return (
    <div className="flex flex-col grow">
      <div className="flex justify-between px-5 py-2 glass-container-select tradingview-border-trl">
        <h1
          className={`text-lg w-full ${
            selectedContainer === "chart" ? "text-white" : "text-[#ffffffb3]"
          }`}
          onClick={() => setSelectedContainer("chart")}
        >
          Chart
        </h1>
        <h1
          className={`text-lg w-full ${
            selectedContainer === "portfolio"
              ? "text-white"
              : "text-[#ffffffb3]"
          }`}
          onClick={() => setSelectedContainer("portfolio")}
        >
          Portfolio
        </h1>
        <h1
          className={`text-lg w-full ${
            selectedContainer === "leaderboard"
              ? "text-white"
              : "text-[#ffffffb3]"
          }`}
          onClick={() => setSelectedContainer("leaderboard")}
        >
          Leaderboards
        </h1>
        <h1
          className={`text-lg ${
            selectedContainer === "community"
              ? "text-white"
              : "text-[#ffffffb3]"
          }`}
          onClick={() => setSelectedContainer("community")}
        >
          Community
        </h1>
      </div>
      <div
        className={` ${
          selectedContainer === "chart" ? "block" : "hidden"
        } h-[560px] grow`}
      >
        {props.selectedCoin === "BTC-USD" && (
          <div
            className="tradingview-widget-container"
            ref={container}
            style={{ height: "100%", width: "100%" }}
          >
            <div
              className="tradingview-widget-container__widget"
              style={{ height: "100%", width: "90%" }}
            ></div>
          </div>
        )}
        {props.selectedCoin === "ETH-USD" && (
          <div
            className="tradingview-widget-container"
            ref={ethContainer}
            style={{ height: "100%", width: "100%" }}
          >
            <div
              className="tradingview-widget-container__widget"
              style={{ height: "100%", width: "90%" }}
            ></div>
          </div>
        )}
        {props.selectedCoin === "XRP-USD" && (
          <div
            className="tradingview-widget-container"
            ref={xrpContainer}
            style={{ height: "100%", width: "100%" }}
          >
            <div
              className="tradingview-widget-container__widget"
              style={{ height: "100%", width: "90%" }}
            ></div>
          </div>
        )}
      </div>
      <div
        className={` ${
          selectedContainer === "portfolio" ? "flex" : "hidden"
        } h-[560px] grow z-10 tradingview-border glass w-full overflow-scroll portfolio-bg no-scrollbar`}
      >
        <div className="flex flex-col gap-2 items-center w-full mt-2">
          <h1 className="text-2xl text-center uppercase text-[#ffffffb3] font-light">
            Your Portfolio Value
          </h1>
          <p className="text-5xl text-center text-white font-light">
            ${portfolioValue}
          </p>
          <PortfolioChart
            portfolioValue={portfolioValue}
            positionsClosedAmount={props.positionsClosedAmount}
          />
          {/* 
          Pie chart with all crypto holdings and cash
          */}
          {/* <div className="inline self-start ml-5">
            <PieChart
              data={[
                {
                  title: "Btc",
                  value: btcUsdValue,
                  color: "#F7931A",
                  label: "BTC",
                },
                {
                  title: "Eth",
                  value: ethUsdValue,
                  color: "#627EEA",
                },
                {
                  title: "Xrp",
                  value: xrpUsdValue,
                  color: "#C13C37",
                },
                { title: "Cash", value: props.cash, color: "#6A2135" },
              ]}
              viewBoxSize={[150, 150]}
              label={({ dataEntry }) => dataEntry.title}
              labelStyle={{
                ...defaultLabelStyle,
              }}
            />
          </div> */}
          <div className="flex flex-col gap-2 w-full px-10">
            <div className="flex gap-3">
              <h1 className="text-2xl uppercase text-[#ffffffb3] font-light">
                Cash
              </h1>
              <p className="text-2xl text-white">${props.cash}</p>
            </div>
            <div className="flex gap-3">
              <h1 className="text-2xl uppercase text-[#ffffffb3] font-light">
                Crypto Holdings
              </h1>
              <p className="text-2xl text-white">${cryptoUsdValue}</p>
            </div>
            <div className="flex flex-col gap-2 items-center w-full mt-2">
              <div className="flex justify-between w-full tradingview-border-bottom">
                <h1 className="text-lg text-white grow">Name</h1>
                <h1 className="text-lg text-white grow">Total</h1>
                <h1 className="text-lg text-white grow">Price</h1>
                <h1 className="text-lg text-white">Allocation</h1>
              </div>
              <div className="flex justify-between items-center w-full tradingview-border-bottom pb-2 mb-2">
                <div className="flex items-center grow">
                  <img src={btc} alt="btc" className="w-10 h-10" />
                  <div className="flex flex-col ml-4">
                    <h1 className="text-lg text-white tracking-wide">
                      Bitcoin
                    </h1>
                    <h1 className="text-md text-[#ffffffb3] font-light tracking-wider">
                      BTC
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col grow">
                  <p className="text-lg text-white font-light">{btcUsdValue}</p>
                  <p className="text-md text-white font-light">
                    {props.portfolioHoldings.btcAmount} BTC
                  </p>
                </div>
                <p className="text-lg text-white font-light grow">
                  {props.realtimeBtcPrice}
                </p>
                <p className="text-lg text-white font-light">
                  {((btcUsdValue / portfolioValue) * 100).toFixed(2)}%
                </p>
              </div>
              <div className="flex justify-between items-center w-full tradingview-border-bottom pb-2 mb-2">
                <div className="flex items-center grow">
                  <img src={eth} alt="eth" className="w-10 h-10" />
                  <div className="flex flex-col ml-4">
                    <h1 className="text-lg text-white tracking-wide">
                      Ethereum
                    </h1>
                    <h1 className="text-md text-[#ffffffb3] font-light tracking-wider">
                      ETH
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col grow">
                  <p className="text-lg text-white font-light">{ethUsdValue}</p>
                  <p className="text-md text-white font-light">
                    {props.portfolioHoldings.ethAmount} ETH
                  </p>
                </div>
                <p className="text-lg text-white font-light grow">
                  {props.realtimeEthPrice}
                </p>
                <p className="text-lg text-white font-light">
                  {((ethUsdValue / portfolioValue) * 100).toFixed(2)}%
                </p>
              </div>
              <div className="flex justify-between items-center w-full pb-2 mb-2">
                <div className="flex items-center grow">
                  <img src={xrp} alt="xrp" className="w-10 h-10" />
                  <div className="flex flex-col ml-4">
                    <h1 className="text-lg text-white tracking-wide">Ripple</h1>
                    <h1 className="text-md text-[#ffffffb3] font-light tracking-wider">
                      XRP
                    </h1>
                  </div>
                </div>
                <div className="flex flex-col grow">
                  <p className="text-lg text-white font-light">{xrpUsdValue}</p>
                  <p className="text-md text-white font-light">
                    {props.portfolioHoldings.xrpAmount} XRP
                  </p>
                </div>
                <p className="text-lg text-white font-light grow">
                  {props.realtimeXrpPrice}
                </p>
                <p className="text-lg text-white font-light">
                  {((xrpUsdValue / portfolioValue) * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
