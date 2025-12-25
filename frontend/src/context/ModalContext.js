// react
import { createContext, useState } from "react";

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  // Global Data
  const [isOpen, setIsOpen] = useState(false);

  return (
    //Provider Context
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  );
};
