import React from "react";
import { useState, useEffect, useMemo } from "react";

function Orders(props) {
  const [orders, setOrders] = useState([]);
  const [openOrders, setOpenOrders] = useState([]);
  const [positions, setPositions] = useState([]);
  // const closedOrders = orders.filter(order => order.status === 'closed')
  // const openOrders = orders.filter(order => order.status === 'open')
  // const fills = orders.filter(order => order.status === 'filled')
  // const positions = orders.filter(order => order.status === 'position')

  const selectedForm = props.selectedForm;
  const setSelectedForm = props.setSelectedForm;
  const currentMarketPrice = props.bitcoinPrice;

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
    return positions.map((position) => {
      let updatedPnL = 0;
      if (position.type === "Long") {
        updatedPnL =
          (currentMarketPrice - position.entryPrice) * position.quantity;
      } else if (position.type === "Short") {
        updatedPnL =
          (position.entryPrice - currentMarketPrice) * position.quantity;
      }
      return { ...position, unrealizedPL: updatedPnL };
    });
  }, [currentMarketPrice, positions]);

  const [memoizedPositions, setMemoizedPositions] = useState(updatedPositions);

  useEffect(() => {
    setMemoizedPositions(updatedPositions);
  }, [updatedPositions]);

  // const updateAllPositionsPnL = () => {

  return (
    <div className="glass w-full h-full my-[20px]">
      <div className="flex gap-4 px-2 pt-2">
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
            Open Orders
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
                ? "text-[#ffffff]"
                : "text-[#ffffffb3]"
            }`}
            onClick={() => setSelectedForm("position")}
          >
            Positions
          </h1>
        </div>
      </div>

      {selectedForm === "closedOrders" ? (
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
                      <p className="text-[#ffffff] w-[70px]">{order.market}</p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px]">
                        {Number(order.entryPrice).toFixed(2)}
                        <span className="text-[#ffffffb3]">USD</span>
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
                      <p className="text-[#ffffff] w-[70px]">
                        {order.leverage}x
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px]">
                        {Number(order.unrealizedPL).toFixed(2)}
                        <span className="text-[#ffffffb3]">USD</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffcc00] w-[70px]">
                        {Number(order.liquidationPrice).toFixed(2)}
                        <span className="text-[#ffffffb3]">USD</span>
                      </p>
                    </div>
                    <div className="">
                      <p className="text-[#ffffff] w-[70px]">
                        {Number(order.quantity).toFixed(6)}
                        <span className="text-[#ffffffb3]">{coinSymbol}</span>
                      </p>
                    </div>
                    <div className="">
                      <button className="text-[#ffffff] w-[70px]">Close</button>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Orders;
