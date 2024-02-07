import React from "react";
import { useState, useEffect, useMemo } from "react";

function Orders(props) {
  const [orders, setOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [positions, setPositions] = useState([]);
  const [memoizedPositions, setMemoizedPositions] = useState([]);
  const [previousTotalPnL, setPreviousTotalPnL] = useState(0);

  // const closedOrders = orders.filter(order => order.status === 'closed')
  // const openOrders = orders.filter(order => order.status === 'open')
  // const fills = orders.filter(order => order.status === 'filled')
  // const positions = orders.filter(order => order.status === 'position')

  const selectedForm = props.selectedForm;
  const setSelectedForm = props.setSelectedForm;
  const currentMarketPrice = props.bitcoinPrice;
  const currentMarketPriceBtc = props.realtimeBtcPrice;
  const currentMarketPriceEth = props.realtimeEthPrice;
  const currentMarketPriceXrp = props.realtimeXrpPrice;
  const cash = props.cash;
  const setCash = props.setCash;
  const equity = props.equity;
  const setEquity = props.setEquity;

  useEffect(() => {
    setOrders(props.tradeHistory);
  }, [props.tradeHistory]);

  useEffect(() => {
    setOpenOrders(props.limitOrders);
  }, [props.limitOrders]);

  useEffect(() => {
    setPositions(props.marginOrders);
  }, [props.marginOrders]);

  // Use useMemo to memoize the calculated positions
  const updatedPositions = useMemo(() => {
    return positions
      .filter((position) => position.isOpen)
      .map((position) => {
        let updatedPnL = 0;
        // if (position.isOpen === false) {
        //   // destroy the position
        //   // console.log("position with id", position.id, "is closed");
        //   // return { ...position, unrealizedPL: updatedPnL };
        // }
        if (position.market === "BTC-USD") {
          if (position.type === "Long") {
            updatedPnL =
              (currentMarketPriceBtc - position.entryPrice) * position.quantity;
          } else if (position.type === "Short") {
            updatedPnL =
              (position.entryPrice - currentMarketPriceBtc) * position.quantity;
          }
        } else if (position.market === "ETH-USD") {
          if (position.type === "Long") {
            updatedPnL =
              (currentMarketPriceEth - position.entryPrice) * position.quantity;
          } else if (position.type === "Short") {
            updatedPnL =
              (position.entryPrice - currentMarketPriceEth) * position.quantity;
          }
        } else if (position.market === "XRP-USD") {
          if (position.type === "Long") {
            updatedPnL =
              (currentMarketPriceXrp - position.entryPrice) * position.quantity;
          } else if (position.type === "Short") {
            updatedPnL =
              (position.entryPrice - currentMarketPriceXrp) * position.quantity;
          }
        }
        return { ...position, unrealizedPL: updatedPnL };
      });
  }, [
    currentMarketPriceBtc,
    currentMarketPriceEth,
    currentMarketPriceXrp,
    positions,
  ]);

  useEffect(() => {
    setMemoizedPositions(updatedPositions);
  }, [updatedPositions]);

  useEffect(() => {
    const newTotalUnrealizedPL = memoizedPositions.reduce(
      (total, position) => total + position.unrealizedPL,
      0
    );

    const pnlChange = newTotalUnrealizedPL - previousTotalPnL;
    setEquity((prevEquity) => (Number(prevEquity) + pnlChange).toFixed(2));
    setPreviousTotalPnL(newTotalUnrealizedPL);
  }, [memoizedPositions, setEquity, previousTotalPnL]);

  const executeClosePosition = (position) => {
    setEquity((Number(equity) + Number(position.unrealizedPL)).toFixed(2));
    setCash(
      (
        Number(cash) +
        Number(position.amount) +
        Number(position.unrealizedPL)
      ).toFixed(2)
    );
    // setEquity((Number(equity) + Number(position.unrealizedPL)).toFixed(2));

    console.log(equity);

    const updatedPositions = positions.filter((pos) => pos.id !== position.id);
    setPositions(updatedPositions);
    props.setMarginOrders(updatedPositions);
    setOrders([
      ...orders,
      {
        id: orders.length + 1,
        market: position.market,
        type: position.type,
        tradeType: position.tradeType,
        orderType: "Market",
        price: currentMarketPrice,
        quantity: position.quantity,
        isOpen: false,
      },
    ]);
    props.setTradeHistory([
      ...orders,
      {
        id: orders.length + 1,
        market: position.market,
        type: position.type,
        tradeType: position.tradeType,
        orderType: "Market",
        price: currentMarketPrice,
        quantity: position.quantity,
        isOpen: false,
      },
    ]);
  };

  return (
    <div className="glass w-full h-full my-[20px] tradingview-border ">
      <div className="flex gap-5 px-2 pt-2 bg-[#131722] rounded-tr-[10px] rounded-tl-[10px] tradingview-border-bottom">
        <div className="p-1 cursor-pointer select-none">
          <h1
            className={`${
              selectedForm === "closedOrders"
                ? "text-[#ffffff]"
                : "text-[#ffffffb3]"
            }`}
            onClick={() => setSelectedForm("closedOrders")}
          >
            Closed Orders
          </h1>
        </div>
        <div className="p-1 cursor-pointer select-none">
          <h1
            className={`${
              selectedForm === "openOrders"
                ? "text-[#ffffff]"
                : "text-[#ffffffb3]"
            }`}
            onClick={() => setSelectedForm("openOrders")}
          >
            Limit Orders
          </h1>
        </div>
        <div className="p-1 cursor-pointer select-none">
          <h1
            className={`${
              selectedForm === "fills" ? "text-[#ffffff]" : "text-[#ffffffb3]"
            }`}
            onClick={() => setSelectedForm("fills")}
          >
            Fills
          </h1>
        </div>
        <div className="p-1 cursor-pointer select-none">
          <h1
            className={`${
              selectedForm === "position"
                ? "text-[#ffffff] relative"
                : "text-[#ffffffb3] relative"
            }`}
            onClick={() => setSelectedForm("position")}
          >
            Positions
            {positions.length > 0 ? (
              <>
                <span className="absolute -right-2 text-[#ffffffb3] animate-ping inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                <span className="absolute -right-2 inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </>
            ) : null}
          </h1>
        </div>
      </div>

      {selectedForm === "closedOrders" ? (
        <div className="mt-2 ">
          <div className="flex  justify-between px-4">
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Market
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Trade Type
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Side
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Type
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Price
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Quantity
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            {orders.map((order) => {
              let coinSymbol = order.market.split("-")[0];

              if (order.isOpen === false) {
                return (
                  <div className="flex gap-2 justify-between px-4 text-center text-sm p-2 hover:bg-[#504d4d]">
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-left">
                        {order.market}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[40px] text-right">
                        {order.tradeType}
                      </p>
                    </div>
                    <div className="">
                      <p
                        className={`text-[#ffffff] w-[40px] ${
                          order.type === "Buy"
                            ? "text-green-500"
                            : "text-red-500"
                        } text-right`}
                      >
                        {order.type}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-right">
                        {order.orderType}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[110px]">
                        {Number(order.price).toFixed(2)}
                        <span className="text-[#ffffffb3]">USD</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-right">
                        {order.quantity}
                        <span className="text-[#ffffffb3]">{coinSymbol}</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          {orders.length > 0 ? null : (
            <div className="text-[#ffffffb3] flex items-center justify-center h-[100px]">
              <p>No orders here ¯\_(ツ)_/¯</p>
            </div>
          )}
        </div>
      ) : null}
      {selectedForm === "openOrders" ? (
        <div className="mt-2 ">
          <div className="flex gap-2 justify-between px-4">
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Market
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Side
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Type
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Price
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Status
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Quantity
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            {openOrders.map((order) => {
              let coinSymbol = order.market.split("-")[0];

              if (order.isOpen === true) {
                return (
                  <div className="flex gap-2 justify-between px-4 text-center text-sm p-2 hover:bg-[#504d4d]">
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-left">
                        {order.market}
                      </p>
                    </div>
                    <div className="">
                      <p
                        className={`text-[#ffffff] w-[40px] ${
                          order.type === "Buy"
                            ? "text-green-500"
                            : "text-red-500"
                        } text-right`}
                      >
                        {order.type}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-right">
                        {order.orderType}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[110px]">
                        {Number(order.limitPrice).toFixed(2)}
                        <span className="text-[#ffffffb3]">USD</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-left">
                        {order.status}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px] text-right">
                        {order.quantity}
                        <span className="text-[#ffffffb3]">{coinSymbol}</span>
                      </p>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          {openOrders.length > 0 ? null : (
            <div className="text-[#ffffffb3] flex items-center justify-center h-[100px]">
              <p>No orders here ¯\_(ツ)_/¯</p>
            </div>
          )}
        </div>
      ) : null}
      {selectedForm === "position" ? (
        <div className="mt-2 ">
          <div className="flex gap-2 justify-between px-4">
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Market
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Entry Price
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Side
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Leverage
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Unrealized P/L
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Lq.Price
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Quantity
              </p>
            </div>
            <div className="">
              <p className="text-[#ffffffb3] uppercase font-thin text-sm">
                Close Trade
              </p>
            </div>
          </div>
          <div className="flex flex-col">
            {memoizedPositions.map((order) => {
              let coinSymbol = order.market.split("-")[0];

              if (order.isOpen === true) {
                return (
                  <div className="flex gap-2 justify-between px-4 text-center text-sm p-2 hover:bg-[#504d4d]">
                    <div className="">
                      <p className="text-[#ffffff]">{order.market}</p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff]">
                        {order.market === "XRP-USD"
                          ? Number(order.entryPrice)
                          : Number(order.entryPrice).toFixed(2)}
                      </p>
                    </div>
                    <div className="">
                      <p
                        className={`text-[#ffffff] ${
                          order.type === "Long"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {order.type}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff]">{order.leverage}x</p>
                    </div>
                    <div className="">
                      <p
                        className={`${
                          order.unrealizedPL > 0
                            ? "text-green-500"
                            : "text-red-500"
                        } text-[#ffffff] w-[70px]`}
                      >
                        {Number(order.unrealizedPL).toFixed(2)}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffcc00]">
                        {order.market === "XRP-USD"
                          ? Number(order.liquidationPrice).toFixed(6)
                          : Number(order.liquidationPrice).toFixed(2)}
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff]">
                        {Number(order.quantity).toFixed(6)}
                        <span className="text-[#ffffffb3]">{coinSymbol}</span>
                      </p>
                    </div>
                    <div className="">
                      <button
                        className="text-[#ffffff]"
                        onClick={() => executeClosePosition(order, cash)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
          {positions.length > 0 ? (
            <p className="text-[#ffffffb3] text-center mt-2">
              *Unrealized P/L is calculated based on the current market price
            </p>
          ) : (
            <div className="text-[#ffffffb3] flex items-center justify-center h-[100px]">
              <p>No trades here ¯\_(ツ)_/¯</p>
            </div>
          )}
        </div>
      ) : null}
      {/* show portfolio */}
      {/* <div className="flex justify-between">
        <p>BTC</p>
        <p>ETH</p>
        <p>XRP</p>
      </div>
      <div className="flex justify-between">
        <p>{props.portfolioHoldings.btcAmount}</p>
        <p>{props.portfolioHoldings.ethAmount}</p>
        <p>{props.portfolioHoldings.xrpAmount}</p>
      </div>
      <div className="flex justify-between">
        <p>{props.realtimeBtcPrice}</p>
        <p>{props.realtimeEthPrice}</p>
        <p>{props.realtimeXrpPrice}</p>
      </div> */}
    </div>
  );
}

export default Orders;
