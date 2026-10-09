import { useEffect } from "react";
import type { State } from "./util";

interface InvalidCurrencyProp {
  showError: boolean;
  setShowError: State<boolean>;
}

const InvalidCurrencyError: React.FC<InvalidCurrencyProp> = ({
  showError,
  setShowError,
}) => {
  useEffect(() => {
    if (!showError) return;

    const timeoutId = setTimeout(() => {
      setShowError(false);
    }, 5000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showError]);

  return (
    <div
      className={
        "fixed top-9 bg-red-500/50 border border-red-500 inset-x-[50%] translate-x-[-50%] w-[80vw] max-w-180 text-preset-4 py-4 px-8 rounded-lg text-center transition-transform delay-300 z-1000 " +
        (!showError ? "-translate-y-32" : "")
      }
      aria-live="assertive"
      aria-atomic="false"
    >
      <p>The currency pair does not have a rate and therefore cannot be set</p>
    </div>
  );
};

export default InvalidCurrencyError;
