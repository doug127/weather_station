<<<<<<< HEAD
import { useState } from 'react'
import { Button } from '@/shared/components/buttons/Button'

export const Modal = ({ descriptionIA, onClose, onApprove, onManual }) => {
  const [tempDescription, setTempDescription] = useState(descriptionIA);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-semibold mb-4">Descripción sugerida</h2>
        <textarea
          value={tempDescription}
          onChange={(e) => setTempDescription(e.target.value)}
          className="w-full h-32 p-2 border rounded-md mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => onApprove(tempDescription)}
            variant = "primary"
          >
            Aceptar
          </Button>
          <Button
            onClick={onClose}
            variant = "secondary"
          >
            Cancelar
          </Button>
=======
import { useState, useEffect } from "react";
import { Button } from "@/shared/components/buttons/Button";

export const Modal = ({ descriptionIA, success, suggestion, onClose, onApprove }) => {
  const [tempDescription, setTempDescription] = useState(descriptionIA);

  // si cambia la descripción desde backend, actualizamos el textarea
  useEffect(() => {
    setTempDescription(descriptionIA);
  }, [descriptionIA]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[1000]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
        <h2 className="text-xl font-semibold mb-4">
          {success ? "Descripción sugerida" : "Error en la descripción"}
        </h2>

        {success ? (
          // caso válido: se puede editar y aprobar
          <textarea
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            className="w-full h-32 p-2 border rounded-md mb-4"
          />
        ) : (
          // caso inválido: solo mostramos el mensaje
          <div className="p-3 border rounded-md bg-red-50 text-red-600 mb-4">
            <p>{descriptionIA}</p>
            {suggestion && <p className="mt-2 italic">{suggestion}</p>}
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            {success ? "Cancelar" : "Cerrar"}
          </Button>

          {success && (
            <Button onClick={() => onApprove(tempDescription)} variant="primary">
              Aceptar
            </Button>
          )}
>>>>>>> ms
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
};
=======
};
>>>>>>> ms
