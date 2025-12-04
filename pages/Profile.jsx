import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { driverService, authService } from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (!storedUser) {
          setLoading(false);
          return;
        }

        // Tentar buscar dados atualizados do backend
        try {
          const response = await driverService.getMe();
          const userData = {
            ...storedUser,
            ...response.data,
            loggedIn: true,
          };
          setUser(userData);
          localStorage.setItem("currentUser", JSON.stringify(userData));
        } catch (err) {
          // Se houver erro ao buscar, usar dados locais
          setUser(storedUser);
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const goHome = () => {
    navigate("/routestodo");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    try {
      if (!user?.id) {
        setError("ID do usuário não encontrado");
        return;
      }

      // Fazer upload no backend
      await driverService.uploadProfilePhoto(user.id, file);

      // Atualizar preview localmente
      const reader = new FileReader();
      reader.onload = () => {
        const updatedUser = { ...user, profileDataUrl: reader.result };
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || "Erro ao fazer upload de foto";
      setError(errorMsg);
      console.error("Erro no upload:", err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p className="mt-4 text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Você não está logado
        </h2>
        <Link
          to="/login"
          className="bg-black text-white px-6 py-3 rounded-full mt-4 hover:bg-gray-900 transition"
        >
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* NAV BAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar
        </Link>

        <button
          onClick={goHome}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition duration-200"
        >
          Home
        </button>

        <img src="/logo.png" alt="Logo" className="h-20" />

      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-col items-center mt-10 px-6 w-full">

        {error && (
          <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm w-full max-w-md">
            {error}
          </div>
        )}

        {/* FOTO */}
        <div className="flex flex-col items-center">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-600 shadow-xl">
            {user.profileDataUrl ? (
              <img
                src={user.profileDataUrl}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
                Sem Foto
              </div>
            )}
          </div>

          <label className="mt-4 bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-900 transition text-sm disabled:opacity-50">
            {uploading ? "Enviando..." : user.profileDataUrl ? "Editar Foto" : "Adicionar Foto"}
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* INFORMAÇÕES */}
        <div className="bg-white shadow-lg rounded-3xl p-8 mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Meu Perfil
          </h2>

          <div className="space-y-4">
            <p>
              <span className="font-semibold text-gray-700">Nome:</span>{" "}
              {user.nome || user.name || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">E-mail:</span>{" "}
              {user.email || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Telefone:</span>{" "}
              {user.phone || user.celular || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">CPF:</span>{" "}
              {user.cpf || "—"}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Veículo:</span> Moto
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full bg-red-600 text-white font-semibold py-3 rounded-full hover:bg-red-700 transition"
          >
            Sair da Conta
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 mt-auto border-t w-full">
        <p className="text-sm text-gray-500">
          © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
