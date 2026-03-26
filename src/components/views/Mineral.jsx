import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

const Mineral = () => {

    const navigate = useNavigate();
    const location = useLocation();


    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState("");

    async function loadNotification() {

        if(location.state && location.state.message) {
            setNotification(location.state.message);
//            const timer = setTimeout(() => setNotification(""), 5000);
//            return () => clearTimeout(timer);
        }

    }

    async function loadElement() {

        try {

            const data = await window.electronAPI.getMineral(id);
            if(data) {
                setElement(data);
            } else {
                setError("Not found.");
            }

        } catch(err) {
            setError("Error...");
            console.error(err);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect( () => {
        if(id) {
            loadElement();
            loadNotification();
        }
    }, [id]);
    
    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;


    const handleDelete = async () => {
    
        setError(null);

        if(!window.confirm("Confermi l'eliminazione?")) {
            return;
        }

        const result = await window.electronAPI.deleteMineral(id);
        if(result.success) {
            navigate(`/minerals`, {
                state: {message: "Elemento eliminato con successo."} 
            });
        } else {
            setError(result.error);
        }

    }

    return (
        <>
            <div style={{ padding: '20px' }}>
                {notification && (
                    <div style={{ 
                        padding: '10px', 
                        backgroundColor: '#d4edda', 
                        color: '#155724',
                        borderRadius: '5px',
                        marginBottom: '20px' 
                    }}>
                        {notification}
                    </div>
                )}
                <h1>Mineral</h1>
                <Link to="/minerals" className="btn">Torna a Minerali</Link>
                <button 
                    onClick={() => navigate(`/mineralSave/${element.id}`)}
                >
                    Modifica
                </button>
                <button 
                    onClick={handleDelete}
                >
                    Elimina
                </button>

                <table className="table table-bordered table-hover datatable-table" id="sortTable">
                    <tbody id="tbody">
                        <tr>
                            <td>
                                Minerale
                            </td>
                            <td>
                                {element.name}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Tipo
                            </td>
                            <td>
                                {element.typology}
                            </td>
                        </tr>
                    </tbody>
                </table>        

            </div>
        </>
    );

};


export default Mineral;