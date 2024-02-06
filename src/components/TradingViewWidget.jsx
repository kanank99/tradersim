import React, { useEffect, useRef, memo } from "react";

function TradingViewWidget(props) {
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

  return (
    <div className="h-[560px] grow">
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
  );
}

export default memo(TradingViewWidget);
