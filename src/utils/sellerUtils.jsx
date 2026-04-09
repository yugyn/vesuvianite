import { AppIcons } from '../utils/iconUtils';

export const fullAddress = (seller) => {

    let ret = seller.address;
    if(seller.postal_code) {
        ret += ' - ' + seller.postal_code;
    }
    if(seller.city) {
        ret += ' - ' + seller.city;
        if(seller.state) {
            ret += ' (' + seller.state + ')';
        }
        if(seller.country) {
            ret += ' - ' + seller.country;
        }
    }

    return (
        ret
    )

}
