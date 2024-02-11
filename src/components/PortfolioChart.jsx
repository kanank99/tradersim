import React from "react";
import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PortfolioChart(props) {
  const [portfolioValueHistory, setPortfolioValueHistory] = useState([]);

  // Update to track portfolio value history
  // useEffect(() => {
  //   const updatePortfolioHistory = () => {
  //     // Assuming you call this function periodically or on update of portfolioValue
  //     const currentTime = new Date().toLocaleTimeString();
  //     const newEntry = {
  //       time: currentTime,
  //       value: props.portfolioValue,
  //     };
  //     setPortfolioValueHistory((currentHistory) => [
  //       ...currentHistory,
  //       newEntry,
  //     ]);
  //   };

  //   updatePortfolioHistory();
  // }, [props.portfolioValue]);

  useEffect(() => {
    // Function to simulate adding new data
    const addPortfolioValue = () => {
      const newTime = new Date();
      const newEntry = {
        time: `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`,
        value: props.portfolioValue,
      };
      setPortfolioValueHistory((currentHistory) => [
        ...currentHistory,
        newEntry,
      ]);
    };

    // Set up interval to add new data every minute
    const intervalId = setInterval(addPortfolioValue, 60000); // 60000 ms = 1 minute

    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [props.portfolioValue]);

  // Recharts data expects an array of objects, each with a consistent schema
  const chartData = portfolioValueHistory.map((entry) => ({
    time: entry.time,
    value: entry.value,
  }));

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="transparent" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#22c55e"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PortfolioChart;
