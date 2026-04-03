export const formatDate = (date, format) => {
    
    const d = new Date(date);
    
    if (isNaN(d.getTime())) return "Date invalid";

    const map = {
        'dd': String(d.getDate()).padStart(2, '0'),
        'MM': String(d.getMonth() + 1).padStart(2, '0'),
        'yyyy': d.getFullYear(),
        'HH': String(d.getHours()).padStart(2, '0'),
        'mm': String(d.getMinutes()).padStart(2, '0'),
        'ss': String(d.getSeconds()).padStart(2, '0')
    };

    return format.replace(/dd|MM|yyyy|HH|mm|ss/g, matched => map[matched]);

}