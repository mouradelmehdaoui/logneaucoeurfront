import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { fetchDistributions } from "../features/distributionSlice";
import TableDistribution from "../components/TableDistribution";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Dashboard() {
  const dispatch = useDispatch();
  
  // État local pour gérer la page actuelle de la pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Récupération des données depuis le store Redux
  const sector = useSelector((state) => state.auth.sector);
  const { list, totalPages, loading } = useSelector((state) => state.distribution);
  
  // Référence pour capturer la zone du rapport pour le PDF
  const dashboardRef = useRef();

  // Déclenche le chargement des données quand la page ou le composant change
  useEffect(() => {
    dispatch(fetchDistributions(currentPage));
  }, [dispatch, currentPage]);

  // Fonction pour générer le rapport PDF de la vue actuelle
  const downloadPDF = () => {
    const input = dashboardRef.current;
    
    html2canvas(input, { 
      scale: 2, 
      useCORS: true, 
      backgroundColor: "#ffffff" 
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Rapport-${sector.name}-Page${currentPage}.pdf`);
    });
  };

  if (!sector) return null;

  return (
    <div className="container mt-4 mb-5">
      {/* Zone capturée par html2canvas */}
      <div ref={dashboardRef} className="p-3 bg-white">
        
        {/* En-tête du Rapport */}
        <div className="text-center mb-4">
          <h1 className="fw-bold">Rapport de Distribution</h1>
          <h5 className="text-muted">Secteur : {sector.name} – 77185 LOGNES</h5>
          <hr />
        </div>

        {/* --- Section Carte --- */}
        <div className="card shadow-sm mb-5 border-0">
          <div className="card-header bg-dark text-white text-center fw-bold py-3">
            Plan de secteur : {sector.name}
          </div>
          <div className="card-body text-center p-0 bg-light border">
            <img
              src={`/images/${sector.image}`}
              alt={`Plan ${sector.name}`}
              className="img-fluid"
              style={{ 
                maxHeight: "550px", 
                width: "100%", 
                objectFit: "contain",
                display: "block" 
              }}
            />
          </div>
        </div>

        {/* --- Section Tableau --- */}
        <div className="mt-4">
          <div className="d-flex align-items-center mb-3">
            <h4 className="mb-0">Suivi des passages</h4>
            {loading && <span className="ms-3 spinner-border spinner-border-sm text-primary"></span>}
          </div>
          
          {/* On passe les données et la fonction PDF au tableau */}
          <TableDistribution 
            data={list} 
            onDownloadPDF={downloadPDF} 
          />

          {/* --- Système de Pagination --- */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center shadow-sm">
                {/* Bouton Précédent */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  >
                    Précédent
                  </button>
                </li>

                {/* Chiffres des pages */}
                {[...Array(totalPages)].map((_, i) => (
                  <li 
                    key={i} 
                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                  >
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}

                {/* Bouton Suivant */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  >
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      <footer className="text-center mt-4 text-muted small">
        Document généré le {new Date().toLocaleDateString()} - Logneaucoeur
      </footer>
    </div>
  );
}