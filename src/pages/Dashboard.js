import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchDistributions } from "../features/distributionSlice";
import TableDistribution from "../components/TableDistribution";

export default function Dashboard() {
  const dispatch = useDispatch();
  const sector = useSelector(state => state.auth.sector);
  const distributions = useSelector(state => state.distribution.list);

  useEffect(() => {
    dispatch(fetchDistributions());
  }, [dispatch]);

  if (!sector) return null;

  return (
    <div className="container">
      <h2>Secteur : {sector.name}</h2>
      <img src={`/images/${sector.image}`} alt={sector.name} className="img-fluid mb-3" style={{ maxHeight: "200px" }} />
      <TableDistribution data={distributions} />
    </div>
  );
}
