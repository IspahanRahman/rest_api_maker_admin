// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Rest Api Maker',
  description: 'Your app description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
