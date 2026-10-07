import React, { Activity } from "react";
import Logo from "./assets/logo.svg";
import Livemarkets from "./Livemarkets";
import { CURRENCIES, POPULAR_CURRENCIES } from "./currency";

const Header: React.FC = () => {
  return (
    <div>
      <header className="p-4 sm:px-6 sm:py-5 flex justify-between items-center">
        <h1>
          <img src={Logo} alt="FX Checker Logo" className="h-5" />
        </h1>
        <p className="uppercase text-preset-6 text-neutral-200">
          {CURRENCIES.length + POPULAR_CURRENCIES.length} currencies · EOD · ECB
          Data
        </p>
      </header>
      <Activity>
        <Livemarkets />
      </Activity>
    </div>
  );
};

export default Header;
