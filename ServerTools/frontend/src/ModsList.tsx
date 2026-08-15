import { Package, Shield, Map, Cpu, Hammer, Sparkles, Star, Paintbrush, Layers } from 'lucide-react';

const MODS = [
  {
    category: 'Nucleo do Endgame',
    icon: 'star',
    color: '#f59e0b',
    mods: [
      { name: 'Allthemodium', link: 'https://www.curseforge.com/minecraft/mc-mods/allthemodium', desc: 'Os 3 minerios de endgame: Allthemodium, Vibranium e Unobtainium. O objetivo final do servidor!', required: true, where: 'Servidor + Cliente' },
      { name: 'Just Enough Items (JEI)', link: 'https://www.curseforge.com/minecraft/mc-mods/jei', desc: 'Mostra as receitas de todos os itens no inventario. Indispensavel para o Allthemodium.', required: true, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Multiplayer e Navegacao',
    icon: 'map',
    color: '#3b82f6',
    mods: [
      { name: 'FTB Chunks', link: 'https://www.curseforge.com/minecraft/mc-mods/ftb-chunks', desc: 'Protecao de terreno (ninguem quebra sua base) e carregamento de chunks a distancia.', required: true, where: 'Servidor + Cliente' },
      { name: 'FTB Essentials', link: 'https://www.curseforge.com/minecraft/mc-mods/ftb-essentials', desc: 'Comandos essenciais: /tpa, /home, /spawn, /back.', required: true, where: 'Servidor + Cliente' },
      { name: 'Corail Tombstone', link: 'https://www.curseforge.com/minecraft/mc-mods/corail-tombstone', desc: 'Ao morrer, seus itens ficam salvos em uma lapide com o seu nome.', required: true, where: 'Servidor + Cliente' },
      { name: 'Waystones', link: 'https://www.curseforge.com/minecraft/mc-mods/waystones', desc: 'Pedras de teleporte espalhadas pelo mundo. Permite criar pontos de viagem rapida.', required: true, where: 'Servidor + Cliente' },
      { name: "Xaero's Minimap", link: 'https://www.curseforge.com/minecraft/mc-mods/xaeros-minimap', desc: 'Minimapa completo com waypoints e entidades visiveis.', required: true, where: 'Servidor + Cliente' },
      { name: "Xaero's World Map", link: 'https://www.curseforge.com/minecraft/mc-mods/xaeros-world-map', desc: 'Mapa mundi completo de tudo que voce explorou. Abre com a tecla M.', required: true, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Armazenamento',
    icon: 'package',
    color: '#8b5cf6',
    mods: [
      { name: 'Sophisticated Backpacks', link: 'https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks', desc: 'Mochilas que evoluem de couro ate Netherite, com upgrades de filtro, ima e auto-organizacao.', required: true, where: 'Servidor + Cliente' },
      { name: 'Sophisticated Storage', link: 'https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage', desc: 'Baus upgradaveis com capacidade muito maior. Evita lag de muitos baus de madeira.', required: true, where: 'Servidor + Cliente' },
      { name: 'Functional Storage', link: 'https://www.curseforge.com/minecraft/mc-mods/functional-storage', desc: 'Gavetas para guardar itens em massa (pedregulho, madeira). Um bloco = milhares de itens.', required: true, where: 'Servidor + Cliente' },
      { name: 'Sophisticated Storage Create', link: 'https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage-create-integration', desc: 'Integracao: Permite usar os baus do Sophisticated Storage em cima dos trens e engrenagens do Create sem bugar.', required: true, where: 'Servidor + Cliente' },
      { name: 'Sophisticated Storage in Motion', link: 'https://www.curseforge.com/minecraft/mc-mods/sophisticated-storage-in-motion', desc: 'Integracao: Permite colocar os baus dentro de carrinhos de mina e move-los pelo mundo.', required: true, where: 'Servidor + Cliente' },
      { name: 'Sophisticated Backpacks Create', link: 'https://www.curseforge.com/minecraft/mc-mods/sophisticated-backpacks-create-integration', desc: 'Integracao: Permite grudar as mochilas nas maquinas e trens do Create.', required: true, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Tecnologia — Mekanism',
    icon: 'cpu',
    color: '#06b6d4',
    mods: [
      { name: 'Mekanism', link: 'https://www.curseforge.com/minecraft/mc-mods/mekanism', desc: 'Maquinas eletricas, triplicacao de minerios, tubulacoes e jetpack. O mod de tecnologia classico.', required: true, where: 'Servidor + Cliente' },
      { name: 'Mekanism Generators', link: 'https://www.curseforge.com/minecraft/mc-mods/mekanism-generators', desc: 'Extensao do Mekanism para geracao de energia (solar, eolico, reator).', required: true, where: 'Servidor + Cliente' },
      { name: 'Mekanism Tools', link: 'https://www.curseforge.com/minecraft/mc-mods/mekanism-tools', desc: 'Armaduras e ferramentas de Osmium — a progressao entre o Netherite e o Allthemodium.', required: true, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Tecnologia — Create',
    icon: 'layers',
    color: '#f97316',
    mods: [
      { name: 'Create', link: 'https://www.curseforge.com/minecraft/mc-mods/create', desc: 'Engrenagens, correias, pistoes, trens e automacao mecanica. Fisica real aplicada ao Minecraft!', required: true, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Construcao',
    icon: 'hammer',
    color: '#10b981',
    mods: [
      { name: 'Building Gadgets 2', link: 'https://www.curseforge.com/minecraft/mc-mods/building-gadgets', desc: 'Ferramentas que constroem paredes, pisos e tetos inteiros de uma vez. Perfeito para bases grandes.', required: true, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Magia (Opcional)',
    icon: 'sparkles',
    color: '#ec4899',
    mods: [
      { name: "Iron's Spells n Spellbooks", link: 'https://www.curseforge.com/minecraft/mc-mods/irons-spells-n-spellbooks', desc: 'Sistema de magia com feiticos e grimorios. Para quem prefere a rota magica em vez de maquinas.', required: false, where: 'Servidor + Cliente' },
    ]
  },
  {
    category: 'Administracao',
    icon: 'shield',
    color: '#64748b',
    mods: [
      { name: 'Spark', link: 'https://www.curseforge.com/minecraft/mc-mods/spark', desc: 'Ferramenta de diagnostico. Se o servidor travar, /spark profiler mostra o que esta causando o lag.', required: true, where: 'So no Servidor' },
    ]
  },
  {
    category: 'Visual — Resource Packs (So no PC de cada jogador)',
    icon: 'paintbrush',
    color: '#a855f7',
    mods: [
      { name: 'Fresh Animations', link: 'https://www.curseforge.com/minecraft/texture-packs/fresh-animations', desc: 'Mobs com animacoes fluidas e naturais — parece o trailer oficial do Minecraft! Use o modo LOW para melhor desempenho.', required: true, where: 'So no Cliente (Resource Pack)' },
      { name: 'Default Dark Mode', link: 'https://www.curseforge.com/minecraft/texture-packs/default-dark-mode', desc: 'Todos os menus e interface do jogo no tema escuro. Elegante e descansado para os olhos.', required: true, where: 'So no Cliente (Resource Pack)' },
      { name: 'Vanilla Tweaks', link: 'https://vanillatweaks.net/picker/resource-packs', desc: 'Pack customizavel: escolha so os retoques que voce quer. Cada jogador pode montar o seu.', required: false, where: 'So no Cliente (Resource Pack)' },
      { name: 'Entity Model Features (EMF)', link: 'https://www.curseforge.com/minecraft/mc-mods/entity-model-features', desc: 'MOD necessario para o Fresh Animations funcionar. Habilita modelos 3D customizados dos mobs.', required: true, where: 'So no Cliente (Mod)' },
      { name: 'Entity Texture Features (ETF)', link: 'https://www.curseforge.com/minecraft/mc-mods/entity-texture-features', desc: 'MOD necessario para o EMF funcionar. Habilita texturas variadas nas entidades.', required: true, where: 'So no Cliente (Mod)' },
    ]
  },
  {
    category: 'Performance (So no PC de cada jogador)',
    icon: 'cpu',
    color: '#22c55e',
    mods: [
      { name: 'Embeddium', link: 'https://www.curseforge.com/minecraft/mc-mods/embeddium', desc: 'Melhora drasticamente o FPS ao renderizar o mundo. Substituto do Sodium para NeoForge.', required: false, where: 'So no Cliente' },
      { name: 'Entity Culling', link: 'https://www.curseforge.com/minecraft/mc-mods/entityculling', desc: 'Para de renderizar mobs e blocos atras de paredes. Grande ganho de FPS em bases grandes.', required: false, where: 'So no Cliente' },
      { name: 'FerriteCore', link: 'https://www.curseforge.com/minecraft/mc-mods/ferritecore', desc: 'Reduz o uso de RAM no cliente. Essencial para quem tem 8GB ou menos de RAM total.', required: false, where: 'So no Cliente' },
    ]
  },
];

const iconMap = {
  star: Star,
  map: Map,
  package: Package,
  cpu: Cpu,
  hammer: Hammer,
  sparkles: Sparkles,
  shield: Shield,
  paintbrush: Paintbrush,
  layers: Layers,
};

export default function ModsList() {
  const totalMods = MODS.reduce((acc, cat) => acc + cat.mods.length, 0);
  const required = MODS.reduce((acc, cat) => acc + cat.mods.filter(m => m.required).length, 0);
  const serverMods = MODS.slice(0, 8).reduce((acc, cat) => acc + cat.mods.length, 0);

  return (
    <div>
      <div className="header">
        <h1>Mods do ATM Lite</h1>
        <p>Lista completa: {required} essenciais + {totalMods - required} opcionais</p>
      </div>

      <div className="mods-summary glass" style={{ padding: '1.25rem 2rem', marginBottom: '2rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)' }}>22</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Mods no Servidor</div>
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
                        {mod.name} ↗
                      </a>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '99px', textTransform: 'uppercase', background: mod.required ? '#d1fae5' : '#fef3c7', color: mod.required ? '#10b981' : '#f59e0b' }}>
                        {mod.required ? 'Essencial' : 'Opcional'}
                      </span>
                      <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '99px', background: '#f1f5f9', color: 'var(--text-muted)', fontWeight: 600 }}>
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


