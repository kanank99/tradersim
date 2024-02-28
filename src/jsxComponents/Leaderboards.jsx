import React from "react";
import { useEffect } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path to your Firebase config accordingly

function Leaderboards() {
  let leaderboardStandings = [];

  const getLeaderboard = async () => {
    const q = query(collection(db, "users"), orderBy("cash", "desc"));
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push(doc.data());
    });
    return leaderboard;
  };

  useEffect(() => {
    getLeaderboard().then((leaderboard) => {
      leaderboardStandings = leaderboard;
      console.log("This is leaderboardStandings: " + leaderboardStandings);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl text-center uppercase text-[#ffffffb3] font-light mt-2 tracking-wide">
        Leaderboards
      </h1>
      {leaderboardStandings.map((user, index) => {
        return (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-[#ffffff1a] border-b border-[#ffffff1a]"
          >
            <p className="text-lg text-[#ffffffb3]">{user.displayName}</p>
            <p className="text-lg text-[#ffffffb3]">${user.cash}</p>
          </div>
        );
      })}
    </div>
  );
}

export default Leaderboards;
