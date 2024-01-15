import React, { useState, useEffect } from 'react';
import btc from '../assets/btc-icon.png';
import TradingViewWidget from './TradingViewWidget';
import TradeStation from './TradeStation';
import Orders from './Orders';


const CoinbaseProTradingGame = (props) => {
  const [portfolioHoldings, setPortfolioHoldings] = useState({
    btcAmount: 0.5,
  });
  const [portfolioHoldingsUsdValue, setPortfolioHoldingsUsdValue] = useState({
    btcAmount: props.bitcoinPrice * portfolioHoldings.btcAmount,
  });
  const [tradeHistory, setTradeHistory] = useState([
    {
      type: 'Sell',
            market: 'BTC-USD',
            price: 44000,
            quantity: 0.01,
            value: 440,
            orderType: 'Market',
            date: '2021-09-01'
    },
    {
      type: 'Sell',
            market: 'BTC-USD',
            price: 44000,
            quantity: 0.01,
            value: 440,
            orderType: 'Market',
            date: '2021-09-01'
    },
  ]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);

  useEffect(() => {
    // Update portfolioHoldingsUsdValue when bitcoinPrice changes
    setPortfolioHoldingsUsdValue((prevValues) => ({
      ...prevValues,
      btcAmount: props.bitcoinPrice * portfolioHoldings.btcAmount,
    }));
  }, [props.bitcoinPrice, portfolioHoldings.btcAmount]);

  return (
    <div className='px-8 h-full'>
      <div className='glass w-full mb-5 py-3 px-4 flex lg:max-w-[155px] justify-center lg:justify-start items-center'>
        <div className='flex w-full justify-center lg:justify-start items-center '>
          <img src={btc} 
          alt='Bitcoin logo'
          className='w-12 h-12 mr-2'
           />
          <div className='flex flex-col w-12 h-12'>
              <p className='relative text-[#ffffffb3] max-content'>BTC-USD<span className='absolute -top-[2px] -right-2 text-[#ffffffb3] animate-ping inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75'></span><span class="absolute -top-[2px] -right-2 inline-flex rounded-full h-3 w-3 bg-green-500"></span></p>
              <p className=''>{props.bitcoinPrice}</p>
          </div>
        </div>
      </div>
      <div className='flex flex-col-reverse lg:flex-row gap-5'>
        <TradeStation 
        bitcoinPrice={props.bitcoinPrice} 
        cash={props.cash} setCash={props.setCash} 
        portfolioHoldings={portfolioHoldings} 
        setPortfolioHoldings={setPortfolioHoldings} 
        portfolioHoldingsUsdValue={portfolioHoldingsUsdValue} 
        setPortfolioHoldingsUsdValue={setPortfolioHoldingsUsdValue} 
        tradeHistory={tradeHistory} setTradeHistory={setTradeHistory}
        portfolioHistory={portfolioHistory} 
        setPortfolioHistory={setPortfolioHistory}
        />
        <TradingViewWidget />
      </div>
      <Orders tradeHistory={tradeHistory} />
      {/* <p>Portfolio:</p>
      <ul>
        <li>
          Bitcoin (BTC): {portfolioHoldings.btcAmount} (Value: ${portfolioHoldingsUsdValue.btcAmount})
        </li>
      </ul> */}
    </div>
  );
};

export default CoinbaseProTradingGame;
