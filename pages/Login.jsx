import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");   
  const [password, setPassword] = useState(""); 
  const [checked, setChecked] = useState(false);
  const [vehicle, setVehicle] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, preencha e-mail e senha!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Fazer login no backend
      const response = await authService.login(email, password);
      const { access_token } = response.data;

      // Salvar token
      localStorage.setItem("access_token", access_token);

      // Salvar dados do usuário
      const userData = {
        email,
        loggedIn: true,
        loginTime: new Date().toISOString(),
        marketing: checked,
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));

      alert("Login realizado com sucesso!");
      navigate("/routestodo");
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 
                       "Erro ao fazer login. Verifique suas credenciais.";
      setError(errorMsg);
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar para home
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />
      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-black text-white p-10 rounded-3xl w-96 text-center">
          <h2 className="text-xl font-bold mb-6">Entre na sua conta</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />

          {/* SENHA */}
          <div className="relative w-full mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
              className="w-full px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer select-none text-black text-xl"
            >
              ⦿
            </span>
          </div>

          <button
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Entrando..." : "Continuar"}
          </button>

          <p className="mt-4 text-sm">
            Ainda não tem conta?{" "}
            <Link
              to="/register"
              className="underline text-red-400 hover:text-red-300"
            >
              Criar conta
            </Link>
          </p>

          <div className="flex items-start text-xs text-left mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              disabled={loading}
              className="mr-2 mt-0.5 accent-white disabled:opacity-50"
            />
            <p>
              Concordo em fornecer meus dados para receber conteúdos e ofertas
              por <span className="font-bold underline">e-mail</span>.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            alt="Instagram"
            className="w-6 h-6"
          />
          <a
            href="https://www.instagram.com/tmaxrestaurante?igsh=MWk2NWpqbmNlazFjNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 font-medium hover:underline"
          >
            Siga nosso Instagram
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
