import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🏠 Dashboard Principale</h1>
      <p>Benvenuto nell'app Electron!</p>
      <Link to="/gallery" className="btn">Vai alla Galleria</Link>
    </div>
  );
};

export default Home;