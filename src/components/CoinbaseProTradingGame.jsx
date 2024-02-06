import React, { useState, useEffect } from "react";
import btc from "../assets/btc-icon.png";
import eth from "../assets/eth-icon.png";
import xrp from "../assets/xrp-icon.png";
import TradingViewWidget from "./TradingViewWidget";
import TradeStation from "./TradeStation";
import Orders from "./Orders";

const CoinbaseProTradingGame = (props) => {
  const [portfolioHoldings, setPortfolioHoldings] = useState({
    btcAmount: 0.5,
    ethAmount: 0.2,
    xrpAmount: 10430,
  });
  const [portfolioHoldingsUsdValue, setPortfolioHoldingsUsdValue] = useState({
    btcAmount: props.bitcoinPrice * portfolioHoldings.btcAmount,
  });
  const [tradeHistory, setTradeHistory] = useState([]);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [limitOrders, setLimitOrders] = useState([]);
  const [marginOrders, setMarginOrders] = useState([]);
  const [liquidationPrice, setLiquidationPrice] = useState(0);
  const [selectedForm, setSelectedForm] = useState("closedOrders");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Update portfolioHoldingsUsdValue when bitcoinPrice changes
    setPortfolioHoldingsUsdValue((prevValues) => ({
      ...prevValues,
      btcAmount: props.bitcoinPrice * portfolioHoldings.btcAmount,
    }));
  }, [props.bitcoinPrice, portfolioHoldings.btcAmount]);

  return (
    <div className="px-8 h-full">
      {/* modal for selecting coin */}
      <div
        className={`fixed z-10 inset-0 overflow-y-auto ${
          modalOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Select a coin
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Select a coin to trade
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:flex-row md:gap-0 mt-2">
                    <button
                      onClick={() => {
                        props.setSelectedCoin(props.listOfCoins[0]);
                        setModalOpen(false);
                      }}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow"
                    >
                      Bitcoin (BTC)
                    </button>
                    <button
                      onClick={() => {
                        props.setSelectedCoin(props.listOfCoins[1]);
                        setModalOpen(false);
                      }}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow ml-2"
                    >
                      Ethereum (ETH)
                    </button>
                    <button
                      onClick={() => {
                        props.setSelectedCoin(props.listOfCoins[2]);
                        setModalOpen(false);
                      }}
                      className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow ml-2"
                    >
                      XRP (XRP)
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Select
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:w-auto sm:text-sm"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end of modal */}
      <div className="hidden md:flex gap-3 select-none">
        <div
          className="py-4 px-8"
          onClick={() => props.setSelectedCoin(props.listOfCoins[0])}
        >
          <div className="flex w-full items-center ">
            <img src={btc} alt="Bitcoin logo" className="w-12 h-12 mr-2" />
            <div className="flex flex-col w-12 h-12">
              <p className="relative text-[#ffffffb3] max-content">
                BTC-USD
                <span className="absolute -top-[2px] -right-2 text-[#ffffffb3] animate-ping inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="absolute -top-[2px] -right-2 inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </p>
              <p className="">{props.realtimeBtcPrice}</p>
            </div>
          </div>
        </div>

        <div
          className="py-4 px-8"
          onClick={() => props.setSelectedCoin(props.listOfCoins[1])}
        >
          <div className="flex w-full items-center ">
            <img src={eth} alt="Bitcoin logo" className="w-12 h-12 mr-2" />
            <div className="flex flex-col w-12 h-12">
              <p className="relative text-[#ffffffb3] max-content">
                ETH-USD
                <span className="absolute -top-[2px] -right-2 text-[#ffffffb3] animate-ping inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="absolute -top-[2px] -right-2 inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </p>
              <p className="">{props.realtimeEthPrice}</p>
            </div>
          </div>
        </div>

        <div
          className="py-4 px-8"
          onClick={() => props.setSelectedCoin(props.listOfCoins[2])}
        >
          <div className="flex w-full items-center ">
            <img src={xrp} alt="Bitcoin logo" className="w-12 h-12 mr-2" />
            <div className="flex flex-col w-12 h-12">
              <p className="relative text-[#ffffffb3] max-content">
                XRP-USD
                <span className="absolute -top-[2px] -right-2 text-[#ffffffb3] animate-ping inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                <span className="absolute -top-[2px] -right-2 inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </p>
              <p className="">{props.realtimeXrpPrice}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="glass w-full mb-5 py-3 px-4 flex justify-center items-center cursor-pointer hover:shadow-lg hover:bg-gray-800 md:hidden"
        onClick={() => setModalOpen(true)}
      >
        <div className="flex w-full justify-center items-center ">
          {props.selectedCoin === "BTC-USD" && (
            <img src={btc} alt="Bitcoin logo" className="w-12 h-12 mr-2" />
          )}
          {props.selectedCoin === "ETH-USD" && (
            <img src={eth} alt="Ethereum logo" className="w-12 h-12 mr-2" />
          )}
          {props.selectedCoin === "XRP-USD" && (
            <img src={xrp} alt="XRP logo" className="w-12 h-12 mr-2" />
          )}
          <div className="flex flex-col w-12 h-12">
            <p className="relative text-[#ffffffb3] max-content">
              {props.selectedCoin}
              <span className="absolute -top-[2px] -right-2 text-[#ffffffb3] animate-ping inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
              <span className="absolute -top-[2px] -right-2 inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </p>
            <p className="">{props.bitcoinPrice}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row gap-5">
        <TradeStation
          bitcoinPrice={props.bitcoinPrice}
          cash={props.cash}
          setCash={props.setCash}
          portfolioHoldings={portfolioHoldings}
          setPortfolioHoldings={setPortfolioHoldings}
          portfolioHoldingsUsdValue={portfolioHoldingsUsdValue}
          setPortfolioHoldingsUsdValue={setPortfolioHoldingsUsdValue}
          tradeHistory={tradeHistory}
          setTradeHistory={setTradeHistory}
          portfolioHistory={portfolioHistory}
          setPortfolioHistory={setPortfolioHistory}
          limitOrders={limitOrders}
          setLimitOrders={setLimitOrders}
          marginOrders={marginOrders}
          setMarginOrders={setMarginOrders}
          liquidationPrice={liquidationPrice}
          setLiquidationPrice={setLiquidationPrice}
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          equity={props.equity}
          setEquity={props.setEquity}
          selectedCoin={props.selectedCoin}
          realtimeBtcPrice={props.realtimeBtcPrice}
          realtimeEthPrice={props.realtimeEthPrice}
          realtimeXrpPrice={props.realtimeXrpPrice}
        />
        <TradingViewWidget selectedCoin={props.selectedCoin} />
      </div>
      <Orders
        tradeHistory={tradeHistory}
        setTradeHistory={setTradeHistory}
        limitOrders={limitOrders}
        setLimitOrders={setLimitOrders}
        selectedForm={selectedForm}
        setSelectedForm={setSelectedForm}
        marginOrders={marginOrders}
        setMarginOrders={setMarginOrders}
        liquidationPrice={liquidationPrice}
        setLiquidationPrice={setLiquidationPrice}
        bitcoinPrice={props.bitcoinPrice}
        cash={props.cash}
        setCash={props.setCash}
        equity={props.equity}
        setEquity={props.setEquity}
        portfolioHoldings={portfolioHoldings}
        realtimeBtcPrice={props.realtimeBtcPrice}
        realtimeEthPrice={props.realtimeEthPrice}
        realtimeXrpPrice={props.realtimeXrpPrice}
      />
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
