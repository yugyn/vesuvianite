const DetailsElement = ({ data }) => {

  return (

    <>
        <table className="table table-borderless align-middle mb-0">
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="text-muted fw-bold col-md-3">
                            {item.label}
                        </td>
                        <td 
                            className="fw-semibold text-dark"
                            dangerouslySetInnerHTML={{__html: item.value}} 
                        />
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  );
};

export default DetailsElement;