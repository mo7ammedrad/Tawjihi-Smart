//react
import { createContext, useState } from "react";

export const NewOldContext = createContext();

export const NewOldProvider = ({ children }) => {

    // Global Data
    const [isNew, setIsNew] = useState('new');

    return (
        // Provider Context

        <NewOldContext.Provider value={{ isNew, setIsNew }}>
            {children}
        </NewOldContext.Provider>
    );
};
