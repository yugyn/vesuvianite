import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MineralClassDB from '../db/MineralClassDB';

const MineralClasses = () => {

    const ulList = useRef(null);
    const tbodyList = useRef(null);

    useEffect(() => {
    
        const ul = ulList.current;
        const tbody = tbodyList.current;

        if(tbody) {
            render();
        }

        return () => {
        };

    }, []);

    const render = async () => {

        const tbody = document.getElementById('tbody');
        const elements = await window.electronAPI.getAllMineralClasses();
        tbody.innerHTML = '';
        elements.forEach(element => {
        
            const tr = tbody.insertRow(-1);
            
            const tdName = tr.insertCell(-1);
            const tdMinerals = tr.insertCell(-1);
            const tdAreas = tr.insertCell(-1);

            tdName.textContent = element.name;
            tdMinerals.textContent = MineralClassDB.getMineralsCount(element);

        });
        
    }
    

    return (
        <div style={{ padding: '20px' }}>
        <h1>Mineral class</h1>
        <Link to="/" className="btn">Torna alla Home</Link>

        <table className="table table-bordered table-hover datatable-table" id="sortTable">
            <thead className="table-light">
                <tr>
                    <th>Classe</th>
                    <th style={{textAlign: 'center', width: '100px'}}>Minerali</th>
                    <th>Area</th>
                </tr>
            </thead>
            <tbody ref={tbodyList} id="tbody">
            </tbody>
        </table>        

        </div>
    );

};


export default MineralClasses;