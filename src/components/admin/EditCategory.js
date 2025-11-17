import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Breadcrumbs from '../public/Breadcrumbs';
import { useAuth } from '../../context/AuthContext';
import '../../css/EditUser.css';
import { apiUrl } from '../../utils/utils';
 

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        categoryTypeId: 0
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
            const response = await fetch(`${apiUrl}/categories/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success) {
                setFormData({
                    name: data.category.name,
                    categoryTypeId: data.category.categoryTypeId
                });
                 
            } else {
                setError(data.message || 'Kategori bilgileri yüklenemedi');
            }
        } catch (error) {
            console.error('Kategori bilgileri getirme hatası:', error);
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
            formDataToSend.append('name', formData.name);
            formDataToSend.append('categoryTypeId', formData.categoryTypeId);

            const url = id
                ? `${apiUrl}/categories/${id}`
                : `${apiUrl}/categories`;
            
            const response = await fetch(url, {
                method: id ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id? id : undefined,
                    name: formData.name,
                    categoryTypeId: Number(formData.categoryTypeId)
                })
            });

            const data = await response.json();

            if (data.success) {
                navigate('/categories');
                // window.location.reload();
            } else {
                setError(data.message || 'Kategori kaydedilirken bir hata oluştu');
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
    
    const pathnames = [
        {
          path: 'Kategoriler',
          link: '/categories',
        },
        {
          path: (id ? 'Kategori Düzenle' : 'Yeni Kategori'),
          link: '',
        }
    ];
    return (
        <div className="home-container">
            <div className="main-content">
                <Breadcrumbs breadcrumbs={pathnames} />
                <form id="categoryForm" onSubmit={handleSubmit} className="edit-user-form">
                    <div className="page-header">
                        {/* <h1 className='headerClass'>{id ? 'Kategori Düzenle' : 'Yeni Kategori'}</h1> */}
                        <div className="form-actions">
                            <button 
                                type="submit"
                                form="categoryForm"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Kaydediliyor...' : (id ? 'Güncelle' : 'Kaydet')}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/categories')}
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
                        <label htmlFor="name">Kategori Adı</label>
                        <input
                            className='varible-input'
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="categoryTypeId">Kategori Türü</label>
                        <select
                            id="categoryTypeId"
                            name="categoryTypeId"
                            value={formData.categoryTypeId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Seçiniz</option>
                            <option value={1}>Projeler</option>
                            <option value={2}>Kullanıcılar</option>
                            <option value={3}>Etkinlikler</option>
                            <option value={4}>Mesafe </option>
                        </select>
                    </div>
                </form>
            </div>
            
        </div>
    );
};

export default EditCategory;
