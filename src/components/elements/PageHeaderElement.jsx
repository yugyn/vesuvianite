// src/components/PageHeader.jsx
const PageHeaderElement = ({ title, name, subTitle, children }) => {

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      
      {subTitle ? (
        <h5>{title}</h5>
      ) : name ? (
        <>
          <div>
            <small>{title}</small>
            <h1>{name}</h1>
          </div>
        </>
      ) : (
        <h1>{title}</h1>
      )}

      <div className="d-flex gap-2">
        {children}
      </div>

    </div>

  );
};

export default PageHeaderElement;