import { useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useGenerateDescription = () => {
  const [descriptionIA, setDescriptionIA] = useState("");
  const [suggestion, setSuggestion] = useState(""); 
  const [success, setSuccess] = useState(false);    
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [manualFallback, setManualFallback] = useState(false);

  const generateDescription = async (name, variable) => {
    if (!name || !variable) return;

    setLoading(true);
    setManualFallback(false);

    const timeout = setTimeout(() => {
      setManualFallback(true);
      setLoading(false); 
    }, 20000);

    try {
      const res = await api.post("/sensor/generate-description", {
        name,
        variable,
      });

      clearTimeout(timeout);

      setDescriptionIA(res.data.description);
      setSuggestion(res.data.suggestion || "");
      setSuccess(res.data.success);
      setShowModal(true);
    } catch (error) {
      console.error("Error al generar descripción:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setShowModal(false);

  return {
    descriptionIA,
    suggestion,
    success,
    showModal,
    loading,
    manualFallback,
    generateDescription,
    closeModal,
  };
};
