import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Breadcrumbs from '../public/Breadcrumbs';
import { Checkbox } from '@mui/material';
import { apiUrl } from '../../utils/utils';

const SocialMediaEdit = () => {
const { id } = useParams();
const navigate = useNavigate();
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
const [form, setForm] = useState({ name: '', mediaLink: '', active: true });

  useEffect(() => {
    if (id) {
      fetch(`${apiUrl}/social-media/${id}`)
        .then(res => res.json())
        .then(data => {
            setForm(data.account);
        });
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');
    if (!token) {
        navigate('/login');
        return;
    }
    try {
        
        const method = id ? 'PUT' : 'POST';
        const url = id ? `${apiUrl}/social-media/${id}` : `${apiUrl}/social-media`;
        const response = await fetch(url, {
            method,
            headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(form)
        });
        const data = await response.json();
    
        if (data.success) {
            navigate('/social-media'); // Ürünler sayfasına yönlendirme
        } else {
            setError(data.message || 'Bir hata oluştu');
        }
    } catch (error) {
        setLoading(false); 
        setError(error.message || 'Sunucu bağlantısı başarısız');
    } finally {
        setLoading(false);
    }
  };

  const pathnames = [
        {
          path: 'Sosyal Medya Hesapları',
          link: '/social-media',
        },
        {
          path: (id ? 'Düzenle' : 'Yeni Hesap Ekle'),
          link: '',
        }
    ];

  return (
        <div className="home-container">
            <div className="main-content">
                <Breadcrumbs breadcrumbs={pathnames} />
                <form id="dataForm" onSubmit={handleSubmit} className="edit-form">
                    <div className="page-header">
                        <div className="form-actions">
                            <button 
                                type="submit"
                                form="dataForm"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Kaydediliyor...' : (id ? 'Güncelle' : 'Kaydet')}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => navigate('/social-media')}
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
                        <label htmlFor="name">Sosyal Medya İsmi</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>     
                    <div className="form-group">
                        <label htmlFor="mediaLink">Bağlantı Adresi</label>
                        <input
                            type="text"
                            id="mediaLink"
                            name="mediaLink"
                            value={form.mediaLink}
                            onChange={handleChange}
                            required
                        />
                    </div>              
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="active">Aktif mi?</label>
                            <Checkbox style={{ height: '24px', maxWidth: '24px', color: 'cadetblue' }}
                                type="checkbox"                            
                                id="active"
                                name="active"
                                checked={form.active}
                                value={form.active}
                                onChange={handleChange}
                            />                     
                        </div>
                    </div> 
                </form>
            </div>
        </div>
  );
};

export default SocialMediaEdit;