import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import DetailsElement from '../elements/DetailsElement';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import ImageList from '../lists/ImageList';

const DescriptionElement = ({element}) => {

    const { t } = useTranslation();

    return (
        <>

            <div className="mb-5">
                <small>
                    <b>
                        {t('container.description')}
                    </b>
                </small>
                <div className="row mt-2">
                    <div className='col'>
                        <div style={{whiteSpace: 'pre-wrap'}}>
                            {element.description}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

};


export default DescriptionElement;