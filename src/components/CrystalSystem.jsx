import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import MineralList from './lists/MineralList';
import { ELEMENT_CRYSTALSYSTEM } from '../costants';

const CrystalSystem = () => {

    const { id } = useParams();
    const [element, setElement] = useState(null);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function loadElement() {

            try {

                const data = await window.electronAPI.getCrystalSystem(id);
                if(data) {
                    setElement(data);
                } else {
                    setError("Not found.");
                }


            } catch(err) {
                setError("Error...");
                console.error(err);
            }
            
        }

        if(id) loadElement();

    }, [id]);

    if (error) return <div>{error}</div>;
    if (!element) return <div>Caricamento in corso...</div>;

    return (
        <>
            <div style={{ padding: '20px' }}>
                <h1>Crystal System</h1>
                <Link to="/crystalSystems" className="btn">Torna a Crystal Systems</Link>

                <table className="table table-bordered table-hover datatable-table" id="sortTable">
                    <tbody id="tbody">
                        <tr>
                            <td>
                                Sistema cristallino
                            </td>
                            <td>
                                {element.name}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                Area
                            </td>
                            <td>
                                ?
                            </td>
                        </tr>
                    </tbody>
                </table>        

                <MineralList 
                    elementName={ELEMENT_CRYSTALSYSTEM} 
                    elementId={element.id}
                    subList={true}
                />

            </div>
        </>
    );

};


export default CrystalSystem;