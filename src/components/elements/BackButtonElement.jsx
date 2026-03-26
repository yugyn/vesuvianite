import { useNavigate } from 'react-router-dom';

const BackButtonElement = () => {
    
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)} 
      style={{ padding: '8px 16px', cursor: 'pointer' }}
    >
      ← Torna Indietro
    </button>
  );
};

export default BackButtonElement;