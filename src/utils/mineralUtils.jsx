import { MINERAL_TYPOLOGY_VIRTUAL, ICON_MINERAL_GENESYS_UNDEFINED, ICON_MINERAL_GENESYS_NORMAL, ICON_MINERAL_GENESYS_FUMAROLIC, ICON_MINERAL_GENESYS_BOTH } from "../costants";
import { AppIcons } from '../utils/iconUtils';

export const mineralName = (mineral) => {

    let name = mineral.name;
    if(mineral.typology == MINERAL_TYPOLOGY_VIRTUAL) {
        name = `'${name}'`;
    } 

    return (
        <>
            <AppIcons.MineralGenesysUndefined /> {name}
        </>
    )

};