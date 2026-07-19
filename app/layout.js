import './globals.css';

export const metadata = {
  title: 'LGS Soru Takip',
  description: 'Zorlanılan soruların zaman içindeki takibi',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
