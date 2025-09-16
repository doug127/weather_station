import { useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useUploadFile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const uploadFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("value/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(res.data.message || "Archivo subido correctamente.");
    } catch (err) {
      setError(err.response?.data?.message || "Error al subir el archivo.");
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, loading, error, success };
};
