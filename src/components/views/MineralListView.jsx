import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MineralList from '../lists/MineralList'

const MineralListView = () => {

    const navigate = useNavigate();
    const location = useLocation();
    
    const [notification, setNotification] = useState("");

    async function loadNotification() {

        if(location.state && location.state.message) {
            setNotification(location.state.message);
//            const timer = setTimeout(() => setNotification(""), 5000);
//            return () => clearTimeout(timer);
        }

    }
    
    useEffect( () => {
        loadNotification();
    }, []);
    
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
                <MineralList />
            </div>

        </>
    );

};


export default MineralListView;