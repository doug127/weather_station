import { useEffect, useState } from "react"
import { api } from "../../api/apiRoutes";
import Swal from "sweetalert2";

export const AddStatistics = () => {
    const [step, setStep] = useState([1]);
    const [stepOne, setStepOne] = useState(false);
    const [addForm, setAddForm] = useState('form');
    const [dataVriable, setDataVariable] = useState([]);
    const [showSensor, setShowSensor] = useState([]);

    const [valueSensor, setValueSensor] = useState("");
    const [inputSensor, setInputSensor] = useState(false);

    const [valueCodigo, setValueCodigo] = useState("");
    const [inputCodigo, setInputCodigo] = useState(false);

    const [valueNombre, setValueNombre] = useState("");
    const [inputNombre, setInputNombre] = useState(false);
    
    const [selectedVariable, setSelectedVariable] = useState("");
    const [selectedUnidad, setSelectedUnidad] = useState("");

       useEffect(() => {
        const variableData = async () => {
            try {
            const response = await api.get('/variable/all')
            setDataVariable(response.data.variables);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
        }
        variableData();
       })
   
const sendData = async (e) => {
    e.preventDefault();

    const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres continuar con esta acción? Una vez que se envíen los datos, no podrás deshacerla.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true,
    });

    if (!confirm.isConfirmed) {
        await Swal.fire('Cancelado', 'Has cancelado la acción.', 'error');
        return;
    }

    try {
        await api.post('/sensor/create', {
            name: valueNombre,
            code: valueCodigo,
            serial: valueSensor,
            variableId: selectedVariable,
        });

        setValueSensor("");
        setValueCodigo("");
        setValueNombre("");
        setSelectedVariable("");
        setSelectedUnidad("");
        setAddForm('form');
        setStep([1]);
        setStepOne(false);

        await Swal.fire('¡Hecho!', 'El sensor ha sido creado correctamente.', 'success');

    }  catch (error) {
    console.error("Error al enviar los datos:", error);

    const data = error.response?.data || {};
    const errorMessage = data.error || "Ocurrió un error al enviar los datos.";
    const conflict = data.conflict;

    const detailedMessage = conflict 
        ? `${errorMessage}. Campo: ${conflict.field}, Valor: "${conflict.value}".`
        : errorMessage;

    await Swal.fire({
        title: 'Error',
        text: detailedMessage,
        icon: 'error',
        confirmButtonText: 'Aceptar'
    });
}
};



    useEffect(() => {
         if (
        valueSensor.trim() !== "" &&
        valueCodigo.trim() !== "" &&
        valueNombre.trim() !== "" &&
        selectedVariable.trim() !== ""
        ) {
            setStepOne(true);
        } else {
            setStepOne(false);
        }
    },[valueSensor, valueCodigo, valueNombre, selectedVariable])



    const addStep = (num) => {
        setStep(prev => prev.includes(num) ? prev : [...prev, num]);
    };

    const removeStep = (num) => {
        setStep(prev => prev.filter(n => n !== num));
    }

    return (
        <div className="w-full">
                <div className="w-full h-full flex flex-col justify-center items-center p-5">
                    <div className="w-full p-5">
                        <h1 className="text-xl">Pasos para registrar el sensor</h1>
                        <div className="w-full py-3 text-gray-400 space-y-1">
                        <p>- El codigo debe ser como minimo de 4 caracteres</p>
                        <p>- El nombre del sensor debe ser unico</p>
                        <p>- El codigo debe ser unico</p>
                        <p>- Ninguno de los campos pueden estar vacios o tener caracteres especiales</p>
                        </div>
                    </div>
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
                                <input className={`p-2 border  rounded-md outline-none w-full ${valueSensor || inputSensor ? 'border-1 border-gray-900' : 'border-gray-200'}`}
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
                                <input className={`p-2 border  rounded-md outline-none w-full ${valueCodigo || inputCodigo ? 'border-1 border-gray-900' : 'border-gray-200'}`}
                                value={valueCodigo}
                                onChange={e => setValueCodigo(e.target.value)}
                                onFocus={() => setInputCodigo(true)}
                                onBlur={() => setInputCodigo(false)}
                                type="text" />
                                </div>
                               </div>

                                
                                <div className="flex space-x-2">
                                
                                 <div className="flex relative items-center w-full">
                                <label
                                className={`pointer-events-none absolute p-2 transition-[top, font-size] duration-200 ease-in-out h-5
                                ${inputNombre || valueNombre ? '-top-4 text-xs left-2 bg-white' : 'text-gray-400 left-2 top-0'}`}>
                                    Nombre del sensor</label>
                                <input className={`p-2 border  rounded-md outline-none w-full ${valueNombre || inputNombre ? 'border-1 border-gray-900' : 'border-gray-200'}`}
                                value={valueNombre}
                                onChange={e => setValueNombre(e.target.value)}
                                onFocus={() => setInputNombre(true)}
                                onBlur={() => setInputNombre(false)}
                                type="text" />
                                </div>

                                <div className="w-full">
                                    
                                <select 
                                    className="p-2 border w-full rounded cursor-pointer outline-none"
                                    value={selectedVariable}
                                    onChange={(e) => setSelectedVariable(e.target.value)}
                                >
                                     <option value="" disabled hidden>Seleccionar variable</option>
                                    {dataVriable.map(variable => (
                                    <option key={variable.id} value={variable.id}>{variable.name}</option>
                                    ))}
                                </select>
                                </div>
                                </div>
                            </div>

                                
                            </form>
                         
                           <div className={`absolute transition-all duration-500 ease-in-out w-full h-full p-5 ${addForm === 'form' ? 'pointer-events-none -left-[100%] opacity-0' : 'opacity-100 left-0 top-0'}`}>
                                <div className="flex flex-col space-y-4 w-full h-full">
                                    <h1 className="py-2 text-gray-500"><i class="fa-solid fa-circle-exclamation text-yellow-500"></i> Verifique que todos los datos sean los correctos, se registrar con la fecha actual del equipo (verifique que la fecha de su equipo sea la correcta), una vez registre los datos no podra cambiar los datos.</h1>
                                    <p className="text-gray-400">Serial : <span className="text-gray-900 ">{valueSensor} </span></p>
                                    <p className="text-gray-400">Codigo : <span className="text-gray-900 ">{valueCodigo}</span></p>
                                    <p className="text-gray-400">Nombre del sensor : <span className="text-gray-900 ">{valueNombre}</span></p>
                                    <p className="text-gray-400">Variable : <span className="text-gray-900 ">{selectedVariable}</span></p>
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