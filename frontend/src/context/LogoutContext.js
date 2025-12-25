import { createContext, useState } from "react";

export const LogOutContext = createContext();


export const LogOutProvider = ({ children }) => {

    // Global Data
    const [isLogout, setIsLogout] = useState(false);
    return (
        // Provider Context
        <LogOutContext.Provider value={{ isLogout, setIsLogout }}>
            {children}
        </LogOutContext.Provider>
    );
}