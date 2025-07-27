import { useEffect, useState } from "react"
import { api } from "../../api/apiRoutes";

export const AddStatistics = () => {
    const [step, setStep] = useState([1]);
    const [stepOne, setStepOne] = useState(false);
    const [addForm, setAddForm] = useState('form');
 
    const [valueSensor, setValueSensor] = useState("");
    const [inputSensor, setInputSensor] = useState(false);

    const [valueCodigo, setValueCodigo] = useState("");
    const [inputCodigo, setInputCodigo] = useState(false);

    const [valueNombre, setValueNombre] = useState("");
    const [inputNombre, setInputNombre] = useState(false);
    
    const [selectedVariable, setSelectedVariable] = useState("");
    const [selectedUnidad, setSelectedUnidad] = useState("");


   
        const sendData = async (e) => {
            e.preventDefault();
            try {
                 const response = await api.post('/sensor/create', {
                     serial: valueSensor,
                     codigo: valueCodigo,
                     nombre: valueNombre,
                     variable: selectedVariable,
                     unidad: selectedUnidad,
                 });

                console.log('datos enviados', Response.data);
               
                setValueSensor("");
                setValueCodigo("");
                setValueNombre("");
                setSelectedVariable("");
                setSelectedUnidad("");
                setAddForm('form'); 
                setStep([1]); 
                setStepOne(false);


            } catch (error) {
                console.error("Error al enviar los datos:", error);
                
            }
        }

    useEffect(() => {
         if (
        valueSensor.trim() !== "" &&
        valueCodigo.trim() !== "" &&
        valueNombre.trim() !== "" &&
        selectedVariable.trim() !== "" &&
        selectedUnidad.trim() !== ""
        ) {
            setStepOne(true);
        } else {
            setStepOne(false);
        }
    },[valueSensor, valueCodigo, valueNombre, selectedVariable, selectedUnidad])



    const addStep = (num) => {
        setStep(prev => prev.includes(num) ? prev : [...prev, num]);
    };

    const removeStep = (num) => {
        setStep(prev => prev.filter(n => n !== num));
    }

    return (
        <div className="w-full">
                <div className="w-full h-full flex flex-col justify-center items-center p-5">
                    <div className="w-full h-24 flex justify-center items-center mb-4">
                        <div className={`w-20 h-20 rounded-full border-4 ${stepOne ? 'border-green-400' : 'border-gray-400'} flex justify-center items-center`}>
                            <p><i class="fa-solid fa-1 text-xl"></i></p>
                        </div>
                        <div className="w-20 h-1  bg-gray-400 relative overflow-hidden">
                            <div className={`w-full h-full bg-green-400 absolute ${step.includes(2) ? 'left-0' : '-left-20'} trnsition duration-500 ease-in-out`}></div>
                        </div>
                         <div className={`w-20 h-20 rounded-full border-4  ${step.includes(2) ? 'border-green-400' : 'border-gray-400'} flex justify-center items-center transition duration-700 ease-in-out`}>
                            <p><i class="fa-solid fa-2 text-xl"></i></p>
                        </div>
                        
                    </div>
                     <div className="w-full h-96 flex flex-col justify-center items-center">
                            <div className="relative p-4 w-[700px] h-full bg-white shadow-lg border py-7 overflow-hidden rounded-md">
                    
                            <form className={`absolute transition-all duration-500 ease-in-out w-full h-full bg-red- p-5 ${addForm === 'finish' ? 'pointer-events-none -left-[100%] opacity-0' : 'opacity-100 left-0'}`}>
                            <div className="w-full flex flex-col space-y-4 ">
                                 <div className="flex space-x-2 w-full h-full justify-center items-center">
                                 <div className="flex relative items-center w-full">
                                <label
                                className={`pointer-events-none absolute p-2 transition-[top, font-size] duration-200 ease-in-out h-5
                                ${inputSensor || valueSensor ? '-top-4 text-xs left-2 bg-white' : 'text-gray-400 left-2 top-0'}`}>
                                    Serial</label>
                                <input className="p-2 border border-gray-200 rounded-md outline-none w-full"
                                value={valueSensor}
                                onChange={e => setValueSensor(e.target.value)}
                                onFocus={() => setInputSensor(true)}
                                onBlur={() => setInputSensor(false)}
                                type="text" />
                                </div>

                                <div className="flex relative items-center w-full">
                                <label
                                className={`pointer-events-none absolute p-2 transition-[top, font-size] duration-200 ease-in-out h-5
                                ${inputCodigo || valueCodigo ? '-top-4 text-xs left-2 bg-white' : 'text-gray-400 left-2 top-0'}`}>
                                    Codigo</label>
                                <input className="p-2 border border-gray-200 rounded-md outline-none w-full"
                                value={valueCodigo}
                                onChange={e => setValueCodigo(e.target.value)}
                                onFocus={() => setInputCodigo(true)}
                                onBlur={() => setInputCodigo(false)}
                                type="text" />
                                </div>
                               </div>

                                 <div className="flex relative items-center w-full">
                                <label
                                className={`pointer-events-none absolute p-2 transition-[top, font-size] duration-200 ease-in-out h-5
                                ${inputNombre || valueNombre ? '-top-4 text-xs left-2 bg-white' : 'text-gray-400 left-2 top-0'}`}>
                                    Nombre del sensor</label>
                                <input className="p-2 border border-gray-200 rounded-md outline-none w-full"
                                value={valueNombre}
                                onChange={e => setValueNombre(e.target.value)}
                                onFocus={() => setInputNombre(true)}
                                onBlur={() => setInputNombre(false)}
                                type="text" />
                                </div>
                                
                                <div className="flex space-x-2">
                                    
                                <select 
                                    className="p-2 border w-full rounded cursor-pointer outline-none"
                                    value={selectedVariable}
                                    onChange={(e) => setSelectedVariable(e.target.value)}
                                >
                                    <option value="">Seleccionar variable</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>

                                <select 
                                    className="p-2 border w-full rounded cursor-pointer outline-none"
                                    value={selectedUnidad}
                                    onChange={(e) => setSelectedUnidad(e.target.value)}
                                >
                                    <option value="">Seleccionar unidad</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>

                                </div>
                            </div>

                                
                            </form>
                         
                           <div className={`absolute transition-all duration-500 ease-in-out w-full h-full p-5 ${addForm === 'form' ? 'pointer-events-none -left-[100%] opacity-0' : 'opacity-100 left-0 top-0'}`}>
                                <div className="flex flex-col space-y-4 w-full h-full">
                                    <h1 className="py-2 text-gray-500">datos que se enviaran Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                         Aspernatur aut, fuga tempore nisi deleniti </h1>
                                    <p className="text-gray-400">Serial : <span className="text-gray-900 ">123f </span></p>
                                    <p className="text-gray-400">Codigo : <span className="text-gray-900 ">asdasv</span></p>
                                    <p className="text-gray-400">Nombre del sensor : <span className="text-gray-900 ">242wer</span></p>
                                    <p className="text-gray-400">Variable : <span className="text-gray-900 ">qweqwe</span></p>
                                    <p className="text-gray-400">Unidad : <span className="text-gray-900 ">qweqwsxc</span></p>
                                </div>
                            </div>
                            </div>


                           <div className="w-full h-20 flex justify-center items-center mt-5 space-x-2">
                                <button onClick={()=>(removeStep(2),  setAddForm('form'))}  disabled={addForm === 'form'} className={`${addForm === 'form' ? 'cursor-not-allowed bg-gray-300' : 'cursor-pointer bg-gray-800 hover:bg-gray-700'} p-2 transition duration-300 ease-in-out w-56 text-white rounded-md`}>Volver</button>
                                {addForm === 'finish' ?
                                <button onClick={sendData} className="p-2 bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out w-56 text-white rounded-md">Registrar datos</button>
                                :
                                <button onClick={()=> (addStep(2), setAddForm('finish'))} disabled={!stepOne} className={`p-2 ${stepOne ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-300 cursor-not-allowed'} transition duration-300 ease-in-out w-56 text-white rounded-md`}>Siguiente</button>
                                }
                           </div>
                    </div>
                </div>
        </div>
    )
}