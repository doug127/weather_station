import { useState, useEffect } from "react";

export const useTickAmount = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024); 
    };

    handleResize(); // inicial
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);
    return isSmallScreen ? 6 : 12;  
};