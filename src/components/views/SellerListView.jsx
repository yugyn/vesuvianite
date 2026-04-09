import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import SellerList from '../lists/SellerList';

const SellerListView = () => {

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
            <SellerList />

        </>
    );

};


export default SellerListView;