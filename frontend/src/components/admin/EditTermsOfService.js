import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../public/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import '../../css/EditUser.css';
import { apiUrl } from '../../utils/utils';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { editorModules, editorFormats } from '../../utils/utils';
 

const EditTermsOfService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await fetch(`${apiUrl}/termsOfServices/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setFormData({
                    title: data.termsOfService.title,
                    content: data.termsOfService.content
                });
                 
            } else {
                setError(data.message || 'TermsOfService bilgileri yüklenemedi');
            }
        } catch (error) {
            console.error('TermsOfService bilgileri getirme hatası:', error);
            setError('Sunucu bağlantısı başarısız');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
 
 
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const formDataToSend = new FormData();
            if (id) {
                formDataToSend.append('id', id);
            } 
            formDataToSend.append('title', formData.title);
            formDataToSend.append('content', formData.content);

            const url = id
                ? `${apiUrl}/termsOfServices/${id}`
                : `${apiUrl}/termsOfServices`;
            
            const response = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: formData.title,
                    content: formData.content
                })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/termsofservices');
            } else {
                setError(data.message || 'TermsOfService kaydedilirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Form gönderme hatası:', error);
            setError('Sunucu bağlantısı başarısız');
        } finally {
            setLoading(false);
        }
    };
    

    if (!currentUser || currentUser.role !== 'admin') {
        return <div>Bu sayfaya erişim yetkiniz yok.</div>;
    }
    
    return (
        <div className="home-container">
            <div className="main-content">
                <Breadcrumbs breadcrumbs={null} />
                <form id="termsOfServiceForm" onSubmit={handleSubmit} className="edit-user-form">
                    <div className="page-header">
                        {/* <h1 className='headerClass'>{id ? 'Kategori Düzenle' : 'Yeni Kategori'}</h1> */}
                        <div className="form-actions">
                            <button 
                                type="submit"
                                form="termsOfServiceForm"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Kaydediliyor...' : (id ? 'Güncelle' : 'Kaydet')}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/termsofservices')}
                                className="cancel-button"
                            >
                                İptal
                            </button>
                        </div>
                    </div>                
                    <hr></hr>
                    <br></br>
                    {error && <div className="error-message">{error}</div>}
                 
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            className='varible-input'
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="content">Content</label>
                        <ReactQuill
                            theme="snow"                            
                            style={{minHeight:'300px'}}
                            value={formData.content}
                            onChange={value => setFormData((prev) => ({ ...prev, content: value }))}   
                            placeholder="Açıklama giriniz..."
                            modules={editorModules()}
                            formats={editorFormats()}
                        /> 
                    </div> 
                </form>
            </div>
            
        </div>
    );
};

export default EditTermsOfService;
