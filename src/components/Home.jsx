import React, { useEffect, useState } from "react";
import CoinbaseProTradingGame from "./CoinbaseProTradingGame";
import Header from "./Header";

const Home = (props) => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);
  const [cash, setCash] = useState(0);
  const [equity, setEquity] = useState(cash);
  const listOfCoins = ["BTC-USD", "ETH-USD", "XRP-USD"];
  const [selectedCoin, setSelectedCoin] = useState(listOfCoins[0]);

  useEffect(() => {
    const socket = new WebSocket("wss://ws-feed.exchange.coinbase.com");

    socket.onopen = () => {
      console.log("WebSocket connection opened.");

      // Subscribe to the ticker channel for BTC-USD
      const subscribeMessage = {
        type: "subscribe",
        product_ids: [selectedCoin],
        channels: ["ticker"],
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "ticker" && data.product_id === selectedCoin) {
        const { price } = data;
        setBitcoinPrice(price);
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed.");
    };

    return () => {
      // Close the WebSocket connection when the component unmounts
      socket.close();
    };
  }, [selectedCoin]);

  return (
    <div className="h-full">
      <Header cash={cash} equity={equity} />
      <CoinbaseProTradingGame
        bitcoinPrice={bitcoinPrice}
        cash={cash}
        setCash={setCash}
        equity={equity}
        setEquity={setEquity}
        selectedCoin={selectedCoin}
        setSelectedCoin={setSelectedCoin}
        listOfCoins={listOfCoins}
        realtimeBtcPrice={props.realtimeBtcPrice}
        realtimeEthPrice={props.realtimeEthPrice}
        realtimeXrpPrice={props.realtimeXrpPrice}
      />
    </div>
  );
};

export default Home;
