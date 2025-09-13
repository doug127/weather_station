export const Landing = () => {
    return (
        <div className="landing flex flex-col items-center min-h-screen p-4">
            <h1 className="text-2xl font-bold text-center">
                Reseña Histórica del Cuerpo de Bomberos Universitarios Guanare <br />
                (Fundado en 1987)
            </h1>
            <h3 className="mt-2 text-center">
                Cuerpo de Bomberos Universitarios UNELLEZ- Guanare
                <br /> Reseña histórica
            </h3>

            <div className="w-full max-w-4xl mt-6">
                <img
                src="imgs/bomberos_1.jpg"
                className="w-[300px] float-left mr-6 mb-4 object-cover mt-4"
                alt="Cuerpo de Bomberos Universitarios"
                />
                <p className="text-justify">
                En octubre de 1975 mediante el decreto N° 1178, 
                el presidente de la República de Venezuela Carlos Andrés Pérez, crea la 
                Universidad Experimental de los Llanos Occidentales “Ezequiel Zamora” (UNELLEZ). 
                <br />
                En diciembre del mismo año, por resolución N°414 del 
                Ministerio de Educación se designan las primeras autoridades de la institución. 
                <br />
                El 16 de mayo de 1979, por iniciativa del Dr. Felipe 
                Gómez Álvarez, rector fundador de la UNELLEZ, y hombre comprometido con la 
                conservación y protección del ambiente, se crea el Cuerpo de Bomberos Universitarios 
                de la UNELLEZ. 
                <br />
                En el año 1983, el Consejo Directivo Universitario 
                presidido por el Dr. Rafael Isidro Quevedo, aprueba el reglamento general 
                del Cuerpo de Bomberos Universitarios de  la Universidad Nacional Experimental 
                de los Llanos Occidentales “Ezequiel Zamora” (UNELLEZ).
                </p>
                <h3 className="mt-10 text-center text-xl">
                    Fundación de la sub-estación de Bomberos Universitarios del vice-rectorado 
                    de Producción Agrícola, Guanare- Portuguesa.
                </h3>
                <img src="imgs/bomberos_2.jpg" className="w-[300px] float-right ml-6 mb-4 object-cover mt-10" alt="Cuerpo de Bomberos Universitarios" />
                <p className="text-justify mt-10">
                El 19 de febrero de 1987, se funda la sub-estación de Bomberos Universitarios 
                del Vice-rectorado de Producción Agrícola, Guanare- Portuguesa.  
                Ubicado en la UNELLEZ de Mesa de Cavacas, estando presentes las siguientes  personas: 
                Prof. Luis Barreto, Prof. Mari Vargas de Rodríguez, 
                el T.S.U (RNR) Héctor  Calles, Sgto./I Esteban Marquina, el Dtgdo.  
                Antonio Toro y el Bbro. José Vicente Rodríguez, 
                para dejar constituida la primera Brigada de Bomberos Voluntarios. 

                Este primer equipo se encargó de aumentar el número de integrantes mediante 
                el ingreso de estudiantes, profesores, empleados obreros, miembros  
                seleccionados dentro de la comunidad  universitaria de la UNELLEZ.
                </p>
                <div className="clear-both"></div>
            </div>
        </div>
    );
};