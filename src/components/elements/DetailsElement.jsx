import { AppIcons } from '../../utils/iconUtils';

const DetailsElement = ({ data }) => {

    const handleClick = (e, item) => {

        e.preventDefault();
        
        let url = item.value;

        if (!url) return;

        if (item.type === 'email') {
            url = `mailto:${item.value}`;
        } else if (item.type === 'website') {
            if (!/^https?:\/\//i.test(url)) {
                url = `https://${url}`;
            }
        }

        window.electronAPI.openLink(url);

    };

    return (
        <>
            <table className="table table-borderless align-middle mb-0">

                <tbody>
                    
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="text-muted fw-bold col-md-3">
                                {item.label}
                            </td>
                            {(item.type === 'link' || item.type === 'email' || item.type === 'mapLink') ? (
                                <td 
                                    className="text-primary"
                                    style={{ cursor: 'pointer', }}
                                    onClick={(e) => handleClick(e, item)}
                                >
                                    {item.type === 'link' ? (
                                        <AppIcons.Website />
                                    ) : item.type === 'email' ? (
                                        <AppIcons.Email />
                                    ) : item.type === 'mapLink' ? (
                                        <AppIcons.Map />
                                    ) : (
                                        <></>
                                    )}                                    
                                    &nbsp;{item.value}
                                </td>
                            ) : (
                                <td className="text-dark">
                                    {item.value}
                                </td>
                            )}
                        </tr>
                    ))}

                </tbody>

            </table>

        </>
    );
};

export default DetailsElement;

//                             dangerouslySetInnerHTML={{__html: item.value}} 
