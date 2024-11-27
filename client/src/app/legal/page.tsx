"use client";

import React from "react";
import Image from "next/image";

function page() {
  return (
    <>
      <div className="m-4 mt-0 text-l text-justify">
        The information provided by the CaliGo app is for general informational
        purposes only. All information on the app is provided in good faith,
        however, we make no representation or warranty of any kind, express or
        implied, regarding the accuracy, adequacy, validity, reliability,
        availability, or completeness of any information on the app. Users are
        advised to use their judgment and exercise caution while visiting any
        location suggested by CaliGo. CaliGo does not condone trespassing or any
        illegal activity associated with visiting any location. It is the
        responsibility of the user to ensure they are not trespassing or
        violating any local laws or regulations. CaliGo shall not be liable for
        any risks, injuries, or damages of any kind arising from your use of the
        app or reliance on any information provided by the app. Users are
        encouraged to respect property rights and personal safety at all times.
      </div>
      <h2 className="m-10 text-center">
        WE ARE NOT RESPONSIBLE FOR YOUR ACTIONS, PROCEED AT YOUR OWN RISKS
      </h2>
      <div className="relative w-full p-4 flex justify-between items-center z-10">
        <button onClick={() => (window.location.href = "/profile")}>
          <Image src="/icons/close.png" alt="Close" width={32} height={32} />
        </button>
      </div>
    </>
  );
}

export default page;
