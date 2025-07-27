import { Cards } from '../components/card/card'
import { Statistics } from '../components/card/Statistics'
import { Navbar } from "../components/navigation/Navbar"
import { Table } from '../components/table/Table'
import { api } from '../api/apiRoutes'
import { useContext, useEffect, useState } from 'react'
import { Context } from '../api/contextProvider'
import { Footer } from '../components/Footer'
import {motion} from 'framer-motion'
import { AddStatistics } from '../components/form/addStatistics'


export const Home = () => {
const {optionBanner, setOptionBanner} = useContext(Context);
 
    return(
        <div className="flex h-auto bg-gray-100">
            <div className="h-screen w-[360px] px-3 py-4 sticky top-0 z-10">
                <div className="w-full h-full bg-white rounded-md shadow-lg border border-gray-300">
                    <div className='flex justify-center items-center p-5'>
                        <p>Dashbroard Material Tailwind</p>
                    </div>
                    <div>
                        <ul className='flex flex-col p-5 w-full justify-center space-y-2'>
                            <li onClick={() => setOptionBanner('Statistics') } className={`${optionBanner === 'Statistics' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i class="fa-solid fa-house px-5"></i>Estadisticas</li>
                            <li onClick={() => setOptionBanner('Tables') }  className={`${optionBanner === 'Tables' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i class="fa-solid fa-user px-5"></i>Tablas</li>
                            <li onClick={() => setOptionBanner('AddStatistics') }  className={`${optionBanner === 'AddStatistics' ? 'bg-gray-800 text-white shadow-lg cursor-pointer' : 'hover:bg-gray-400 hover:text-white text-gray-400 '} transition duration-500 ease-in-out p-2 cursor-pointer rounded-md`}><i class="fa-solid fa-user px-5"></i>Tablas</li>
                            <li className=' p-2 rounded-md text-gray-400 hover:bg-gray-400 hover:text-white cursor-pointer'><i class="fa-solid fa-circle-exclamation px-5"></i>Notificaition</li>
                        </ul>
                    </div>
                </div>
           </div>
           <div className="w-full">
             <div className="sticky top-0 w-full z-50 p-4">
                <Navbar/>
             </div>
            {optionBanner === 'Statistics' &&
              <motion.div
                initial = {{x: -100, opacity: 0 }}
                animate = {{x: 0, opacity:1}}
                transition = {{duration: 0.6, ease: 'easeInOut'}}
              >
                <Cards/>
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

            { optionBanner === 'AddStatistics' &&
              <AddStatistics/>
            }

            <Footer/>
           </div>
           
        </div>
    )
}