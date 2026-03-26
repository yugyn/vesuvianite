import BackButtonElement from "./elements/BackButtonElement";

function Navbar() {

    const handleOpenAbout = () => {
        window.electronAPI.openAbout();
    };

    const handleOpenWhatis = () => {
        window.electronAPI.openWhatis();
    };

    return (

        <>
            <nav className="navbar navbar-dark bg-dark">
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1">Vesuvianite</span>
                    <button onClick={handleOpenAbout}>
                        Apri Finestra About
                    </button>
                    <button onClick={handleOpenWhatis}>
                        Apri Finestra Cos'è
                    </button>
                    <BackButtonElement />
                </div>
            </nav>    
        </>

    );

}

export default Navbar;