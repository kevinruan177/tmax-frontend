// src/pages/MotorcycleRegistration.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motorcycleService } from "../services/api";

export default function MotorcycleRegistration() {
  const [motorcycle, setMotorcycle] = useState({
    model: "",
    year: "",
    plate: "",
    color: "",
    file: null,
  });

  const [motorcyclePreview, setMotorcyclePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Carregar dados da moto se existirem
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const handleMotorcycleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMotorcycle((prev) => ({ ...prev, file }));
    
    // Preview
    const reader = new FileReader();
    reader.onload = () => {
      setMotorcyclePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field) => (e) => {
    setMotorcycle((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSaveMoto = async () => {
    if (!motorcycle.model || !motorcycle.year || !motorcycle.plate || !motorcycle.color) {
      setError("Preencha todos os campos da moto!");
      return;
    }

    if (!motorcycle.file) {
      setError("Selecione uma foto da moto!");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser?.id) {
        setError("Usuário não autenticado.");
        navigate("/login");
        return;
      }

      // Fazer upload da moto
      const response = await motorcycleService.createMotorcycle(motorcycle.file, {
        driver_id: currentUser.id,
      });

      // Se houver dados adicionais, atualizar
      if (response.data.id) {
        await motorcycleService.updateMoto(response.data.id, {
          model: motorcycle.model,
          year: parseInt(motorcycle.year),
          color: motorcycle.color,
          plate: motorcycle.plate,
        });
      }

      setSuccess("Moto cadastrada com sucesso!");
      
      setTimeout(() => {
        navigate("/routestodo");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Erro ao cadastrar moto";
      setError(errorMsg);
      console.error("Erro ao cadastrar moto:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    handleSaveMoto();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link to="/" className="absolute left-6 text-lg font-semibold hover:underline">
          ← Voltar para home
        </Link>
        <img src="/logo.png" alt="Logo" className="h-20" />
        <Link to="/profile" className="text-2xl font-bold hover:underline">Seu Perfil</Link>
      </nav>

      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Cadastro da Moto</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm w-full">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-600 text-white rounded-lg text-sm w-full">
              {success}
            </div>
          )}

          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer w-full hover:bg-gray-50 transition">
            {motorcyclePreview ? (
              <img src={motorcyclePreview} alt="Moto" className="w-48 h-32 object-cover rounded-lg" />
            ) : (
              <div className="text-center">
                <div className="text-4xl">🏍️</div>
                <div>Foto da moto</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMotorcycleUpload}
              disabled={loading}
            />
          </label>

          <input
            type="text"
            placeholder="Marca"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100 focus:outline-none disabled:opacity-50"
            value={motorcycle.model.split(" ")[0] || ""}
            onChange={(e) => {
              const marca = e.target.value;
              setMotorcycle((prev) => ({
                ...prev,
                model: prev.model.includes(" ") 
                  ? marca + " " + prev.model.split(" ").slice(1).join(" ")
                  : marca,
              }));
            }}
            disabled={loading}
          />

          <input
            type="text"
            placeholder="Modelo"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100 focus:outline-none disabled:opacity-50"
            value={motorcycle.model}
            onChange={handleChange("model")}
            disabled={loading}
          />

          <div className="flex w-full gap-3 mb-3">
            <input
              type="number"
              placeholder="Ano"
              className="flex-1 p-2 rounded-lg border bg-gray-100 focus:outline-none disabled:opacity-50"
              value={motorcycle.year}
              onChange={handleChange("year")}
              min="1900"
              max={new Date().getFullYear()}
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Placa"
              className="flex-1 p-2 rounded-lg border bg-gray-100 focus:outline-none disabled:opacity-50"
              value={motorcycle.plate}
              onChange={handleChange("plate")}
              disabled={loading}
            />
          </div>

          <input
            type="text"
            placeholder="Cor"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100 focus:outline-none disabled:opacity-50"
            value={motorcycle.color}
            onChange={handleChange("color")}
            disabled={loading}
          />

          <button
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3 hover:bg-red-700 transition disabled:opacity-50"
            onClick={handleNextStep}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Concluir esta etapa"}
          </button>

          <p className="text-xs text-center">
            Ao continuar você concorda com essa <span className="text-red-600 underline">Política de Serviço</span> e <span className="text-red-600 underline">termos de uso</span>
          </p>
        </div>
      </main>
    </div>
  );
}
