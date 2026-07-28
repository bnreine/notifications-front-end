import { Link, Outlet } from 'react-router';
import { footerStyle, linkStyle, pageStyle } from './styles';

const Layout = () => (
  <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <main style={{ flex: 1, ...pageStyle }}>
      <Outlet />
    </main>
    <footer style={footerStyle}>
      <div>2026 Notifications</div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link to="/privacy" style={linkStyle}>
          Privacy Policy
        </Link>
        <Link to="/terms" style={linkStyle}>
          Terms of Service
        </Link>
      </div>
    </footer>
  </div>
);

export default Layout;
