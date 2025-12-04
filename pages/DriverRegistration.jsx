import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { driverService } from "../services/api";

export default function DriverRegistration() {
  const navigate = useNavigate();

  // ===== ESTADOS DO FORMULÁRIO =====
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [addressProof, setAddressProof] = useState("");

  // ===== UPLOADS E PREVIEWS =====
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [rgFiles, setRgFiles] = useState([]);       
  const [rgPreviews, setRgPreviews] = useState([]);

  // ===== CONTROLE DE LOADING =====
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ===== HANDLERS =====
  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (profilePreview) URL.revokeObjectURL(profilePreview);

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleRgUpload = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 2);

    rgPreviews.forEach((p) => URL.revokeObjectURL(p));

    setRgFiles(files);
    setRgPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // ===== SALVAR FORMULÁRIO =====
  const handleSave = async () => {
    if (!name || !email || !phone || !cpf) {
      setError("Preencha pelo menos Nome, Email, Celular e CPF.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Obter ID do driver logado
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (!currentUser?.id) {
        setError("Usuário não autenticado. Faça login novamente.");
        navigate("/login");
        return;
      }

      // Atualizar dados do driver
      await driverService.updateDriver(currentUser.id, {
        name,
        email,
        phone,
        cpf,
      });

      // Upload de foto de perfil
      if (profileFile) {
        try {
          await driverService.uploadProfilePhoto(currentUser.id, profileFile);
        } catch (err) {
          console.warn("Erro ao fazer upload de foto:", err);
          // Não falha completamente se a foto não enviar
        }
      }

      // Upload de RG
      if (rgFiles.length > 0) {
        try {
          await driverService.uploadRG(currentUser.id, rgFiles);
        } catch (err) {
          console.warn("Erro ao fazer upload de RG:", err);
          // Não falha completamente se o RG não enviar
        }
      }

      setSuccess("Dados salvos com sucesso!");
      
      // Atualizar dados do usuário logado
      const updatedUser = { ...currentUser, name, email, phone, cpf };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      setTimeout(() => {
        navigate("/motorcycle-registration");
      }, 1500);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || "Erro ao salvar dados";
      setError(errorMsg);
      console.error("Erro ao salvar:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== CARREGAR DADOS DO USUÁRIO LOGADO =====
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) {
      setEmail(currentUser.email || "");
      setName(currentUser.name || "");
      setPhone(currentUser.phone || "");
      setCpf(currentUser.cpf || "");
    }
  }, []);

  const handleNextStep = () => {
    navigate("/motorcycle-registration");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link to="/" className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer">
          ← Voltar para home
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link to="/profile" className="text-2xl font-bold hover:underline cursor-pointer">
          Seu Perfil
        </Link>
      </nav>

      {/* MAIN */}
      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        <div className="flex flex-col items-start mr-10">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Cadastro do motorista</span>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Cadastro da moto</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Finalização</span>
          </div>
        </div>

        {/* FORM */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Cadastro do motorista</h1>

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

          {/* FOTO DE PERFIL */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer w-full hover:bg-gray-50 transition">
            {profilePreview ? (
              <img src={profilePreview} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
            ) : (
              <div className="text-center">
                <div className="text-4xl">📷</div>
                <div>Foto de perfil</div>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleProfileUpload}
              disabled={loading}
            />
          </label>

          {/* CAMPOS */}
          <input
            type="text"
            placeholder="Nome completo"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          <div className="flex w-full gap-3 mb-3">
            <input
              type="email"
              placeholder="Email"
              className="flex-1 p-2 rounded-lg border bg-gray-100 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex w-full gap-3 mb-3">
            <input
              type="text"
              placeholder="Celular"
              className="flex-1 p-2 rounded-lg border bg-gray-100 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
            />

            <input
              type="text"
              placeholder="CPF"
              className="flex-1 p-2 rounded-lg border bg-gray-100 focus:outline-none"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              disabled={loading}
            />
          </div>

          <input
            type="text"
            placeholder="Comprovante de residência"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100 focus:outline-none"
            value={addressProof}
            onChange={(e) => setAddressProof(e.target.value)}
            disabled={loading}
          />

          {/* RG UPLOAD */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-6 w-full flex flex-col items-center cursor-pointer hover:bg-gray-50 transition">
            <div className="w-full flex justify-center gap-2">
              {rgPreviews.length > 0 ? (
                rgPreviews.map((img, idx) => (
                  <img key={idx} src={img} className="w-20 h-20 object-cover" />
                ))
              ) : (
                <div className="text-4xl">📷</div>
              )}
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Frente e verso {rgPreviews.length}/2
            </div>

            <input 
              type="file" 
              accept="image/*" 
              multiple 
              className="hidden" 
              onChange={handleRgUpload}
              disabled={loading}
            />
          </label>

          {/* BOTÕES */}
          <div className="w-full flex gap-2 mb-3">
            <button 
              className="flex-1 bg-gray-200 text-black p-2 rounded-lg font-semibold hover:bg-gray-300 transition disabled:opacity-50"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar informações"}
            </button>
          </div>

          <button
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3 hover:bg-red-700 transition disabled:opacity-50"
            onClick={handleNextStep}
            disabled={loading}
          >
            Próxima etapa
          </button>

          <p className="text-xs text-center">
            Ao continuar você concorda com a{" "}
            <span className="text-red-600 underline">Política de Serviço</span> e{" "}
            <span className="text-red-600 underline">Termos de uso</span>.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            className="w-6 h-6"
          />
          <span className="text-gray-800 font-medium">Siga nosso Instagram</span>
        </div>

        <p className="text-sm text-gray-500">© Turma Senac Tec - 2025 Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
