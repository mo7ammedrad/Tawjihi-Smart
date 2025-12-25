//react
import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
    //Global Data
    const [search, setSearch] = useState("");

    return (
        // Provider Context
        <SearchContext.Provider value={{ search, setSearch }}>
            {children}
        </SearchContext.Provider>
    );
};
