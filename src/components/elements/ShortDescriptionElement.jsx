import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from 'react';
import { useParams } from "react-router-dom";
import DetailsElement from '../elements/DetailsElement';
import { AppIcons } from '../../utils/iconUtils';
import PageHeader from '../elements/PageHeaderElement';
import MediaList from '../lists/MediaList';

const ShortDescriptionElement = ({element}) => {

    const { t } = useTranslation();

    return (
        <>

            <div>
                <small>
                    <b>
                        {t('global.shortDescription')}
                    </b>
                </small>
                <div className="row mt-2">
                    <div className='col'>
                        <div style={{whiteSpace: 'pre-wrap', minHeight: '100px', maxHeight: '200px', overflowY: 'auto'}}>
                            {element.short_description}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );

};


export default ShortDescriptionElement;