import { useState } from "react";
import { api } from "@/shared/api/apiRoutes";

export const useGenerateDescription = () => {
  const [descriptionIA, setDescriptionIA] = useState("");
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
    showModal,
    loading,
    generateDescription,
    closeModal,
  };
};
