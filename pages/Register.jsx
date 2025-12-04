import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/api";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [vehicle] = useState("moto");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validações
    if (!name || !cpf || !email || !phone || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos!");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem!");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Registrar no backend
      const response = await authService.register({
        name,
        cpf,
        email,
        phone,
        password,
        confirmPassword,
      });

      // Salvar token
      const token = response.data.access_token || response.data.token;
      if (token) {
        localStorage.setItem("access_token", token);
      }

      // Salvar dados do usuário
      const userData = {
        id: response.data.id,
        name: response.data.nome || name,
        email: response.data.email,
        cpf: response.data.cpf,
        phone: response.data.phone,
        loggedIn: true,
        registrationTime: new Date().toISOString(),
      };

      localStorage.setItem("currentUser", JSON.stringify(userData));

      alert("Conta criada com sucesso!");
      navigate("/driver-registration");
    } catch (err) {
      const errorMsg =
        err.response?.data?.detail || err.message || "Erro ao registrar";
      setError(errorMsg);
      console.error("Erro no registro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">

      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar para home
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />
      </nav>

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-black text-white p-10 rounded-3xl w-96 text-center">
          <h2 className="text-xl font-bold mb-6">Crie sua conta</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-sm">
              {error}
            </div>
          )}

          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            disabled={loading}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />

          <input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
          />

          {/* SENHA */}
          <div className="relative w-full mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 cursor-pointer text-gray-700 text-xl select-none"
            >
              {showPassword ? "⟡" : "⟐"}
            </span>
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="relative w-full mb-6">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirme Sua Senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none disabled:opacity-50"
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3 cursor-pointer text-gray-700 text-xl select-none"
            >
              {showConfirmPassword ? "⟡" : "⟐"}
            </span>
          </div>

          <div className="flex justify-center mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="vehicle"
                value="moto"
                checked={true}
                readOnly
                className="accent-white"
              />
              Moto
            </label>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>

          <div className="flex items-start text-xs text-left mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              disabled={loading}
              className="mr-2 mt-0.5 accent-white disabled:opacity-50"
            />
            <p>
              Concordo em receber ofertas e novidades por{" "}
              <span className="font-bold underline">e-mail</span>.
            </p>
          </div>

          <p className="mt-6 text-sm text-gray-300">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-white font-semibold underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <p className="text-sm text-gray-500">
          © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
