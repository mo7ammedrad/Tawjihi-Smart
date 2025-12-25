//react
import { createContext, useState } from "react";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    // Global Data
    const [isAuth, setIsAuth] = useState(false);
    return (
        // Provider Context
        <AuthContext.Provider value={{ isAuth, setIsAuth }}>
            {children}
        </AuthContext.Provider>
    );
}