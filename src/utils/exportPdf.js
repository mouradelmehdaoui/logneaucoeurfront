import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportPDF = (data) => {
  const doc = new jsPDF();
  doc.text("Distributions", 14, 10);

  doc.autoTable({
    startY: 20,
    head: [["Binôme", "Statut", "Adresses"]],
    body: data.map(d => [
      d.binome,
      d.statut,
      d.adresseDistribuees
    ])
  });

  doc.save("distributions.pdf");
};
