const DescriptionElement = ({element}) => {

    return (
        <>
            <div className="mt-5 mb-2" style={{whiteSpace: 'pre-wrap'}}>
                {element.description}
            </div>
        </>
    );

};


export default DescriptionElement;