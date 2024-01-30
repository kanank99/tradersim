import React from "react";

function Header(props) {
  return (
    <div className="flex justify-between items-center py-4 px-8 ">
      <h1 className="glass py-3 px-4 text-2xl">TraderSim</h1>
      <div className="flex gap-5">
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <p className="white-border glass flex justify-center items-center p-4 text-xl h-[45px]">
                {props.equity} <span className="text-[#ffffffb3]">USD</span>
              </p>
            </div>
            <div className="flip-card-back">
              <p className="white-border glass flex justify-center items-center p-4 text-xl h-[45px]">
                Equity
              </p>
            </div>
          </div>
        </div>
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <p className="white-border glass flex justify-center items-center p-4 text-xl h-[45px]">
                {props.cash} <span className="text-[#ffffffb3]">USD</span>
              </p>
            </div>
            <div className="flip-card-back">
              <p className="white-border glass flex justify-center items-center p-4 text-xl h-[45px]">
                Cash
              </p>
            </div>
          </div>
        </div>
        <button className="setting-btn glass">
          <span className="bar bar1"></span>
          <span className="bar bar2"></span>
          <span className="bar bar1"></span>
        </button>
      </div>
    </div>
  );
}

export default Header;
