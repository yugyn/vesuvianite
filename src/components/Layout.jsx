import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Link } from 'react-router-dom';

import BackButtonElement from "./elements/BackButtonElement";

const Layout = () => {

//    const sidebarWidth = '200px';
//    const headerHeight = '56px';
    const sidebarWidth = '200px';
    const headerHeight = '80px';

    const [notification, setNotification] = useState({ message: '', visible: false, type: 'success' });

    useEffect(() => {
        // Ascoltiamo l'evento personalizzato 'app-notify'
        const handleNotify = (event) => {
            const { message, type = 'success' } = event.detail;
            setNotification({ message, visible: true, type });

            // Nascondi automaticamente dopo 3 secondi
            setTimeout(() => {
                setNotification(prev => ({ ...prev, visible: false }));
            }, 3000);
        };

        window.addEventListener('app-notify', handleNotify);
        return () => window.removeEventListener('app-notify', handleNotify);
    }, []);    

    return (

        <>

            <div className="vh-100 d-flex flex-column">
      
                <nav className="bg-dark bg-custom-dark text-white fixed-top" style={{ height: headerHeight, zIndex: 1030}}>
                    <div className="container-fluid">
                        <nav style={styles.nav}>
                            <Link 
                                to="/"
                                className='text-white'
                            >
                                Home
                            </Link>
                            <Link 
                                to="/todo"
                                className='text-white'
                            >
                                To-Do
                            </Link>
                            <Link 
                                to="/mineralClasses"
                                className='text-white'
                            >
                                Mineral Classes
                            </Link>
                            <Link 
                                to="/crystalSystems"
                                className='text-white'
                            >
                                Crystal Systems
                            </Link>
                            <Link 
                                to="/minerals"
                                className='text-white'
                            >
                                Minerali
                            </Link>
                            <Link 
                                to="/containers"
                                className='text-white'
                            >
                                Contenitori
                            </Link>
                            <Link 
                                to="/sellers"
                                className='text-white'
                            >
                                Venditori
                            </Link>
                            <BackButtonElement />
                            <Link 
                                to="/trashes"
                                className='text-white'
                            >
                                Cestino
                            </Link>
                        </nav>
                    </div>
                </nav>

                <div className="d-flex flex-grow-1" style={{ marginTop: headerHeight }}>
        
                    <nav id="sidebar" className="bg-dark bg-custom-dark text-white position-fixed" style={{ 
                        width: sidebarWidth, 
                        height: `calc(100vh - ${headerHeight})`,
                        top: headerHeight,
                        left: 0,
                    }}>
                        <div className="p-3">
                            <ul className="nav flex-column">
                                <li className="nav-item">
                                    <Link 
                                        to="/minerals" 
                                        style={styles.navLink}
                                        className='text-white'
                                    >
                                        Minerali
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link 
                                        to="/crystalSystems" 
                                        style={styles.navLink}
                                        className='text-white'
                                    >
                                        Sistemi cristallini
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    <main style={{ 
                        marginLeft: sidebarWidth, 
                        width: `calc(100% - ${sidebarWidth})`,
                        overflowY: 'auto' 
                    }}>
                        <div className="container-fluid p-4">
                            <Outlet />
                        </div>
                    </main>

                </div>

            </div>

            <div className={`notification-toast ${notification.visible ? 'show' : ''} bg-${notification.type}`}>
                <span>{notification.message}</span>
                <button 
                    onClick={() => setNotification(prev => ({ ...prev, visible: false }))}
                    style={{ background: 'none', border: 'none', color: 'white', marginLeft: '15px', cursor: 'pointer' }}
                >
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>                        

        </>
        
    );
};

export default Layout;

const styles = {
  container: { padding: '20px', fontFamily: 'sans-serif' },
  nav: { padding: '10px', display: 'flex', gap: '15px' },
  navLink: { textDecoration: 'none', fontWeight: 'bold' },

};