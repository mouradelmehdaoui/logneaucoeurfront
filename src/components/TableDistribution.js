import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteDistribution } from "../features/distributionSlice";
import DistributionForm from "./DistributionForm";

export default function TableDistribution({ data }) {
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
      <button className="btn btn-success mb-3" onClick={handleAdd}>
        Ajouter
      </button>

      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr className="text-center">
            <th>Binôme</th>
            <th>Adresses distribuées</th>
            <th>Statut</th>
            <th>Non distribuée</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d._id}>
              <td className="fw-bold">{d.binome}</td>
              <td>{d.adresseDistribuees}</td>
              <td>{d.statut}</td>
              <td>{d.adresseNonDistribuee}</td>
              <td>{d.datePlanification ? new Date(d.datePlanification).toLocaleDateString() : ""}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEdit(d)}
                >
                  Modifier
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => dispatch(deleteDistribution(d._id))}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DistributionForm
        show={showForm}
        onClose={() => setShowForm(false)}
        editData={editData}
      />
    </>
  );
}
