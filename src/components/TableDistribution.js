import React, { useState } from "react"; // 🔹 Ajout de useState
import { useDispatch } from "react-redux"; // 🔹 Ajout de useDispatch
import { deleteDistribution } from "../features/distributionSlice"; // 🔹 Ajout de l'action
import DistributionForm from "./DistributionForm"; // 🔹 Ajout du composant Form

export default function TableDistribution({ data, onDownloadPDF }) {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEdit = (dist) => {
    setEditData(dist);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  return (
    <>
      {/* Barre d'actions au-dessus du tableau */}
      <div className="d-flex gap-2 mb-3">
        <button className="btn btn-success d-flex align-items-center" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2"></i> Ajouter
        </button>
        
        <button className="btn btn-danger d-flex align-items-center" onClick={onDownloadPDF}>
          <i className="bi bi-file-earmark-pdf me-2"></i> Rapport PDF
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>Binôme</th>
              <th>Adresses distribuées</th>
              <th>Statut</th>
              <th>Non distribuée</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((d) => (
                <tr key={d._id}>
                  <td className="fw-bold">{d.binome}</td>
                  <td>{d.adresseDistribuees}</td>
                  <td className="text-center">
                    <span className={`badge ${d.statut === 'fait' ? 'bg-success' : 'bg-warning'}`}>
                      {d.statut}
                    </span>
                  </td>
                  <td>{d.adresseNonDistribuee}</td>
                  <td className="text-center">
                    {d.datePlanification ? new Date(d.datePlanification).toLocaleDateString() : "-"}
                  </td>
                  <td className="text-center">
                    <button 
                      className="btn btn-warning btn-sm me-2" 
                      onClick={() => handleEdit(d)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => {
                        if(window.confirm("Supprimer cette ligne ?")) {
                          dispatch(deleteDistribution(d._id));
                        }
                      }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Aucune donnée disponible pour ce secteur.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Formulaire Modal */}
      <DistributionForm 
        show={showForm} 
        onClose={() => setShowForm(false)} 
        editData={editData} 
      />
    </>
  );
}