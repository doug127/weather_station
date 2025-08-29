import {api} from "@/shared/api/apiRoutes";

export const useExportExcel = (queryParams) => {
  const handleExport = async () => {
    try {
      if (!queryParams) return;

      const response = await api.get("/report/excel", {
        params: queryParams,
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "reporte.xlsx");
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };

  return { handleExport };
};
