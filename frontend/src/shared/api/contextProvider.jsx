import { createContext, useState } from "react";

export const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  return (
    <Context.Provider
      value={{
        isSidebarOpen,
        setIsSidebarOpen,
        currentArticle,
        setCurrentArticle,
      }}
    >
      {children}
    </Context.Provider>
  );
};
