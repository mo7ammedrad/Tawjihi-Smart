// context/ModalContext.js
import { createContext, useState } from "react";

export const SideBarContext = createContext();

export const SideBarContextProvider = ({ children }) => {
  // Global Data
  const [isOpen, setIsOpen] = useState(false);

  return (
    //Provider Context
    <SideBarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SideBarContext.Provider>
  );
};
