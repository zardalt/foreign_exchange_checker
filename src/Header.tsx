import React from "react";
import Logo from "./assets/logo.svg";
import Livemarkets from "./Livemarkets";

const Header: React.FC = () => {
  return (
    <div>
      <header className="p-4 flex justify-between items-center">
        <h1>
          <img src={Logo} alt="FX Checker Logo" className="h-5" />
        </h1>
        <p className="uppercase text-preset-6 text-neutral-200">
          55 currencies · EOD · ECB Data
        </p>
      </header>
      <Livemarkets />
    </div>
  );
};

export default Header;
