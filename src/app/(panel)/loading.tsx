import { WT } from '@/lib/theme';

// Fallback de navegação do painel. O App Router mostra isto NA HORA ao
// trocar de aba (a sidebar/topbar ficam no layout e persistem; só a
// área de conteúdo vira skeleton) enquanto a rota carrega — em vez de
// segurar a tela antiga até a API responder.

const shimmer = {
  background: WT.lineSoft,
  borderRadius: 8,
  animation: 'wpulse 1.2s ease-in-out infinite',
} as const;

function Bar({
  w,
  h = 14,
  r = 7,
  mt = 0,
}: {
  w: number | string;
  h?: number;
  r?: number;
  mt?: number;
}) {
  return (
    <div
      style={{ ...shimmer, width: w, height: h, borderRadius: r, marginTop: mt }}
    />
  );
}

function CardSkeleton({ h }: { h: number }) {
  return (
    <div
      style={{
        background: WT.surface,
        border: `1px solid ${WT.line}`,
        borderRadius: 14,
        padding: 20,
        height: h,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <Bar w={160} h={16} />
      <Bar w="100%" h={12} mt={4} />
      <Bar w="82%" h={12} />
      <Bar w="90%" h={12} />
      <Bar w="70%" h={12} />
    </div>
  );
}

export default function PanelLoading() {
  return (
    <div style={{ fontFamily: WT.font }}>
      {/* header (espelha WPageHeader) */}
      <div
        style={{
          padding: '24px 32px 18px',
          display: 'flex',
          alignItems: 'flex-end',
          gap: 16,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <Bar w={120} h={10} r={5} />
          <Bar w={260} h={24} r={8} mt={10} />
          <Bar w={360} h={13} mt={10} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Bar w={110} h={36} r={9} />
          <Bar w={140} h={36} r={9} />
        </div>
      </div>

      {/* conteúdo: 4 stats + grid de cards */}
      <div style={{ padding: '0 32px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 18,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                background: WT.surface,
                border: `1px solid ${WT.line}`,
                borderRadius: 14,
                padding: '18px 20px',
                display: 'flex',
                gap: 12,
              }}
            >
              <div
                style={{
                  ...shimmer,
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <Bar w="60%" h={11} />
                <Bar w={48} h={22} r={6} mt={10} />
                <Bar w="80%" h={10} mt={8} />
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: 18,
          }}
        >
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <CardSkeleton h={240} />
            <CardSkeleton h={200} />
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
          >
            <CardSkeleton h={200} />
            <CardSkeleton h={220} />
          </div>
        </div>
      </div>
    </div>
  );
}
