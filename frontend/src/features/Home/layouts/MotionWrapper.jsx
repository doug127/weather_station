import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";


export const MotionWrapper = ({ children }) => {
  const location = useLocation();
  return(
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
};