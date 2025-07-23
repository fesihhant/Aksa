import React, { useState, useEffect } from 'react';
import { Helmet} from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import CHelmet from '../htmlComponent/CHelmet';
import CCarousel from '../htmlComponent/CCarousel';
import { useApiCall } from '../../utils/apiCalls';
import {serverUrl, substringValue} from '../../utils/utils';
import ProjectSlider from '../htmlComponent/ProjectSlider';

const HomePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusType, setStatusType] = useState('');
    const [data, setData] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    
    const { apiData, apiError, apiLoading } = useApiCall('/projects/projectList', 'GET', null, false);   
    useEffect(() => {
        if (apiData) { 
            if (apiData.success) {
                setData(apiData.projects);

                let imageData = [];
                apiData.projects.map(p => {
                    if (p.imageUrls && p.imageUrls.length > 0) {
                        p.imageUrls.map(url => {
                            let data = {title: p.title,
                                url : `${serverUrl}${url}`
                            };
                            imageData.push(data);
                        });
                    }
                })
                setImagePreviews(imageData);
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
    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }; 
    const pathnames = [
    {
        path: 'Projeler',
        link: '',
    }];

    return (
        <>
            <CHelmet pageName="Projelerimiz" projectName="İnşaat projeleri, doğalgaz" categoryName="boru hattı" />
            <div className="home-container" >
                <div className="main-content" style={{paddingTop:'0'}}>
                    <ProjectSlider projects={data} navigate={navigate} />
                    <br/>
                    <div className="projects-grid">
                        
                        {data
                            .filter(x =>
                                (x.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                x.description.toLowerCase().includes(searchTerm.toLowerCase()))
                                &&
                                (statusType === '' || x.statusType === statusType)
                            )                    
                            .map(p => (
                                <div key={p.id} className="project-card">
                                    <div className="project-image">
                                        {p.imageUrls && p.imageUrls.length > 0 ? (
                                            <img loading="lazy" alt={p.name} src={`http://localhost:5001${p.imageUrls[0]}`} />
                                        ) : (
                                            <img loading="lazy" alt={p.name} src={`http://localhost:5001/uploads/projects/default.png`} />
                                        )}
                                    </div>
                                    <div className="project-content">
                                        <h3>{substringValue(p.name,150)}</h3>
                                        {p.isVisibleCost && <p className="project-cost">{p.projectCost}</p>}
                                        <p>{substringValue(p.description,150)}</p>
                                        <button 
                                            className="project-details-btn"
                                            onClick={() => navigate('/project-detail', { state: {projectData: p }})}
                                        >
                                            Detayları Gör
                                        </button>
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
