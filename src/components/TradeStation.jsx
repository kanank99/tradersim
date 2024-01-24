import React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

function TradeStation(props) {
  const limitOrders = props.limitOrders;
  const setLimitOrders = props.setLimitOrders;
  const setSelectedForm = props.setSelectedForm;
  const marginOrders = props.marginOrders;
  const setMarginOrders = props.setMarginOrders;
  // const liquidationPrice = props.liquidationPrice
  const setLiquidationPrice = props.setLiquidationPrice;
  const { bitcoinPrice, cash, setCash } = props;

  const [spot, setSpot] = useState(true);
  const [margin, setMargin] = useState(false);
  const [buy, setBuy] = useState(true);
  const [sell, setSell] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [selectedOrderType, setSelectedOrderType] = useState("Limit");
  const [total, setTotal] = useState(0);
  const tradePrice = useRef(0);
  const tradeQuantity = useRef(0);
  const [selectedMargin, setSelectedMargin] = useState(2);

  useEffect(() => {
    // Update total when tradePrice or tradeQuantity changes
    if (spot) {
      setTotal(
        (tradePrice.current.value * tradeQuantity.current.value).toFixed(2)
      );
    } else if (margin) {
      setTotal(
        (tradeQuantity.current.value / tradePrice.current.value).toFixed(8)
      );
    }
  }, [tradePrice.current.value, tradeQuantity.current.value, margin, spot]);

  const executeLimitOrder = useCallback(
    async (order) => {
      // Implement the logic for executing the limit order
      // This function should return the updated order details
      // For example, simulate a delay with setTimeout and return the order

      if (order.type === "Buy") {
        let cash = props.cash;
        let btcAmountInWallet = props.portfolioHoldings.btcAmount;
        let btcPrice = props.bitcoinPrice;

        let usdCost = order.limitPrice * order.quantity;

        if (usdCost > cash) {
          alert("Not enough cash");
          return;
        }

        let newCashBalance = (Number(cash) - Number(usdCost)).toFixed(2);
        let newBtcAmountInWallet =
          Number(btcAmountInWallet) + Number(order.quantity);
        let newBtcValueInWallet = newBtcAmountInWallet * btcPrice;
        let newPortfolioValue = newCashBalance + newBtcValueInWallet;
        let newPortfolioHoldings = {
          btcAmount: newBtcAmountInWallet,
          btcValue: newBtcValueInWallet,
          cash: newCashBalance,
        };
        let currentDate = new Date();
        let newPortfolioHistory = props.portfolioHistory;
        newPortfolioHistory.push(newPortfolioValue);
        let newTradeHistory = props.tradeHistory;
        newTradeHistory.push({
          isOpen: false,
          type: "Buy",
          market: "BTC-USD",
          price: order.limitPrice,
          quantity: order.quantity,
          value: usdCost,
          orderType: order.orderType,
          date: currentDate,
        });
        props.setCash(newCashBalance);
        props.setPortfolioHoldings(newPortfolioHoldings);
        props.setPortfolioHistory(newPortfolioHistory);
        props.setTradeHistory(newTradeHistory);
        console.log(props.tradeHistory);
      } else if (order.type === "Sell") {
        let cash = props.cash;
        let btcAmountInWallet = props.portfolioHoldings.btcAmount;
        let btcPrice = props.bitcoinPrice;
        let btcAmountToSell = order.quantity;
        let usdCost = order.limitPrice * btcAmountToSell;

        if (btcAmountToSell > btcAmountInWallet) {
          alert("Not enough BTC");
          return;
        }

        let newCashBalance = (Number(cash) + Number(usdCost)).toFixed(2);
        let newBtcAmountInWallet =
          Number(btcAmountInWallet) - Number(btcAmountToSell);
        let newBtcValueInWallet = newBtcAmountInWallet * btcPrice;
        let newPortfolioValue = newCashBalance + newBtcValueInWallet;
        let newPortfolioHoldings = {
          btcAmount: newBtcAmountInWallet,
          btcValue: newBtcValueInWallet,
          cash: newCashBalance,
        };
        let currentDate = new Date();
        let newPortfolioHistory = props.portfolioHistory;
        newPortfolioHistory.push(newPortfolioValue);
        let newTradeHistory = props.tradeHistory;
        newTradeHistory.push({
          isOpen: false,
          type: "Sell",
          market: "BTC-USD",
          price: order.limitPrice,
          quantity: btcAmountToSell,
          value: usdCost,
          orderType: order.orderType,
          date: currentDate,
        });
        props.setCash(newCashBalance);
        props.setPortfolioHoldings(newPortfolioHoldings);
        props.setPortfolioHistory(newPortfolioHistory);
        props.setTradeHistory(newTradeHistory);
        console.log(props.tradeHistory);
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(order);
        }, 100); // Simulating a delay of 0.1 second
      });
    },
    [props]
  );

  useEffect(() => {
    const checkLimitOrders = async () => {
      const currentMarketPrice = props.bitcoinPrice;

      // Create a Promise for each limit order
      const limitOrderPromises = limitOrders.map(async (order) => {
        if (order.isOpen) {
          if (
            (order.type === "Buy" && currentMarketPrice <= order.limitPrice) ||
            (order.type === "Sell" && currentMarketPrice >= order.limitPrice)
          ) {
            // Execute trade logic
            const executedOrder = await executeLimitOrder(order);
            return { ...executedOrder, isOpen: false, status: "Filled" };
          } else {
            return order;
          }
        } else {
          return order;
        }
      });

      // Wait for all promises to resolve
      const updatedOrders = await Promise.all(limitOrderPromises);

      // Update the array of limit orders
      setLimitOrders(updatedOrders);
    };

    const intervalId = setInterval(() => {
      checkLimitOrders();
    }, 1000); // Check every 1 seconds (adjust as needed)

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [props.bitcoinPrice, limitOrders, setLimitOrders, executeLimitOrder]);

  const thumbPosition = `calc(${(selectedMargin / 100) * 100}% - 0.5rem)`;

  const Buy = () => {
    if (spot) {
      spotBuy();
    } else if (margin) {
      marginBuy();
    }
  };

  const Sell = () => {
    if (spot) {
      spotSell();
    }
    // } else if (margin) {
    //     marginSell()
    // }
  };

  const spotBuy = () => {
    let cash = props.cash;
    let btcAmountInWallet = props.portfolioHoldings.btcAmount;
    let btcPrice = props.bitcoinPrice;
    let btcAmountToBuy = tradeQuantity.current.value;
    let usdCost = tradePrice.current.value * btcAmountToBuy;

    if (btcAmountToBuy === 0 || btcAmountToBuy === "") {
      alert("Please enter a quantity");
      return;
    }
    if (usdCost > cash) {
      alert("Not enough cash");
      return;
    }

    // buy at market price

    if (selectedOrderType === "Market") {
      let newCashBalance = (Number(cash) - Number(usdCost)).toFixed(2);
      let newBtcAmountInWallet =
        Number(btcAmountInWallet) + Number(btcAmountToBuy);
      let newBtcValueInWallet = newBtcAmountInWallet * btcPrice;
      let newPortfolioValue = newCashBalance + newBtcValueInWallet;
      let newPortfolioHoldings = {
        btcAmount: newBtcAmountInWallet,
        btcValue: newBtcValueInWallet,
        cash: newCashBalance,
      };
      let currentDate = new Date();
      let newPortfolioHistory = props.portfolioHistory;
      newPortfolioHistory.push(newPortfolioValue);
      let newTradeHistory = props.tradeHistory;
      newTradeHistory.push({
        isOpen: false,
        type: "Buy",
        market: "BTC-USD",
        price: tradePrice.current.value,
        quantity: btcAmountToBuy,
        value: usdCost,
        orderType: selectedOrderType,
        date: currentDate,
      });
      props.setCash(newCashBalance);
      props.setPortfolioHoldings(newPortfolioHoldings);
      props.setPortfolioHistory(newPortfolioHistory);
      props.setTradeHistory(newTradeHistory);
      console.log(props.tradeHistory);
    } else if (selectedOrderType === "Limit") {
      // open a limit position and wait for price to reach limit price
      // when the price reaches limit price, execute trade

      if (tradePrice.current.value === 0 || tradePrice.current.value === "") {
        alert("Please enter a price");
        return;
      }

      if (tradePrice.current.value > btcPrice) {
        alert("Limit price must be lower than current price");
        return;
      }

      let currentDate = new Date();

      const newLimitOrder = {
        isOpen: true,
        limitPrice: parseFloat(tradePrice.current.value),
        quantity: parseFloat(tradeQuantity.current.value),
        type: "Buy",
        market: "BTC-USD",
        date: currentDate,
        orderType: selectedOrderType,
        status: "Unfilled",
      };
      props.setLimitOrders([...limitOrders, newLimitOrder]);
      setSelectedForm("openOrders");
    }
  };

  const spotSell = () => {
    // sell at market price
    // check if user has enough btc
    // update cash
    // update portfolio holdings
    // update portfolio history
    // update trade history

    let cash = props.cash;
    let btcAmountInWallet = props.portfolioHoldings.btcAmount;
    let btcPrice = props.bitcoinPrice;
    let btcAmountToSell = tradeQuantity.current.value;
    let usdCost = tradePrice.current.value * btcAmountToSell;

    if (btcAmountToSell === 0 || btcAmountToSell === "") {
      alert("Please enter a quantity");
      return;
    }

    if (btcAmountToSell > btcAmountInWallet) {
      alert("Not enough BTC");
      return;
    }

    if (selectedOrderType === "Market") {
      let newCashBalance = (Number(cash) + Number(usdCost)).toFixed(2);
      let newBtcAmountInWallet =
        Number(btcAmountInWallet) - Number(btcAmountToSell);
      let newBtcValueInWallet = newBtcAmountInWallet * btcPrice;
      let newPortfolioValue = newCashBalance + newBtcValueInWallet;
      let newPortfolioHoldings = {
        btcAmount: newBtcAmountInWallet,
        btcValue: newBtcValueInWallet,
        cash: newCashBalance,
      };
      let currentDate = new Date();
      let newPortfolioHistory = props.portfolioHistory;
      newPortfolioHistory.push(newPortfolioValue);
      let newTradeHistory = props.tradeHistory;
      newTradeHistory.push({
        isOpen: false,
        type: "Sell",
        market: "BTC-USD",
        price: tradePrice.current.value,
        quantity: btcAmountToSell,
        value: usdCost,
        orderType: selectedOrderType,
        date: currentDate,
      });
      props.setCash(newCashBalance);
      props.setPortfolioHoldings(newPortfolioHoldings);
      props.setPortfolioHistory(newPortfolioHistory);
      props.setTradeHistory(newTradeHistory);
      console.log(props.tradeHistory);
    } else if (selectedOrderType === "Limit") {
      if (tradePrice.current.value === 0 || tradePrice.current.value === "") {
        alert("Please enter a price");
        return;
      }

      if (tradePrice.current.value < btcPrice) {
        alert("Limit price must be higher than current price");
        return;
      }

      // open a limit position and wait for price to reach limit price
      // when the price reaches limit price, execute trade

      let currentDate = new Date();

      const newLimitOrder = {
        isOpen: true,
        limitPrice: parseFloat(tradePrice.current.value),
        quantity: parseFloat(tradeQuantity.current.value),
        type: "Sell",
        market: "BTC-USD",
        date: currentDate,
        orderType: selectedOrderType,
        status: "Unfilled",
      };
      props.setLimitOrders([...limitOrders, newLimitOrder]);
      setSelectedForm("openOrders");
    }
  };

  function calculateLiquidationPrice(
    orderType,
    entryPrice,
    leverage,
    amount,
    balance
  ) {
    const numEntryPrice = parseFloat(entryPrice);
    const numLeverage = parseFloat(leverage);
    const numAmount = parseFloat(amount);
    const numBalance = parseFloat(balance);

    if (orderType === "Buy") {
      return (
        numEntryPrice * (1 - 1 / numLeverage) -
        (numBalance / (numAmount * numEntryPrice)) * (1 / numLeverage)
      );
    } else if (orderType === "Sell") {
      return (
        numEntryPrice * (1 + 1 / numLeverage) +
        (numBalance / (numAmount * numEntryPrice)) * (1 / numLeverage)
      );
    }
    return null;
  }

  const executeMarginOrder = useCallback(
    async (order) => {
      const currentMarketPrice = bitcoinPrice;
      const liquidationPrice = order.liquidationPrice;
      let profitLoss = 0;

      if (order.type === "Long") {
        profitLoss =
          (liquidationPrice - order.entryPrice) *
          order.quantity *
          order.leverage;
      } else if (order.type === "Short") {
        profitLoss =
          (order.entryPrice - liquidationPrice) *
          order.quantity *
          order.leverage;
      }

      // Update account balance
      let updatedBalance = cash + profitLoss;

      // Update order information
      let updatedOrder = {
        ...order,
        profitLoss: profitLoss,
        closedPrice: currentMarketPrice,
        status: "Executed",
      };

      // Update props or state here as needed
      setCash(updatedBalance);
      console.log("MarginOrder executed", updatedOrder, profitLoss);
      return updatedOrder;
    },
    [bitcoinPrice, cash, setCash] // Destructure needed properties from props
  );

  const checkForLiquidation = useCallback(async () => {
    const currentMarketPrice = props.bitcoinPrice;
    if (marginOrders.length > 0) {
      // Create a Promise for each margin order
      const marginOrderPromises = marginOrders.map(async (order) => {
        let profitLoss =
          (currentMarketPrice - order.entryPrice) *
          order.quantity *
          order.leverage;
        console.log(
          "P&L: " + profitLoss,
          "CurrentPrice: " + currentMarketPrice,
          "order quantity: " + order.quantity,
          "order entry price: " + order.entryPrice,
          "leverage: " + order.leverage,
          "btcPercentageChange: " +
            ((currentMarketPrice - order.entryPrice) / order.entryPrice) * 100 +
            "%",
          "btcPriceChange: " + (currentMarketPrice - order.entryPrice)
        );
        if (order.isOpen) {
          if (
            (order.type === "Long" &&
              currentMarketPrice <= order.liquidationPrice) ||
            (order.type === "Short" &&
              currentMarketPrice >= order.liquidationPrice)
          ) {
            // Execute trade logic
            const executedOrder = await executeMarginOrder(order);
            return { ...executedOrder, isOpen: false, status: "Liquidated" };
          } else {
            return order;
          }
        } else {
          return order;
        }
      });

      // Wait for all promises to resolve
      const updatedOrders = await Promise.all(marginOrderPromises);

      // Update the array of margin orders
      setMarginOrders(updatedOrders);
    }
  }, [props.bitcoinPrice, marginOrders, setMarginOrders, executeMarginOrder]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkForLiquidation();
    }, 1000); // Check every 1 seconds (adjust as needed)

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [
    props.bitcoinPrice,
    marginOrders,
    setMarginOrders,
    executeMarginOrder,
    checkForLiquidation,
  ]);

  const calculateProfitLoss = (
    quantity,
    entryPrice,
    leverage,
    currentMarketPrice
  ) => {
    let profitLoss = (currentMarketPrice - entryPrice) * quantity * leverage;
    return profitLoss;
  };

  const marginBuy = () => {
    let cash = props.cash; // User's cash
    let btcPrice = props.bitcoinPrice; // Current BTC price
    let usdAmountToBuy = parseFloat(tradeQuantity.current.value); // Quantity to buy
    let leverage = selectedMargin; // Selected leverage
    let btcAmountToBuy = usdAmountToBuy / btcPrice; // Quantity to buy in BTC
    let btcAmountToBuyToFixed = btcAmountToBuy.toFixed(6); // Quantity to buy in BTC rounded to 6 decimal places
    let quantityWithLeverage = btcAmountToBuyToFixed * leverage; // Quantity to buy in BTC with leverage

    if (btcAmountToBuy === 0 || btcAmountToBuy === "") {
      alert("Please enter a quantity");
      return;
    }
    if (usdAmountToBuy > cash) {
      alert("Not enough cash");
      return;
    }

    let newCashBalance = cash - usdAmountToBuy;
    let newLiquidationPrice = calculateLiquidationPrice(
      "Buy",
      btcPrice,
      leverage,
      btcAmountToBuy,
      newCashBalance
    );

    setLiquidationPrice(newLiquidationPrice);
    props.setCash(newCashBalance);
    setMarginOrders([
      ...marginOrders,
      {
        isOpen: true,
        status: "open",
        type: "Long",
        amount: usdAmountToBuy,
        entryPrice: btcPrice,
        market: "BTC-USD",
        leverage: leverage,
        stopLoss: 0,
        takeProfit: 0,
        liquidationPrice: newLiquidationPrice,
        quantity: quantityWithLeverage,
        profitLoss: calculateProfitLoss(
          quantityWithLeverage,
          btcPrice,
          leverage,
          btcPrice
        ),
        closedPrice: null,
      },
    ]);
    setSelectedForm("position");
  };

  return (
    <div className="glass w-full lg:w-1/4 py-3 px-4 flex flex-col gap-4 box-border select-none">
      <div className="flex justify-between items-center ">
        <p className="text-2xl">Trade</p>
        <p className="text-2xl">BTC-USD</p>
      </div>
      <div className="flex w-full glass">
        <div
          className={`py-2 w-full h-full text-[#ffffffb3] text-center rounded-[10px] cursor-pointer ${
            spot ? "bg-[#ffffffc0] text-[#050505b3]" : null
          }`}
          onClick={() => {
            setSpot(true);
            setMargin(false);
          }}
        >
          <p className={`${spot ? null : "hover:text-[white]"}`}>Spot</p>
        </div>
        <div
          className={`py-2 w-full h-full text-[#ffffffb3] text-center rounded-[10px] cursor-pointer ${
            margin ? "bg-[#ffffffc0] text-[#050505b3]" : null
          }`}
          onClick={() => {
            setMargin(true);
            setSpot(false);
          }}
        >
          <p className={`${margin ? null : "hover:text-[white]"}`}>Margin</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex w-full glass">
          <div
            className={`py-2 w-full h-full text-[#ffffffb3] text-center rounded-[10px] cursor-pointer ${
              buy ? "bg-[#175530c5] text-[#000000b3]" : null
            }`}
          >
            <p
              className={`${buy ? "text-[#35DF8D]" : "hover:text-[white]"}`}
              onClick={() => {
                setBuy(true);
                setSell(false);
              }}
            >
              Buy
            </p>
          </div>
          <div
            className={`py-2 w-full h-full text-[#ffffffb3] text-center rounded-[10px] cursor-pointer ${
              sell ? "bg-[#bd424071] text-[#000000b3]" : null
            }`}
          >
            <p
              className={`${sell ? "text-[#ff5454]" : "hover:text-[white]"}`}
              onClick={() => {
                setSell(true);
                setBuy(false);
              }}
            >
              Sell
            </p>
          </div>
        </div>
        {
          // dropdown with options for limit, market, stop, stop limit
        }
        <div className="py-2 w-full h-full text-center rounded-[10px] cursor-pointer glass hover:bg-[#ffffff36]">
          <div
            className="px-3 w-full h-full flex justify-between items-center"
            onClick={() => setDropdown(!dropdown)}
          >
            <p className="text-white text-sm">{selectedOrderType}</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#ffffffb3]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div
            className={`z-50 mt-3 absolute w-full bg-[#0d0b0e] rounded-[10px] transition duration-500 ease-in-out transform select-none ${
              dropdown ? "block" : "hidden"
            }`}
          >
            <div className="flex flex-col gap-2">
              <div
                className="flex justify-between items-center py-2 px-4 rounded-[10px] cursor-pointer hover:bg-[#ffffff1e] m-1"
                onClick={() => {
                  setSelectedOrderType("Limit");
                  setDropdown(false);
                }}
              >
                <p className="text-[#ffffff]">Limit</p>
              </div>
              <div
                className="flex justify-between items-center py-2 px-4 rounded-[10px] cursor-pointer hover:bg-[#ffffff1e] m-1"
                onClick={() => {
                  setSelectedOrderType("Market");
                  setDropdown(false);
                }}
              >
                <p className="text-[#ffffff]">Market</p>
              </div>
              <div
                className="flex justify-between items-center py-2 px-4 rounded-[10px] cursor-pointer hover:bg-[#ffffff1e] m-1"
                onClick={() => {
                  setSelectedOrderType("Stop Loss");
                  setDropdown(false);
                }}
              >
                <p className="text-[#ffffff]">Stop Loss</p>
              </div>
              <div
                className="flex justify-between items-center py-2 px-4 rounded-[10px] cursor-pointer hover:bg-[#ffffff1e] m-1"
                onClick={() => {
                  setSelectedOrderType("Take Profit");
                  setDropdown(false);
                }}
              >
                <p className="text-[#ffffff]">Take Profit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        //order price
      }
      <div className="py-2 px-5 glass border-transparent rounded-lg focus:ring-[#3578ff]">
        <div
          className="w-full flex justify-between items-center gap-x-3"
          data-hs-input-number
        >
          <div>
            <span className="block text-md text-[#ffffffb3]">
              {selectedOrderType} price
            </span>
            {
              //if market order, disable input
              selectedOrderType === "Market" ? (
                <input
                  className="p-0 bg-transparent border-0 text-white outline-none border-none w-full"
                  type="text"
                  value={props.bitcoinPrice}
                  data-hs-input-number-input
                  ref={tradePrice}
                  readOnly
                />
              ) : (
                <input
                  className="p-0 bg-transparent border-0 text-white outline-none border-none"
                  type="text"
                  placeholder={props.bitcoinPrice}
                  data-hs-input-number-input
                  ref={tradePrice}
                />
              )
            }
          </div>
          <div className="flex justify-end items-center gap-x-1.5">
            <p className="">USD</p>
          </div>
        </div>
      </div>
      {
        //order quantity in BTC or USD
      }
      <div className="flex gap-4">
        <div className="py-1 px-5 glass border-transparent rounded-lg focus:ring-[#3578ff]">
          <div
            className="w-full flex justify-between items-center gap-x-3"
            data-hs-input-number
          >
            <div>
              <span className="block text-md text-[#ffffffb3]">Quantity</span>
              <input
                className="p-0 bg-transparent border-0 text-white outline-none border-none w-full"
                type="number"
                placeholder="0.01"
                data-hs-input-number-input
                ref={tradeQuantity}
              />
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              {margin ? <p className="">USD</p> : <p className="">BTC</p>}
            </div>
          </div>
        </div>
        <div className="py-1 px-5 glass border-transparent rounded-lg focus:ring-[#3578ff]">
          <div
            className="w-full flex justify-between items-center gap-x-3"
            data-hs-input-number
          >
            <div>
              <span className="block text-md text-[#ffffffb3]">Total</span>
              {spot ? (
                <input
                  className="p-0 bg-transparent border-0 text-white outline-none border-none w-full"
                  type="number"
                  value={total}
                  readOnly
                  data-hs-input-number-input
                />
              ) : (
                <input
                  className="p-0 bg-transparent border-0 text-white outline-none border-none w-full"
                  type="number"
                  value={total * selectedMargin}
                  readOnly
                  data-hs-input-number-input
                />
              )}
            </div>
            <div className="flex justify-end items-center gap-x-1.5">
              {margin ? <p className="">BTC</p> : <p className="">USD</p>}
            </div>
          </div>
        </div>
      </div>
      {
        //leverage slider
      }
      {margin ? (
        <>
          <div className="flex flex-col">
            <p className="text-[#ffffffb3]">Margin</p>
            <div className="relative">
              <input
                type="range"
                className={`w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
                        [&::-webkit-slider-thumb]:w-3
                        [&::-webkit-slider-thumb]:h-3
                        [&::-webkit-slider-thumb]:-mt-0.5
                        [&::-webkit-slider-thumb]:appearance-none
                        ${
                          buy
                            ? "[&::-webkit-slider-thumb]:bg-[#35DF8D]"
                            : "[&::-webkit-slider-thumb]:bg-[#ff5454]"
                        }
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:transition-all
                        [&::-webkit-slider-thumb]:duration-150
                        [&::-webkit-slider-thumb]:ease-in-out
                        
                        [&::-webkit-slider-runnable-track]:w-full
                        [&::-webkit-slider-runnable-track]:h-2
                        ${
                          buy
                            ? "[&::-webkit-slider-runnable-track]:bg-[#175530c5]"
                            : "[&::-webkit-slider-runnable-track]:bg-[#bd424071]"
                        }
                        
                        [&::-webkit-slider-runnable-track]:rounded-full`}
                id="min-and-max-range-slider-usage"
                min="2"
                max="100"
                step="1"
                value={selectedMargin}
                onChange={(e) => {
                  setSelectedMargin(e.target.value);
                }}
              ></input>
              <div
                className="absolute"
                style={{
                  top: "32px",
                  left: thumbPosition,
                  transform: "translateY(-50%)",
                }}
              >
                {selectedMargin}x
              </div>
            </div>
          </div>
        </>
      ) : null}
      <div className="flex justify-between items-center text-[#ffffffb3]">
        <p className="text-sm">Available Balance</p>
        {
          //if buy, show cash, else show btc
          buy ? (
            <p className="text-sm">
              <span className="text-white">{props.cash}</span> USD
            </p>
          ) : (
            <p className="text-sm">
              <span className="text-white">
                {props.portfolioHoldings.btcAmount}
              </span>{" "}
              BTC
            </p>
          )
        }
      </div>
      <div className="flex justify-between items-center  text-[#ffffffb3]">
        <p className="text-sm">Estimated Cost</p>
        <p className="text-sm">
          <span className="text-white">{total}</span> USD
        </p>
      </div>
      {
        //place order button
        buy ? (
          <div
            className="flex justify-center items-center py-3 px-4 rounded-[10px] cursor-pointer bg-[#175530c5] select-none"
            onClick={Buy}
          >
            <p className="text-[#ffffff]">Buy BTC-USD</p>
          </div>
        ) : (
          <div
            className="flex justify-center items-center py-3 px-4 rounded-[10px] cursor-pointer bg-[#bd424071] select-none"
            onClick={Sell}
          >
            <p className="text-[#ffffff]">Sell BTC-USD</p>
          </div>
        )
      }
    </div>
  );
}

export default TradeStation;
