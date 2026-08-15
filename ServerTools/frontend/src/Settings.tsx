import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";

const API = "http://localhost:3002/api";

const DIFFICULTY_OPTIONS = ["peaceful", "easy", "normal", "hard"];
const GAMEMODE_OPTIONS = ["survival", "creative", "adventure", "spectator"];

interface Toast {
  type: "success" | "error";
  msg: string;
}

/**
 * Componente dinamico para parser interativo do arquivo \`server.properties\`.
 * Realiza modificacoes sincromas salvando diretamente no disco do Backend.
 */
export default function Settings() {
  /** Objeto de estado retendo os pares K:V do backend */
  const [config, setConfig] = useState<Record<string, string>>({});
  
  /** Trava contra salvamentos simultaneos */
  const [saving, setSaving] = useState<boolean>(false);
  
  /** Feedback de UI pos-submissao */
  const [toast, setToast] = useState<Toast | null>(null);

  useEffect(() => {
    fetch(`${API}/config`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.config) {
          setConfig(data.config);
        } else {
          setConfig(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  /**
   * Altera uma unica linha no state local (ainda nao submetida).
   * @param key A chave nativa no server.properties
   * @param value O novo valor (stringficado)
   */
  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  /**
   * Descarrega o dicionario inteiro via POST contra a API de validacao nativa (ConfigService).
   */
  const handleSave = async () => {
    setSaving(true);
    setToast(null);
    try {
      const res = await fetch(`${API}/config`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.error) {
        setToast({ type: "error", msg: data.error });
      } else {
        setToast({ type: "success", msg: "Configuracoes salvas com sucesso!" });
      }
      setTimeout(() => setToast(null), 3500);
    } catch (err) {
      setToast({ type: "error", msg: "Erro ao salvar configuracoes." });
      console.error(err);
    }
    setSaving(false);
  };

  /**
   * Injeta um elemento <select> ja formatado com as opcoes do Enum do jogo.
   * Ex: "Gamemode" restrito a ["survival", "creative", etc.]
   */
  const renderSelect = (key: string, label: string, options: string[]) => (
    <div className="form-group" key={key}>
      <label>{label}</label>
      <select
        className="form-control"
        value={config[key] || options[0]}
        onChange={(e) => handleChange(key, e.target.value)}
        style={{ background: "var(--surface)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "0.5rem 0.75rem" }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
        ))}
      </select>
    </div>
  );

  /**
   * Injeta um campo simples de texto cru ou numerico (Ex: MOTD, Simulacao Chunks).
   */
  const renderText = (key: string, label: string, type = "text") => (
    <div className="form-group" key={key}>
      <label>{label}</label>
      <input
        type={type}
        className="form-control"
        value={config[key] || ""}
        onChange={(e) => handleChange(key, e.target.value)}
      />
    </div>
  );

  /**
   * Injeta um Apple-style Toggle Switch limitando falsos-positivos a booleans pre-parseados.
   */
  const renderBoolean = (key: string, label: string) => (
    <div className="config-item" key={key}>
      <label>{label || key}</label>
      <label className="switch">
        <input
          type="checkbox"
          checked={config[key] === "true"}
          onChange={(e) => handleChange(key, e.target.checked ? "true" : "false")}
        />
        <span className="slider"></span>
      </label>
    </div>
  );

  return (
    <div>
      <div className="header">
        <h1>Configuracoes</h1>
        <p>Ajuste as propriedades do servidor ATM Lite (server.properties)</p>
      </div>

      <div className="card glass">
        <div className="card-header">
          <div className="card-title">Propriedades Basicas</div>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={18} /> {saving ? "Salvando..." : "Salvar Alteracoes"}
          </button>
        </div>

        <div style={{ marginTop: "1.5rem" }}>
          {renderText("motd", "Mensagem do Dia (MOTD)")}
          {renderText("max-players", "Maximo de Jogadores", "number")}
          {renderSelect("difficulty", "Dificuldade", DIFFICULTY_OPTIONS)}
          {renderSelect("gamemode", "Modo de Jogo Padrao", GAMEMODE_OPTIONS)}
          {renderText("view-distance", "Distancia de Renderizacao (chunks)", "number")}
          {renderText("simulation-distance", "Distancia de Simulacao (chunks)", "number")}

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem", color: "var(--text-muted)" }}>Opcoes Avancadas</h3>
            {renderBoolean("pvp", "Ativar PvP")}
            {renderBoolean("allow-flight", "Permitir Voo")}
            {renderBoolean("allow-nether", "Permitir Nether")}
            {renderBoolean("enable-command-block", "Habilitar Blocos de Comando")}
            {renderBoolean("hardcore", "Modo Hardcore")}
            {renderBoolean("white-list", "Usar Whitelist")}
            {renderBoolean("online-mode", "Modo Online (Autenticacao Mojang)")}
          </div>
        </div>
      </div>

      {toast && (
        <div
          className="toast"
          style={{
            background: toast.type === "error" ? "rgba(239,68,68,0.9)" : undefined,
          }}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
