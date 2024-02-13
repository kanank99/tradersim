import React from "react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header(props) {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSignOut = () => {
    try {
      signOut(auth);
      setShowSettingsModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
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
          <button
            className="setting-btn glass"
            onClick={() => setShowSettingsModal(!showSettingsModal)}
          >
            <span className="bar bar1"></span>
            <span className="bar bar2"></span>
            <span className="bar bar1"></span>
          </button>
        </div>
      </div>
      <div
        className={`fixed inset-0 z-50 ${
          showSettingsModal ? "flex" : "hidden"
        } w-full items-center justify-center`}
      >
        <div className="p-4 sm:p-7 glass">
          <div class="mt-7 glass border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 dark">
            <button
              type="button"
              class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </div>
          <div class="mt-7 glass border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700 dark">
            <button
              type="button"
              class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div
        className={`absolute inset-0 bg-black bg-opacity-50 ${
          showSettingsModal ? "block" : "hidden"
        }`}
      ></div>
    </>
  );
}

export default Header;
