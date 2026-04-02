import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { MINERAL_TYPOLOGY_REAL, MINERAL_TYPOLOGY_VIRTUAL, MINERAL_GENESIS_NORMAL, MINERAL_GENESIS_FUMAROLIC, MINERAL_GENESIS_BOTH } from "../../costants";
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';

const MineralFormView = () => {

    const { t } = useTranslation();

    const navigate = useNavigate();
    const { id } = useParams();
    const [element, setElement] = useState({
        name: '', 
        typology: MINERAL_TYPOLOGY_REAL, 
        genesis: MINERAL_GENESIS_NORMAL, 
        formula: '', 
        crystal_system_id: '', 
        mineral_class_id: '',
    });
    const [crystalSystems, setCrystalSystems] = useState(null);
    const [mineralClasses, setMineralClasses] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadAll() {

        try {

            if(id && id !== '0') {
                const data = await window.electronAPI.getMineral(id);
                if(data) {
                    setElement(data);
                } else {
                    setError("Not found.");
                }
            }

            const dataCS = await window.electronAPI.getAllCrystalSystems();
            if(dataCS) {
                setCrystalSystems(dataCS);
            }

            const dataMC = await window.electronAPI.getAllMineralClasses();
            if(dataMC) {
                setMineralClasses(dataMC);
            }

        } catch(err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        
    }

    useEffect( () => {
        loadAll();
    }, []);

    if (error) return <div>{error}</div>;
    if (loading) return <div>Caricamento in corso...</div>;

    const handleSubmit = async (e) => {
    
        e.preventDefault();
        setError(null);

        const name = document.getElementById('name').value.trim();
        const typology = document.getElementById('typology').value;
        const genesis = document.getElementById('genesis').value;
        const formula = document.getElementById('formula').value.trim();
        const crystalSystem = document.getElementById('crystalSystem').value;
        const mineralClass = document.getElementById('mineralClass').value;

        const params = {
            id: (id ? id : 0),
            name: name,
            typology: typology,
            genesis: genesis,
            formula: formula,
            crystalSystem: (crystalSystem == '' ? null : crystalSystem),
            mineralClass: (mineralClass == '' ? null : mineralClass),
        }

        const result = await window.electronAPI.saveMineral(params);
        if(result.success) {
            navigate(`/mineral/${result.id}`, {
                state: {message: "Elemento salvato con successo."} 
            });
        } else {
            setError(result.error);
        }

    }

    return (
        <>
            {id == 0 ? (
                <>
                    <PageHeader 
                        title={t('mineral.page.create')}
                    >
                        <button 
                            className={`btn btn-outline-primary`}
                            onClick={() => navigate(`/minerals`)}
                            title={t('mineral.action.back.minerals')}
                        >
                            <AppIcons.Back />
                        </button>
                    </PageHeader>
                </>
            ) : (
                <>
                    <PageHeader 
                        title={t('mineral.page.edit')}
                    >
                        <button 
                            className={`btn btn-outline-primary`}
                            onClick={() => navigate(`/mineral/${element.id}`)}
                            title={t('mineral.action.back.mineral')}
                        >
                            <AppIcons.Back />
                        </button>
                    </PageHeader>
                </>
            )}

            <hr/>

            <form onSubmit={handleSubmit}>

                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('mineral.name')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="name" 
                            defaultValue={element.name}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('mineral.typology')}
                    </label>
                    <div className="col-sm-4">
                        <select 
                            className="form-select"
                            id="typology"
                            defaultValue={element.typology}
                        >
                            <option value={MINERAL_TYPOLOGY_REAL}>Reale</option>
                            <option value={MINERAL_TYPOLOGY_VIRTUAL}>Virtuale</option>
                        </select>
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('mineral.genesis')}
                    </label>
                    <div className="col-sm-4">
                        <select 
                            className="form-select"
                            id="genesis"
                            defaultValue={element.genesis}
                        >
                            <option value={MINERAL_GENESIS_NORMAL}>Normale</option>
                            <option value={MINERAL_GENESIS_FUMAROLIC}>Fumarolico</option>
                            <option value={MINERAL_GENESIS_BOTH}>Entrambi</option>
                        </select>
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('mineral.formula')}
                    </label>
                    <div className="col-sm-4">
                        <input 
                            className="form-control"
                            id="formula" 
                            defaultValue={element.formula}
                        />
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('crystalSystem.label')}
                    </label>
                    <div className="col-sm-4">
                        <select 
                            className="form-select"
                            id="crystalSystem"
                            defaultValue={element.crystal_system_id}
                        >
                            <option value=''>- nessuno -</option>
                            {crystalSystems.map((item) => (
                                <option 
                                    key={item.id}
                                    value={item.id}
                                >{item.name}</option>
                            ))}
                        </select>
                    </div>
                </div>                
                <div className="mb-3 row">
                    <label className="col-sm-2 col-form-label">
                        {t('mineralClass.label')}
                    </label>
                    <div className="col-sm-4">
                        <select 
                            className="form-select"
                            id="mineralClass"
                            defaultValue={element.mineral_class_id}
                        >
                            <option value=''>- nessuna -</option>
                            {mineralClasses.map((item) => (
                                <option 
                                    key={item.id}
                                    value={item.id}
                                >{item.name}</option>
                            ))}
                        </select>
                    </div>
                </div>                

                <hr/>

                <button 
                    className="btn btn-primary"
                >
                    {t('mineral.action.save')}
                </button>

            </form>

        </>
    );

};


export default MineralFormView;