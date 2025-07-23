import React, { useState, useEffect, useRef } from 'react';
import { serverUrl } from '../../utils/utils';

const ProjectSlider = ({ projects, navigate }) => {
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef();

    // Sadece resmi olan projeler
    const slides = projects
        .filter(p => p.imageUrls && p.imageUrls.length > 0)
        .map(p => ({
            id: p.id,
            name: p.name,
            imageUrl: p.imageUrls[0].startsWith('http') ? p.imageUrls[0] : `${serverUrl}${p.imageUrls[0]}`,
            project: p
        }));

    useEffect(() => {
        if (slides.length < 2) return;
        intervalRef.current = setInterval(() => {
            setCurrent(prev => (prev + 1) % slides.length);
        }, 3500);
        return () => clearInterval(intervalRef.current);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const goToPrev = () => setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    const goToNext = () => setCurrent(prev => (prev + 1) % slides.length);

    return (
        <div className="project-slider-container" style={{ position: 'relative', margin: '0 auto auto auto'}}>
            <button
                className="slider-arrow left"
                onClick={goToPrev}
                style={{
                    position: 'absolute', left: 40, top: '50%', transform: 'translateY(-50%)',
                    zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer'
                }}
            >
                &#8592;
            </button>
            <div className="project-slider" style={{ width: '98vw', height: '60vw', maxHeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div
                    style={{
                        position: 'relative',
                        width: '100%',
                        height: '60vw', // veya height: '70vh', ihtiyaca göre
                        maxHeight: 700,
                        margin: '0 auto',
                        boxShadow: '0 2px 12px #0002',
                        borderRadius: 0,
                        overflow: 'hidden',
                        background: '#fff'
                    }}
                >
                    <img
                        src={slides[current].imageUrl}
                        alt={slides[current].name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover', // DİKKAT: 'cover' olmalı
                            background: '#fff'
                        }}
                    />
                    
                    <div className="project-details">
                        {slides[current].name} 
                    </div>
                    <button className="project-detail-button" 
                        onClick={() => navigate('/project-detail', { state: { projectData: slides[current].project } })}>
                        Proje Detayları
                    </button>
                </div>
            </div>
            <button
                className="slider-arrow right"
                onClick={goToNext}
                style={{
                    position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)',
                    zIndex: 2, background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer'
                }}
            >
                &#8594;
            </button>
        </div>
    );
};

export default ProjectSlider;