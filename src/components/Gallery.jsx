import { Link } from 'react-router-dom';

const Gallery = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🖼️ Galleria Immagini</h1>
      <p>Questa è una pagina separata.</p>
      <Link to="/" className="btn">Torna alla Home</Link>
    </div>
  );
};

export default Gallery;