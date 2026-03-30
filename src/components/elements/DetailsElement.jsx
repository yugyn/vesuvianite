const DetailsElement = ({ data }) => {

  return (

    <>
        <table className="table table-bordered table-hover datatable-table" id="sortTable">
            <tbody>
                {data.map((item, index) => (
                    <tr key={index}>
                        <td className="table-light col-md-3">
                            {item.label}
                        </td>
                        <td dangerouslySetInnerHTML={{__html: item.value}} />
                    </tr>
                ))}
            </tbody>
        </table>
    </>
  );
};

export default DetailsElement;