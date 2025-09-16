import { useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useGenerateDescription = () => {
  const [descriptionIA, setDescriptionIA] = useState("");
<<<<<<< HEAD
=======
  const [suggestion, setSuggestion] = useState(""); // nueva
  const [success, setSuccess] = useState(false);    // nueva
>>>>>>> ms
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateDescription = async (name, variable) => {
    if (!name || !variable) return;

    try {
      setLoading(true);
      const res = await api.post("/sensor/generate-description", {
        name,
        variable,
      });

      setDescriptionIA(res.data.description);
<<<<<<< HEAD
=======
      setSuggestion(res.data.suggestion || "");
      setSuccess(res.data.success);
>>>>>>> ms
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
<<<<<<< HEAD
=======
    suggestion,
    success,
>>>>>>> ms
    showModal,
    loading,
    generateDescription,
    closeModal,
  };
};
