import { BrandMark } from '@/components/BrandMark';

// Splash/loading brandado — fundo ink com a marca centralizada.
export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <BrandMark size={72} stemColor="#f7f5f0" />
    </div>
  );
}
