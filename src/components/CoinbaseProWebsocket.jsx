import React, { useEffect, useState } from 'react';

const CoinbaseProWebSocket = () => {
  const [bitcoinPrice, setBitcoinPrice] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    socket.onopen = () => {
      console.log('WebSocket connection opened.');

      // Subscribe to the ticker channel for BTC-USD
      const subscribeMessage = {
        type: 'subscribe',
        product_ids: ['BTC-USD'],
        channels: ['ticker']
      };
      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'ticker' && data.product_id === 'BTC-USD') {
        const { price } = data;
        setBitcoinPrice(price);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    return () => {
      // Close the WebSocket connection when the component unmounts
      socket.close();
    };
  }, []);

  return (
    <div>
      <h1>Real-time Bitcoin Price</h1>
      {bitcoinPrice !== null ? (
        <p>The current price of Bitcoin (BTC-USD) is: ${bitcoinPrice}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CoinbaseProWebSocket;
