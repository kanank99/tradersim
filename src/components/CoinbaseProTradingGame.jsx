import React, { useState, useEffect } from 'react';

const CoinbaseProTradingGame = (props) => {
  const [portfolioHoldings, setPortfolioHoldings] = useState({
    btcAmount: 0.5,
  });
  const [portfolioHoldingsUsdValue, setPortfolioHoldingsUsdValue] = useState({
    btcAmount: props.bitcoinPrice * portfolioHoldings.btcAmount,
  });

  useEffect(() => {
    // Update portfolioHoldingsUsdValue when bitcoinPrice changes
    setPortfolioHoldingsUsdValue((prevValues) => ({
      ...prevValues,
      btcAmount: props.bitcoinPrice * portfolioHoldings.btcAmount,
    }));
  }, [props.bitcoinPrice, portfolioHoldings.btcAmount]);

  return (
    <div>
      <h1>Crypto Margin Trading Game</h1>
      <p>Cash: ${props.cash}</p>
      <p>Bitcoin Price: ${props.bitcoinPrice}</p>
      <p>Portfolio:</p>
      <ul>
        <li>
          Bitcoin (BTC): {portfolioHoldings.btcAmount} (Value: ${portfolioHoldingsUsdValue.btcAmount})
        </li>
      </ul>
    </div>
  );
};

export default CoinbaseProTradingGame;
