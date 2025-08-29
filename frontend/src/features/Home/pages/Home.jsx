// import { Cards } from '../../components/card/card'
import { Statistics } from '../components/statistics/Statistics'
import { Navbar } from "../components/navigation/Navbar"
import { Table } from '../components/table/Table'
import { useContext } from 'react'
import { Context } from '../../../shared/api/contextProvider'
import { Footer } from '../components/Footer'
import { motion } from 'framer-motion'
import { AddStatistics } from '../components/forms/addStatistics'
import { AddValues } from '../components/forms/addValues'
import { Landing } from '../components/landing/Landing'
import { Article } from '../components/articles/Article'
import { RequireRole } from '@/shared/components/role/RequireRole'
import { AuthContext } from '@/shared/hooks/AuthContext'

export const Home = () => {
    const {optionBanner, setOptionBanner} = useContext(Context);
    const { user } = useContext(AuthContext);
    const role_admin_id = 1;
    return(
        <div className="flex h-auto bg-gray-100">
          <div className="h-screen w-[360px] px-3 py-4 sticky top-0 z-10">
              <div className="w-full h-full bg-white rounded-md shadow-lg border border-gray-300">
                  <div className='flex justify-center items-center p-5'>
                      <p>Estación Meteorológica</p>
                  </div>
                  <div>
                      <ul className='flex flex-col p-5 w-full justify-center space-y-2'>
                          <li onClick={() => setOptionBanner('Init')} className={`${optionBanner === 'Init' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i className="fa-solid fa-house px-5"></i>Reseña Histórica</li>
                          <li onClick={() => setOptionBanner('Articles')} className={`${optionBanner === 'Articles' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i className="fa-solid fa-newspaper px-5"></i>Artículos</li>
                          <li onClick={() => setOptionBanner('Statistics') } className={`${optionBanner === 'Statistics' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i className="fa-solid fa-chart-column px-5"></i>Estadisticas</li>
                          <li onClick={() => setOptionBanner('Tables') }  className={`${optionBanner === 'Tables' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i className="fa-solid fa-table px-5"></i>Tablas</li>
                          <RequireRole roles={[role_admin_id]} user={user}>
                            <li onClick={() => setOptionBanner('AddStatistics') }  className={`${optionBanner === 'AddStatistics' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i className="fa-solid fa-chart-line px-5"></i>Registrar sensor</li>
                            <li onClick={() => setOptionBanner('AddValues') } className={`${optionBanner === 'AddValues' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i className="fa-solid fa-chart-simple px-5"></i>Registrar valores</li>
                          </RequireRole>
                      </ul>
                  </div>
              </div>
          </div>
          <div className="w-full">
              <div className="sticky top-0 w-full z-50 p-4">
                  <Navbar/>
              </div>
             {optionBanner === 'Init' &&
              <motion.div
                initial = {{x: -100, opacity: 0 }}
                animate = {{x: 0, opacity:1}}
                transition = {{duration: 0.6, ease: 'easeInOut'}} 
              >
                <Landing />
              </motion.div>
              }
            {optionBanner === 'Articles' &&
              <motion.div
                initial = {{x: -100, opacity: 0 }}
                animate = {{x: 0, opacity:1}}
                transition = {{duration: 0.6, ease: 'easeInOut'}}
              >
                <Article />
              </motion.div>
            }
            {optionBanner === 'Statistics' &&
              <motion.div
                initial = {{x: -100, opacity: 0 }}
                animate = {{x: 0, opacity:1}}
                transition = {{duration: 0.6, ease: 'easeInOut'}}
              >
                {/* <Cards/> */}
                <Statistics/>
              </motion.div>
            }
            {optionBanner === 'Tables' && 
              <motion.div
                  initial = {{x: -100, opacity: 0 }}
                  animate = {{x: 0, opacity:1}}
                  transition = {{duration: 0.6, ease: 'easeInOut'}} 
              >
                <Table/>
              </motion.div>
            }
            <RequireRole roles={[role_admin_id]} user={user}>
              {optionBanner === 'AddStatistics' && 
                <motion.div
                    initial = {{x: -100, opacity: 0 }}
                    animate = {{x: 0, opacity:1}}
                    transition = {{duration: 0.6, ease: 'easeInOut'}} 
                >
                  <AddStatistics/>
                </motion.div>
              }
              {optionBanner === 'AddValues' && 
                <motion.div
                    initial = {{x: -100, opacity: 0 }}
                    animate = {{x: 0, opacity:1}}
                    transition = {{duration: 0.6, ease: 'easeInOut'}} 
                >
                  <AddValues/>
                </motion.div>
              }
            </RequireRole>
            <Footer/>
          </div>  
        </div>
    )
}