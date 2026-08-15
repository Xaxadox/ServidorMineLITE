import React, { useState, useEffect } from "react";
import { Play, Square, RotateCw, Server, Zap, HardDrive, Download } from "lucide-react";

const API = "http://localhost:3002/api";

/**
 * Contrato estrito para o retorno da rota /api/backups
 */
interface BackupInfo {
  filename: string;
  sizeBytes: number;
  createdAt: string;
}

/**
 * Componente principal (Home/Dashboard).
 * Monitora em tempo real o estado da JVM do Minecraft fazendo polling e injeta 
 * acoes no ProcessService e PlayerService do Backend.
 */
export default function Dashboard() {
  /** Armazena a string de status ("running", "stopped", "starting", "stopping") */
  const [status, setStatus] = useState<string>("stopped");
  
  /** Trava os botoes primarios durante o handshake com a API */
  const [loading, setLoading] = useState<boolean>(false);
  
  /** Trava o botao de Backup de Mundo pois este dispara instrucoes pesadas no disco */
  const [backupLoading, setBackupLoading] = useState<boolean>(false);
  
  /** Feedback efemero (toast) em verde/vermelho apos operacoes no disco */
  const [backupToast, setBackupToast] = useState<string | null>(null);
  
  /** Array tipado de meta-dados levantados do historico de Zips em /backups */
  const [backups, setBackups] = useState<BackupInfo[]>([]);

  /** Realiza GET contra /status. Ignora bloqueios pois roda em background (interval) */
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API}/status`);
      const data = await res.json();
      setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
  };

  /** Realiza GET contra /backups. Roda no mount inicial ou forcadamente apos gerar novo zip */
  const fetchBackups = async () => {
    try {
      const res = await fetch(`${API}/backups`);
      const data = await res.json();
      setBackups(data);
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Efeito ciclico:
   * 1. Executa o primeiro fetch() imediatamente no mount.
   * 2. Inicia o Polling de `fetchStatus` a cada 3 segundos.
   * 3. Limpa (clearInterval) automaticamente no unmount do componente (ex: tab change).
   */
  useEffect(() => {
    fetchStatus();
    fetchBackups();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Roteia a execucao dos botoes de start/stop/restart.
   * @param action A action route do controller (start|stop|restart)
   */
  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/${action}`, { method: "POST" });
      const data = await res.json();
      if (data.status) setStatus(data.status);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  /**
   * Aciona a injecao via PowerShell no backend para comprimir a pasta World.
   */
  const handleBackup = async () => {
    setBackupLoading(true);
    setBackupToast(null);
    try {
      const res = await fetch(`${API}/backup`, { method: "POST" });
      const data = await res.json();
      if (data.success && data.backup) {
        setBackupToast(`Backup criado: ${data.backup}`);
        fetchBackups();
        setTimeout(() => setBackupToast(null), 5000);
      }
    } catch (err) {
      setBackupToast("Erro ao criar backup!");
      console.error(err);
    }
    setBackupLoading(false);
  };

  /** Mapeamento estetico das traducoes cruas do servidor para UI bonita */
  const statusLabel: Record<string, string> = {
    running: "Online",
    stopped: "Offline",
    starting: "Iniciando",
    stopping: "Parando",
  };

  return (
    <div>
      <div className="header">
        <h1>Dashboard</h1>
        <p>Gerencie o estado do servidor ATM Lite</p>
      </div>

      <div className="info-banner glass">
        <Zap size={20} color="#10b981" />
        <span><strong>ATM Lite</strong> - Versao otimizada com ~35 mods. Requer apenas 4-6GB de RAM!</span>
      </div>

      <div className="grid-cards" style={{ marginTop: "2rem" }}>
        {/* Card de controle */}
        <div className="card glass">
          <div className="card-header">
            <div className="card-title">
              <Server size={20} />
              Status do Servidor
            </div>
            <span className={`status-badge ${status}`}>
              {statusLabel[status] || status}
            </span>
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              className="btn btn-success"
              onClick={() => handleAction("start")}
              disabled={status !== "stopped" || loading}
              style={{ flex: 1 }}
            >
              <Play size={18} /> Iniciar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleAction("stop")}
              disabled={status !== "running" || loading}
              style={{ flex: 1 }}
            >
              <Square size={18} /> Parar
            </button>
            <button
              className="btn btn-warning"
              onClick={() => handleAction("restart")}
              disabled={(status !== "running" && status !== "stopped") || loading}
              style={{ flex: 1 }}
            >
              <RotateCw size={18} /> Reiniciar
            </button>
          </div>
        </div>

        {/* Card de Backup [US05] */}
        <div className="card glass">
          <div className="card-header">
            <div className="card-title">
              <HardDrive size={20} />
              Backup do Mundo
            </div>
            <button
              className="btn btn-primary"
              onClick={handleBackup}
              disabled={backupLoading || status === "running"}
              title={status === "running" ? "Pare o servidor antes de criar um backup" : ""}
            >
              {backupLoading ? (
                <><RotateCw size={16} style={{ animation: "spin 1s linear infinite" }} /> Criando...</>
              ) : (
                <><Download size={16} /> Criar Backup</>
              )}
            </button>
          </div>

          {backupToast && (
            <div style={{ marginTop: "0.75rem", padding: "0.5rem 1rem", background: "rgba(16,185,129,0.15)", borderRadius: "8px", color: "#10b981", fontSize: "0.85rem" }}>
              {backupToast}
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            {backups.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Nenhum backup encontrado.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {backups.slice(0, 5).map((b) => (
                  <li key={b.filename} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{b.filename.replace("world_backup_", "").replace(".zip", "")}</span>
                    <span style={{ color: "var(--accent)" }}>{(b.sizeBytes / (1024 * 1024)).toFixed(2)} MB</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
