import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet} from 'react-helmet-async';

import Breadcrumbs from '../public/Breadcrumbs';
import CHelmet from '../htmlComponent/CHelmet';
import CCrousel from '../htmlComponent/CCrousel';
import '../../css/HomePage.css';
import '../../css/Projects.css';
import {serverUrl, getCurrencySymbol, getYoutubeEmbedUrl } from '../../utils/utils';

const ProjectDetail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const projectData = location.state?.projectData;
    
    const [formData, setFormData] = useState({
            name: '',
            category: '',
            description: '',
            price: '',
            stockQuantity: '',
            typeofActivityId: null,
            youtubeUrl : '',

        });
        const [imagePreviews, setImagePreviews] = useState([]);
    
    useEffect(() => {

        if (projectData) {
            setFormData({
                name: projectData.name || '',
                typeofActivityId:projectData.typeofActivityId || null,
                statusType: projectData.statusType || '',
                description: projectData.description || '',
                projectCost: projectData.projectCost ? projectData.projectCost.toString() : '',
                isVisibleCost: projectData.isVisibleCost || false,
                currencyType: projectData.currencyType || 'TRY', // Varsayılan olarak TRY
                startDate: projectData.startDate ? projectData.startDate.toString() : '',
                endDate: projectData.endDate ? projectData.endDate.toString() : '',
                imageUrls: projectData.imageUrls || '',
                youtubeUrl : projectData.youtubeUrl || ''
            });

            if (projectData.imageUrls && projectData.imageUrls.length > 0) {
                setImagePreviews(projectData.imageUrls.map(url => `${serverUrl}${url}`)); // Resim önizlemelerini ayarlıyoruz
            }
        } else {
            setFormData({
                name: '',
                typeofActivityId: null,
                statusType: '',
                description: '',
                projectCost: '',
                startDate: '',
                endDate: '',
                imageUrls: [],
                youtubeUrl : ''
            });
            setImagePreviews([]);
        }
    }, [projectData]);
    
    
    const pageName = projectData?.name || 'Proje Detayları';
    const content = projectData
                        ? (projectData.description
                            ? projectData.description.substring(0, 160)
                            : "Proje detaylarını inceleyin.")
                        : "Proje detaylarını inceleyin.";

    const categoryName = projectData?.typeofActivityId?.name || '';  

    return (
        <>
            <CHelmet pageName={pageName} content={content} categoryName={categoryName} />
            <div className="home-container">
                <div className="main-content">
                    <Breadcrumbs />
                    <div className="page-header">
                    </div>                   
                    <hr></hr>
                    <br></br>
                    <div className="features-section">
                        <div>
                            <div className="row">
                                <div className="col-12"> 
                                    <div className="form-group">
                                        <label htmlFor="name">Proje Adı</label>
                                        <label className='justifyLabel' id="name" name="name"> {formData.name}</label>
                                    </div>
                                </div>
                            </div>
                            {formData.typeofActivityId && formData.typeofActivityId.name &&
                            <div className="row">
                                
                                <div className="col-12"> 
                                    <div className="form-group">
                                        <label htmlFor="name">Faaliyet Alanı</label>
                                        <label className='justifyLabel' id="name" name="name"> {formData.typeofActivityId?.name}</label>
                                    </div>
                                </div>
                            </div>}
                            <div className="row">
                                {formData.isVisibleCost && (
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="projectCost">Maliyeti</label>
                                        <label className='justifyLabel' id="projectCost"name="projectCost">{formData.projectCost} {getCurrencySymbol(formData.currencyType)}</label>
                                    </div>
                                </div>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-group">
                                        <label htmlFor="startDate">Başlama Tarihi</label>
                                        <label className='justifyLabel' id="startDate" name="startDate">{new Date(formData.startDate).toLocaleDateString()}</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    {formData.statusType == 'false' && formData.endDate && (
                                        <div className="form-group">
                                            <label htmlFor="endDate">Bitiş Tarihi</label>
                                            <label className='justifyLabel' id="endDate" name="endDate">{new Date(formData.endDate).toLocaleDateString()}</label>
                                        </div>
                                    )}                                 
                                </div>
                            </div>                          
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="description">Açıklama</label>
                                        <div id="description" name="description">
                                            <div dangerouslySetInnerHTML={{ __html: formData.description }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">                              
                                <div className="col-12">
                                    <div className="form-group">
                                        <div className="avatar-options">
                                            <div className="upload-section">    
                                                {imagePreviews && imagePreviews.length > 0 && (
                                                    <CCrousel imageList={imagePreviews} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                                                         
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group"> 
                                        <div className="avatar-options">
                                            {formData.youtubeUrl && formData.youtubeUrl.trim() !== '' && (
                                                <div className="video-container">
                                                    <iframe
                                                        width="100%"
                                                        height="800"
                                                        src={getYoutubeEmbedUrl(formData.youtubeUrl)}
                                                        title="Project Video" 
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>  
                        </div> 
                    </div>
                </div>
                
            </div>
        </>
    );
};

export default ProjectDetail;
