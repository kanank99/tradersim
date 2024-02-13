import React, { useEffect, useState } from "react";
import Home from "./Home";

function FetchCoinPrices() {
  const [realtimeBtcPrice, setRealtimeBtcPrice] = useState(null);
  const [realtimeEthPrice, setRealtimeEthPrice] = useState(null);
  const [realtimeXrpPrice, setRealtimeXrpPrice] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    socket.onopen = () => {
      console.log("WebSocket connection opened.");

      // Subscribe to the ticker channel for BTC-USD
      const subscribeMessage = {
        type: "subscribe",
        product_ids: ["BTC-USD"],
        channels: ["ticker"],
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ticker" && data.product_id === "BTC-USD") {
        const { price } = data;
        setRealtimeBtcPrice(price);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      // Close the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    socket.onopen = () => {
      console.log("WebSocket connection opened.");

      // Subscribe to the ticker channel for ETH-USD
      const subscribeMessage = {
        type: "subscribe",
        product_ids: ["ETH-USD"],
        channels: ["ticker"],
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ticker" && data.product_id === "ETH-USD") {
        const { price } = data;
        setRealtimeEthPrice(price);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      // Close the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);

  useEffect(() => {
    const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    socket.onopen = () => {
      console.log("WebSocket connection opened.");

      // Subscribe to the ticker channel for ETH-USD
      const subscribeMessage = {
        type: "subscribe",
        product_ids: ["XRP-USD"],
        channels: ["ticker"],
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ticker" && data.product_id === "XRP-USD") {
        const { price } = data;
        setRealtimeXrpPrice(price);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      // Close the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);
  return (
    <div>
      <Home
        realtimeBtcPrice={realtimeBtcPrice}
        realtimeEthPrice={realtimeEthPrice}
        realtimeXrpPrice={realtimeXrpPrice}
      />
    </div>
  );
}

export default FetchCoinPrices;
