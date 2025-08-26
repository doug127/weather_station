import { useContext, createContext, useState, useEffect, use } from "react"

export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [optionBanner, setOptionBanner] = useState(() => {
        return localStorage.getItem('optionBanner') || 'Statistics';
    });
    
    useEffect(() => {
        const saved = localStorage.getItem('optionBanner');
        if (saved) {
            setOptionBanner(saved);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('optionBanner', optionBanner);
    }, [optionBanner]);

    return(
        <Context.Provider value={{
            optionBanner,setOptionBanner,
            
        }}>
            {children}
        </Context.Provider>
    )
}