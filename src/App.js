import "./App.css";
import FetchCoinPrices from "./components/FetchCoinPrices";

function App() {
  return (
    <div className="font-jost h-[100%]">
      <div className="absolute bodyBackground w-full h-full -z-10"></div>
      <FetchCoinPrices />
    </div>
  );
}

export default App;
