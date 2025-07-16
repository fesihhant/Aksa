import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';

import {substringValue, apiUrl} from '../../utils/utils';


const OurActivities = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [projects, setProjects] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [statusType, setStatusType] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('categoryId');

    useEffect(() => {
        
        const fetchCategoryName = async () => {
            try {   
                const response = await fetch(`${apiUrl}/categories/getCategoryNameById?categoryId=${categoryId}`);
                const data = await response.json();

                if (data.success) {
                    const categoryName = data.category.name;
                    setCategoryName(categoryName);
                } else {
                    setCategoryName('');
                    console.error('Kategori adı alınamadı:', data.message);
                }
            } catch (error) {   
                setCategoryName('');
                console.error('Kategori adı alınırken hata:', error);
            }
        };

        const fetchProjects = async () => {
            try {                
                const response = await fetch(`${apiUrl}/projects/projectList`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
    
                if (data.success) {
                    const filteredProjects = data.projects.filter(x => x.typeofActivityId?._id == categoryId);
                    if (filteredProjects.length > 0) {
                        setProjects(filteredProjects);
                    } else {
                        setProjects([]);
                        console.error('Bu kategoriye ait proje bulunamadı'); 
                    }
                } else {
                    console.error('Projeler alınamadı:', data.message);
                }
            } catch (error) {
                console.error('Projeler alınırken hata:', error);
            }
        };

        if (categoryId) {
            fetchCategoryName();
            fetchProjects();
        }
    }, [categoryId]);

    
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }; 

    const pathnames = [
    {
        path: 'Faaliyetlerimiz' + (categoryName ? ' - ' + categoryName : ''),
        link: '',
    }];
    
    return (
        <div className="home-container">
            <div className="main-content">
                <Breadcrumbs breadcrumbs={pathnames} />
                <div className="page-header">
                    {/* <h1 className='headerClass'><i class="fas fa-project-diagram"></i> Faaliyetlerimiz</h1> */}
                    <div className="header-actions"> 
                        <div className="search-box">
                            <select
                                name="statusType"
                                onChange={e => setStatusType(e.target.value)}
                            >
                                <option select value="">Tümü</option>
                                <option value="true">Devam Eden</option>
                                <option value="false">Biten</option>
                            </select>
                            <input
                                type="text"
                                placeholder="Ara..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="search-input"
                            />
                        </div>
                    </div>
                </div>
                <hr></hr>
                <br></br>
                <div className="projects-grid">
                    {projects.length === 0 && (
                        <div className="no-projects-message"> 
                            {categoryName ? `${categoryName} kategorisine ait proje bulunamadı.` : 'Proje bulunamadı.'  }
                        </div>
                    )}
                    {projects
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
                    ))}
                </div>
            </div> 
        </div>
    );
};

export default OurActivities;