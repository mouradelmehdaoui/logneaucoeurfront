// login.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../features/authSlice";
import axios from "axios";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🔹 Appel au backend pour récupérer le VRAI token JWT
      const res = await axios.post("https://logneaucoeur.vercel.app/api/auth/login", { login, password });
      
      // On dispatch le token et les infos secteurs renvoyés par le back
      dispatch(loginSuccess({ 
        token: res.data.token, 
        sector: res.data.secteur 
      }));
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-4">Connexion</h3>
        {error && <div className="alert alert-danger text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Login</label>
            <input type="text" className="form-control" value={login} onChange={e => setLogin(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label>Mot de passe</label>
            <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Se connecter</button>
        </form>
      </div>
    </div>
  );
}