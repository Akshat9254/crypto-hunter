import React, { createContext, useContext, useEffect, useState } from "react";
const Context = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [currencySymbol, setCurrencySymbol] = useState("₹");

  useEffect(() => {
    currency === "INR" ? setCurrencySymbol("₹") : setCurrencySymbol("$");
  }, [currency]);
  return (
    <Context.Provider value={{ currency, currencySymbol, setCurrency }}>
      {children}
    </Context.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Context);
};
