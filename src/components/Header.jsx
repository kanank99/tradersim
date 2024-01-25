import React from "react";

function Header(props) {
  return (
    <div className="flex justify-between items-center py-4 px-8 ">
      <h1 className="glass py-3 px-4 text-2xl">TraderSim</h1>
      <div className="flex gap-5">
        <p className="glass py-3 px-4 text-2xl">
          {props.equity} <span className="text-[#ffffffb3]">USD</span>
        </p>
        <p className="glass py-3 px-4 text-2xl">
          {props.cash} <span className="text-[#ffffffb3]">USD</span>
        </p>
      </div>
    </div>
  );
}

export default Header;
