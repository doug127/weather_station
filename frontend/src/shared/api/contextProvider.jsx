import { useContext, createContext, useState, useEffect } from "react"

export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [optionBanner, setOptionBanner] = useState(() => {
        return localStorage.getItem('optionBanner') || 'Init';
    });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
        
    const [currentArticle, setCurrentArticle] = useState(null);
    
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
            currentArticle, setCurrentArticle,
            isSidebarOpen, setIsSidebarOpen
        }}>
            {children}
        </Context.Provider>
    )
}