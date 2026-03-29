import { MINERAL_GENESIS_BOTH, MINERAL_GENESIS_FUMAROLIC, MINERAL_GENESIS_NORMAL, MINERAL_TYPOLOGY_VIRTUAL } from "../costants";
import { AppIcons } from '../utils/iconUtils';

export const mineralFullname = (mineral) => {

    let name = mineral.name;
    if(mineral.typology == MINERAL_TYPOLOGY_VIRTUAL) {
        name = `'${name}'`;
    } 

    const genesisIcon = () => {
        switch (mineral.genesis) {
            case MINERAL_GENESIS_NORMAL: return <AppIcons.Mineral.Genesis.Normal />;
            case MINERAL_GENESIS_FUMAROLIC: return <AppIcons.Mineral.Genesis.Fumarolic />;
            case MINERAL_GENESIS_BOTH: return <AppIcons.Mineral.Genesis.Both />;
            default: return <AppIcons.Mineral.Genesis.Undefined />;
        }
    }

    return (
        <>
            <small><small>{genesisIcon()}</small></small> {name}
        </>
    )

}
