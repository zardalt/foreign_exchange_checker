import React, { useState } from "react";
import CurrencyPicker from "./components/CurrencyPicker";
import { currencyImgTable } from "./types/currency";

const USD_TO_EUR = 0.853;

const Converter: React.FC = () => {
  const [sendSelectedCurrency, setSendSelectedCurrency] =
    useState<keyof typeof currencyImgTable>("USD");
  const [recieveSelectedCurrency, setRecieveSelectedCurrency] =
    useState<keyof typeof currencyImgTable>("EUR");

  return (
    <main className="space-y-4">
      <h2 className="uppercase text-preset-2">Check the Rate</h2>

      <div className="bg-neutral-700 shadow-[0_12px_40px_0_rgb(0_0_0/0.4)] rounded-[1.25em]">
        <form className="p-4 space-y-4">
          <div className="space-y-5 p-4 rounded-2xl container-preset-1">
            <h3 className="uppercase text-preset-4 text-neutral-100">Send</h3>
            <div className="flex justify-between items-center">
              <input
                className="text-preset-1 w-fit max-w-[40%]"
                type="text"
                inputMode="numeric"
                defaultValue="1,000"
                placeholder="0"
              />
              <CurrencyPicker
                id="sendCurrency"
                anchorName="--send-currency"
                selectedCurrency={sendSelectedCurrency}
                setSelectedCurrency={setSendSelectedCurrency}
              />
            </div>
          </div>
          <button
            className="size-12 rounded-lg bg-neutral-600 border border-neutral-500 bg-no-repeat bg-center bg-[url(/images/vertical_exchange.svg)] bg-size-[1.25em] mx-auto block"
            type="submit"
            aria-label="Exchange"
          ></button>
          <div className="space-y-5 p-4 rounded-2xl container-preset-1">
            <h3 className="text-preset-4 uppercase text-neutral-100">
              Recieve
            </h3>
            <div className="flex items-center justify-between">
              <output className="text-preset-1 text-lime-500">
                {USD_TO_EUR * 1000}
              </output>
              <CurrencyPicker
                id="recieveCurrency"
                anchorName="--recieve-currency"
                selectedCurrency={recieveSelectedCurrency}
                setSelectedCurrency={setRecieveSelectedCurrency}
              />
            </div>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Converter;
