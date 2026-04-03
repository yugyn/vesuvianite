// src/components/PageHeader.jsx
const PageHeaderElement = ({ title, subTitle, children }) => {

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      
      {subTitle ? (
        <h5>{title}</h5>
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