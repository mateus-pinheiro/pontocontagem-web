'use client';

// Shell do painel — sidebar, topbar, busca global. Porte de web-shell.jsx,
// com a navegação ligada ao roteador do Next.

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { WT } from '@/lib/theme';
import { useAuth } from '@/lib/auth';
import { fmtDataLonga } from '@/lib/format';
import { WAvatar, WIcon, WInput } from './ui';
import { BrandMark } from './BrandMark';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'painel', icon: 'dashboard', href: '/' },
  { id: 'pontos', label: 'pontos', icon: 'clock', href: '/pontos' },
  { id: 'contagens', label: 'contagens', icon: 'clipboard', href: '/contagens' },
  { id: 'funcionarios', label: 'funcionários', icon: 'people', href: '/funcionarios' },
  { id: 'itens', label: 'itens', icon: 'box', href: '/itens' },
  { id: 'listas', label: 'listas de contagem', icon: 'list', href: '/listas' },
  { id: 'relatorios', label: 'relatórios', icon: 'chart', href: '/relatorios' },
];

const NAV_SECONDARY: NavItem[] = [
  { id: 'gerentes', label: 'gerentes', icon: 'shield', href: '/gerentes' },
];

// ── Busca global (compartilhada entre topbar e telas) ────────────────────
const SearchCtx = createContext<{
  search: string;
  setSearch: (v: string) => void;
}>({ search: '', setSearch: () => {} });

export function useSearch() {
  return useContext(SearchCtx);
}

// ── Sidebar ──────────────────────────────────────────────────────────────
function SidebarItem({
  item,
  active,
  onClick,
  alert,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  alert?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={active ? 'w-sb-item is-active' : 'w-sb-item'}
      style={{
        width: '100%', padding: '8px 12px', borderRadius: 8,
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10,
        fontFamily: WT.font, fontSize: 14, fontWeight: 500,
        letterSpacing: -0.1, margin: '1px 0', textAlign: 'left',
        transition: 'background .12s, color .12s',
      }}
    >
      <WIcon
        name={item.icon}
        size={18}
        color={active ? '#fff' : WT.ink2}
        strokeWidth={1.7}
      />
      <span style={{ flex: 1 }}>{item.label}</span>
      {alert ? (
        <span
          style={{
            minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
            background: active ? 'rgba(255,255,255,0.18)' : WT.terra,
            color: '#fff', fontSize: 11, fontWeight: 700,
            display: 'inline-flex', alignItems: 'center',
            justifyContent: 'center', fontVariantNumeric: 'tabular-nums',
          }}
        >
          {alert}
        </span>
      ) : null}
    </button>
  );
}

function Sidebar({
  current,
  onNavigate,
  alerts = {},
}: {
  current: string;
  onNavigate: (item: NavItem) => void;
  alerts?: Record<string, number>;
}) {
  const { usuario, sair } = useAuth();
  const [menu, setMenu] = useState(false);
  return (
    <aside
      style={{
        width: 232, background: WT.surface,
        borderRight: `1px solid ${WT.line}`,
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        fontFamily: WT.font,
      }}
    >
      <div
        style={{
          padding: '20px 18px 14px', display: 'flex',
          alignItems: 'center', gap: 10,
        }}
      >
        <div
          style={{
            width: 32, height: 32, borderRadius: 9,
            background: WT.ink, color: '#fff',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontFamily: WT.font,
            fontWeight: 700, fontSize: 15, letterSpacing: -0.5,
          }}
        >
          <BrandMark size={20} stemColor="#f7f5f0" />
        </div>
        <div>
          <div
            style={{
              fontSize: 14, fontWeight: 600, color: WT.ink,
              letterSpacing: -0.35, lineHeight: 1.1,
            }}
          >
            ponto contagem
          </div>
          <div
            style={{
              fontSize: 11, color: WT.ink3, fontWeight: 500, marginTop: 1,
            }}
          >
            Pitéu
          </div>
        </div>
      </div>

      <div style={{ padding: '6px 10px 0', flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={current === item.id}
            onClick={() => onNavigate(item)}
            alert={alerts[item.id]}
          />
        ))}
        <div
          style={{
            height: 1, background: WT.line, margin: '12px 8px',
          }}
        />
        {NAV_SECONDARY.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            active={current === item.id}
            onClick={() => onNavigate(item)}
            alert={alerts[item.id]}
          />
        ))}
      </div>

      <div style={{ padding: '10px 10px 14px', position: 'relative' }}>
        {menu && (
          <div
            style={{
              position: 'absolute', bottom: 60, left: 10, right: 10,
              background: WT.surface2, border: `1px solid ${WT.line}`,
              borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
              overflow: 'hidden', zIndex: 10,
            }}
          >
            <button
              onClick={sair}
              style={{
                width: '100%', padding: '10px 14px', border: 'none',
                background: 'transparent', cursor: 'pointer',
                fontFamily: WT.font, fontSize: 13, fontWeight: 600,
                color: WT.danger, textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = WT.lineSoft)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              <WIcon name="exit" size={15} color={WT.danger} />
              sair do painel
            </button>
          </div>
        )}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: WT.lineSoft,
          }}
        >
          <WAvatar name={usuario?.nome || 'Gerente'} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 13, fontWeight: 600, color: WT.ink,
                letterSpacing: -0.1, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {usuario?.nome || 'Gerente'}
            </div>
            <div style={{ fontSize: 11, color: WT.ink3, marginTop: 1 }}>
              gerente
            </div>
          </div>
          <button
            onClick={() => setMenu((m) => !m)}
            style={{
              width: 28, height: 28, borderRadius: 7, border: 'none',
              background: 'transparent', cursor: 'pointer',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = WT.surface2)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
          >
            <WIcon name="moreH" size={16} color={WT.ink3} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ── Top bar ──────────────────────────────────────────────────────────────
function TopBar({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (v: string) => void;
}) {
  const [agora, setAgora] = useState<Date | null>(null);
  useEffect(() => {
    setAgora(new Date());
    const t = setInterval(() => setAgora(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        height: 56, borderBottom: `1px solid ${WT.line}`,
        background: WT.bg, display: 'flex', alignItems: 'center',
        gap: 12, padding: '0 24px', flexShrink: 0, fontFamily: WT.font,
      }}
    >
      <div style={{ position: 'relative', maxWidth: 360, flex: 1 }}>
        <WInput
          icon="search"
          size="sm"
          placeholder="buscar funcionário, item ou contagem…"
          value={search}
          onChange={onSearchChange}
        />
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          fontSize: 13, color: WT.ink2, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <WIcon name="calendar" size={15} color={WT.ink3} />
        {agora ? (
          <>
            {fmtDataLonga(agora)} ·{' '}
            <span style={{ color: WT.ink, fontWeight: 600 }}>
              {agora.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}

// ── Page layout ──────────────────────────────────────────────────────────
export function PageShell({
  children,
  alerts,
}: {
  children: React.ReactNode;
  alerts?: Record<string, number>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState('');

  const current =
    [...NAV_ITEMS, ...NAV_SECONDARY].find((n) =>
      n.href === '/' ? pathname === '/' : pathname.startsWith(n.href),
    )?.id || 'dashboard';

  return (
    <SearchCtx.Provider value={{ search, setSearch }}>
      <div
        style={{
          display: 'flex', height: '100%', width: '100%',
          background: WT.bg, fontFamily: WT.font, overflow: 'hidden',
        }}
      >
        <Sidebar
          current={current}
          alerts={alerts}
          onNavigate={(item) => {
            setSearch('');
            router.push(item.href);
          }}
        />
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            minWidth: 0, position: 'relative',
          }}
        >
          <TopBar search={search} onSearchChange={setSearch} />
          <div
            style={{ flex: 1, overflowY: 'auto', position: 'relative' }}
          >
            {children}
          </div>
        </div>
      </div>
    </SearchCtx.Provider>
  );
}
