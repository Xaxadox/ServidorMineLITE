import React from 'react';
import { Package, Cog, Boxes, Wrench, Shield, Zap } from 'lucide-react';

const iconMap: Record<string, any> = {
  Cog, Boxes, Wrench, Shield, Zap, Package
};

interface Mod {
  name: string;
  required: boolean;
  link: string;
  desc: string;
  where: string;
}

interface ModCategory {
  category: string;
  icon: string;
  color: string;
  mods: Mod[];
}

/**
 * Constante pesada mantendo todos os metadados dos mods instalados
 */
const MODS: ModCategory[] = [
  {
    category: "Nucleo Industrial (Tech)",
    icon: "Cog",
    color: "#eab308",
    mods: [
      { name: "Create", required: true, link: "https://modrinth.com/mod/create", desc: "Base para automacoes cineticas.", where: "Ambos" },
      { name: "Mekanism", required: true, link: "https://modrinth.com/mod/mekanism", desc: "Processamento avancado, reatores e armaduras high-tech.", where: "Ambos" },
      { name: "Mekanism Generators", required: true, link: "https://modrinth.com/mod/mekanism-generators", desc: "Geradores de energia para o Mekanism.", where: "Ambos" },
      { name: "Mekanism Tools", required: false, link: "https://modrinth.com/mod/mekanism-tools", desc: "Ferramentas feitas com materiais do Mekanism (Osmium, etc).", where: "Ambos" }
    ]
  },
  {
    category: "QoL & Inventario",
    icon: "Boxes",
    color: "#3b82f6",
    mods: [
      { name: "JEI", required: true, link: "https://modrinth.com/mod/jei", desc: "Visualizador de receitas. Substituido na versao 1.21.1 pela build 19.44.0.", where: "Ambos" },
      { name: "Sophisticated Backpacks", required: true, link: "https://modrinth.com/mod/sophisticated-backpacks", desc: "Mochilas altamente atualizaveis. Depende de Sophisticated Core.", where: "Ambos" },
      { name: "Sophisticated Storage", required: true, link: "https://modrinth.com/mod/sophisticated-storage", desc: "Baus e barris atualizaveis. Depende de Sophisticated Core.", where: "Ambos" },
      { name: "Functional Storage", required: false, link: "https://modrinth.com/mod/functional-storage", desc: "Gavetas e controladores estilo Storage Drawers.", where: "Ambos" }
    ]
  },
  {
    category: "Exploracao & Aventura",
    icon: "Shield",
    color: "#ef4444",
    mods: [
      { name: "Waystones", required: true, link: "https://modrinth.com/mod/waystones", desc: "Pontos de viagem rapida no mundo (usa XP).", where: "Ambos" },
      { name: "Corail Tombstone", required: false, link: "https://modrinth.com/mod/corail-tombstone", desc: "Sistemas de lapide para guardar itens ao morrer.", where: "Ambos" },
      { name: "Iron's Spells 'n Spellbooks", required: false, link: "https://modrinth.com/mod/irons-spells", desc: "Magia RPG completa.", where: "Ambos" }
    ]
  },
  {
    category: "Desempenho & Otimizacao",
    icon: "Zap",
    color: "#10b981",
    mods: [
      { name: "FerriteCore", required: false, link: "https://modrinth.com/mod/ferrite-core", desc: "Reduz agressivamente o uso de memoria RAM.", where: "Ambos" },
      { name: "Spark", required: false, link: "https://modrinth.com/mod/spark", desc: "Profiler de desempenho / TPS para administradores.", where: "Server" },
      { name: "Rubidium / Embeddium", required: false, link: "https://modrinth.com/mod/embeddium", desc: "Otimizacao critica de FPS (Sodium port).", where: "Client" }
    ]
  }
];

/**
 * Componente View estatico que renderiza a constante de mods em um Grid Card
 * com badges dinamicas. Nao possui estado ou comunicacao de rede.
 */
export default function ModsList() {
  return (
    <div>
      <div className="header">
        <h1>Lista de Mods</h1>
        <p>Acompanhe o nucleo duro do ATM Lite (Ambos = Server-side e Client-side)</p>
      </div>

      {/* Estatisticas Globais */}
      <div className="glass" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>35</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mods Nucleares</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>~29</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Com dependencias</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>4-6GB</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>RAM necessaria</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7' }}>3</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Resource Packs</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>-95%</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>vs ATM10 original</div>
        </div>
      </div>

      {MODS.map((category) => {
        const Icon = iconMap[category.icon] || Package;
        return (
          <div key={category.category} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: category.color + '22', borderRadius: '12px', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={category.color} />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>{category.category}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {category.mods.map((mod) => (
                <div key={mod.name} className="glass" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ minWidth: '10px', height: '10px', borderRadius: '50%', background: mod.required ? '#10b981' : '#f59e0b', marginTop: '6px' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                      <a href={mod.link} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.05rem', textDecoration: 'none' }}>
                        {mod.name} ?
                      </a>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase', background: mod.required ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: mod.required ? '#10b981' : '#f59e0b' }}>
                        {mod.required ? 'Essencial' : 'Opcional'}
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', background: 'var(--card-border)', color: 'var(--text-muted)', fontWeight: 600 }}>
                        {mod.where}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

