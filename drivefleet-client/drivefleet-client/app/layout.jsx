import '../src/index.css';
import AppShell from '../src/components/AppShell';

export const metadata = {
  title: 'DriveFleet',
  description: 'Premium car rental platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
