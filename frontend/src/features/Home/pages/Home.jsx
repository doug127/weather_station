import { useContext } from 'react'
import { Statistics } from '../layouts/Statistics'
import { Table } from '../layouts/Table'
import { Context } from '@/shared/api/contextProvider'
import { motion } from 'framer-motion'
import { AddSensor } from '../layouts/AddSensor'
import { AddValues } from '../layouts/AddValues'
import { Landing } from '../layouts/Landing'
import { Article } from '../layouts/Article'
import { RequireRole } from '@/shared/components/role/RequireRole'
import { AuthContext } from '@/shared/hooks/AuthContext'
import { User } from '@/features/Home/layouts/User'
import { SkeletonPage } from '@/shared/components/skeletons/SkeletonPage'

export const Home = () => {
    const {optionBanner} = useContext(Context);
    const { user } = useContext(AuthContext);
    
    const ROLE_SUPERADMIN = 1;
    const ROLE_ADMIN = 2;
    const ROLET_USER = 3;


    return(
        <div className="p-6">
        {optionBanner === "Init" && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Landing />
          </motion.div>
        )}

        {optionBanner === "Articles" && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Article />
          </motion.div>
        )}

        {optionBanner === "Statistics" && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Statistics />
          </motion.div>
        )}

        {optionBanner === "Tables" && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Table />
          </motion.div>
        )}

        <RequireRole roles={[ROLE_ADMIN, ROLE_SUPERADMIN ]} user={user}>
          {optionBanner === "AddSensor" && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <AddSensor />
            </motion.div>
          )}

          {optionBanner === "AddValues" && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <AddValues />
            </motion.div>
          )}
        </RequireRole>
        {optionBanner === "User" && (
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <User />
          </motion.div>
        )}
      </div>
    )
}