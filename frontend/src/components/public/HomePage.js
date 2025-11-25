import React, { useState, useEffect } from 'react';
import { Helmet} from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import CHelmet from '../htmlComponent/CHelmet';
import { useApiCall } from '../../utils/apiCalls';
import {serverUrl, substringValue} from '../../utils/utils';
import ProjectSlider from '../htmlComponent/ProjectSlider';

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [data, setData] = useState([]);
    
    const { apiData, apiError, apiLoading } = useApiCall('/projects/projectList', 'GET', null, false);   
    useEffect(() => {
        if (apiData) { 
            if (apiData.success) {
                setData(apiData.projects);                
            } else {
                setError('Projeler yüklenirken bir hata oluştu');
            }
        }
        if (apiError) {
            console.error('Projeler yüklenirken hata:', apiError);
            setError('Sunucu bağlantısı başarısız');
        }
        setLoading(apiLoading);
    }, [apiData, apiError, apiLoading]);
     
    return (
        <>
            <CHelmet pageName="Projelerimiz" projectName="İnşaat projeleri, doğalgaz" categoryName="boru hattı" />
            <div className="home-container" >
                <div className="main-content" style={{paddingTop:'0'}}>
                    <ProjectSlider projects={data} navigate={navigate} />
                    <br/>
                    <br/>
                    <div className='box-header'>
                        <h3 style={{fontSize:48}}>Projeler</h3>
                    </div>
                    <div className="box-grid">
                        {data                
                            .map(p => (
                                <div key={p.id} className="box-card">
                                    <div className="box-card-image">
                                        {p.imageUrls && p.imageUrls.length > 0 ? (
                                            <img loading="lazy" alt={p.name} src={`${serverUrl}${p.imageUrls[0]}`} />
                                        ) : (
                                            <img loading="lazy" alt={p.name} src={`${serverUrl}/uploads/projects/default.png`} />
                                        )}
                                    </div>
                                    <div className="box-cart-content" onClick={() => navigate('/project-detail', { state: {projectData: p }})}>
                                        <div className="title">
                                            {substringValue(p.name, 100)}
                                            <br />
                                        </div>
                                        <div className='status'>
                                            {p.statusType === 'true' ? <span className="ongoing">Proje Devam Ediyor</span> : <span className="completed">Proje Tamamlandı</span>}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div> 
            </div>
        </>
    );
};

export default HomePage;
