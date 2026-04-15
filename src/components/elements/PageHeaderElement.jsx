import { useTranslation } from 'react-i18next';

const PageHeaderElement = ({ 
  title, 
  name, 
  subTitle, 
  children, 
  deleted 
}) => {

  const { t } = useTranslation();

  return (
    <div className="d-flex justify-content-between align-items-center mb-2">
      
      {subTitle ? (
        <h5>{title}</h5>
      ) : name ? (
        <>
          <div>
            {deleted ? (
              <span className="badge text-bg-danger">{title}{t('global.deleted.header')}</span>
            ) : (
              <small>{title}</small>
            )}
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