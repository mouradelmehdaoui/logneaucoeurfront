import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createDistribution, updateDistribution } from "../features/distributionSlice";

export default function DistributionForm({ show, onClose, editData }) {
  const dispatch = useDispatch();
  const secteurConnecte = useSelector(state => state.auth.sector);

  const initialForm = {
    binome: "",
    adresseDistribuees: "",
    statut: "en cours",
    adresseNonDistribuee: "",
    datePlanification: "",
    etatAvance: "",
    secteur: secteurConnecte ? secteurConnecte.name : ""
  };

  const [form, setForm] = useState(initialForm);

  // Synchronise le formulaire quand on ouvre la modale ou qu'on édite
  useEffect(() => {
    if (editData) {
      setForm({ ...editData, datePlanification: editData.datePlanification?.split("T")[0] });
    } else {
      setForm(initialForm);
    }
  }, [editData, show, secteurConnecte]);

  // 🔹 LA FONCTION QUI MANQUAIT :
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editData) {
      dispatch(updateDistribution({ id: editData._id, data: form }));
    } else {
      dispatch(createDistribution(form));
    }
    
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editData ? "Modifier" : "Ajouter"} Distribution</h5>
            <button className="btn-close" type="button" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-2">
                <label>Binôme</label>
                <input type="text" name="binome" className="form-control" value={form.binome} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label>Adresses distribuées</label>
                <input type="text" name="adresseDistribuees" className="form-control" value={form.adresseDistribuees} onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label>Statut</label>
                <select name="statut" className="form-control" value={form.statut} onChange={handleChange}>
                  <option value="en cours">En cours</option>
                  <option value="fait">Fait</option>
                  <option value="terminé">Terminé</option>
                </select>
              </div>
              <div className="mb-2">
                <label>Adresse non distribuée</label>
                <input type="text" name="adresseNonDistribuee" className="form-control" value={form.adresseNonDistribuee} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label>Date planification</label>
                <input type="date" name="datePlanification" className="form-control" value={form.datePlanification} onChange={handleChange} />
              </div>
              <div className="mb-2">
                <label>État de l'avance</label>
                <input type="text" name="etatAvance" className="form-control" value={form.etatAvance} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" type="button" onClick={onClose}>Annuler</button>
              <button className="btn btn-primary" type="submit">Valider</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}