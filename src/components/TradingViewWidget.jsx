import React, { useState, useEffect, useRef, memo } from "react";
import PortfolioChart from "./PortfolioChart";

function TradingViewWidget(props) {
  const [selectedContainer, setSelectedContainer] = useState("chart");
  const [portfolioValue, setPortfolioValue] = useState(1000);

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
    const portfolioValue = (btcValue + ethValue + xrpValue + cash).toFixed(2);
    setPortfolioValue(portfolioValue);
  }, [
    props.realtimeBtcPrice,
    props.realtimeEthPrice,
    props.realtimeXrpPrice,
    props.portfolioHoldings,
    props.cash,
  ]);

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
          className={`text-lg w-full ${
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
        } h-[560px] grow z-10 tradingview-border bg-[#ffffff1a] w-full overflow-scroll`}
      >
        <div className="flex flex-col gap-2 items-center w-full mt-2">
          <h1 className="text-2xl text-center uppercase text-[#ffffffb3] font-light">
            Your Portfolio Value
          </h1>
          <p className="text-5xl text-center text-white font-light">
            ${portfolioValue}
          </p>
          <PortfolioChart portfolioValue={portfolioValue} />
        </div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
