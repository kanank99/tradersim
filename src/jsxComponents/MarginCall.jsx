import React from "react";
import "../marginCall.css";

function MarginCall(props) {
  return (
    <div class="stripe border-2 rounded-lg border-red-300 shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#EF4444,0_0_15px_#EF4444,0_0_30px_#EF4444] my-3">
      <div class="stripe_inner">MARGIN CALL</div>
      <p class="absolute z-10 bottom-3 white">
        Liquidate your holdings to cover the margin shortfall or{" "}
        <button
          className="text-orange-500 underline"
          onClick={props.executeStartOver}
        >
          Start Over
        </button>
        .
      </p>
    </div>
  );
}

export default MarginCall;
