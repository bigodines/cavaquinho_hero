import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations();
  
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}
