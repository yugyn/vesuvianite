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

export const deleteAllChilds = async (result, elementName, elementId) => {

    if(result.physical) {

        const dataImages = await window.electronAPI.deleteAllImages({elementName: elementName, elementId: elementId});

        if(dataImages) {

            for (const item of dataImages) {

                const pathFile = await window.electronAPI.getPathImage(`${elementName}/${elementId}/${item.filename}`);
                await window.electronAPI.deleteImage({ id: item.id,  physical: true});
                await window.electronAPI.deleteFile({ pathFile: pathFile });

            }

            const pathElement = await window.electronAPI.getPathImage(`${elementName}/${elementId}/`);
            await window.electronAPI.deleteFolder({ path: pathElement });

        }

        await window.electronAPI.deleteAllAnnotations({elementName: elementName, elementId: elementId});

    }

}