import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CListContainer from '../htmlComponent/CListContainer';
import { apiUrl } from '../../utils/utils';
import '../../css/Products.css';

const SocialMediaList = () => {
   const navigate = useNavigate();
      const [dataList, setData] = useState([]);
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState('');
      const [searchTerm, setSearchTerm] = useState('');
  
      useEffect(() => {
          
          const fetchData = async () => {
              try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                      navigate('/login'); // Kullanıcıyı giriş sayfasına yönlendir
                      return;
                  }
                  let url = `${apiUrl}/social-media`;
                  const response = await fetch(url, {
                      method: 'GET',
                      headers: {
                          'Authorization': `Bearer ${token}`, // Token'ı header'a ekle
                          'Content-Type': 'application/json'
                      }
                  });
                  const data = await response.json();
                  
                  if (data.success) {
                      setData(data.accounts);
                  } else {
                      setError('Veriler yüklenirken bir hata oluştu');
                  }
              } catch (error) {
                  console.error('Veriler yüklenirken hata:', error);
                  setError('Sunucu bağlantısı başarısız');
              } finally {
                  setLoading(false);
              }
          };
  
          fetchData();
      }, []);
  
  
      const handleSearch = (e) => {
          setSearchTerm(e.target.value);
      };
  
      const filteredData = dataList.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
      const columns = [
          {
              field: 'name',
              headerName: 'Proje Adı',
              flex: 1,
              minWidth: 150,
              renderCell: (params) => (
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                      {params.value}
                  </div>
              )
          },
          {
            field:'mediaLink',
            headerName:'Bağlantı adresi',
            minWidth:350,
            renderCell:(params) =>{                
                   return(
                     <a style={{ fontWeight: 'bold', color: '#333' }}
                        href={params.value}
                        target="_blank"
                        rel="noopener noreferrer">{params.value}
                    </a>
                   )
            }
          },
          {
              field: 'active',
              headerName: 'Durumu',
              width: 150,
              valueFormatter: (params) => {
                  return params.value === true ? 'Aktif' : 'Pasif';
              }
          },
          {
              field: 'actions',
              headerName: 'İşlemler',
              width: 120,
              renderCell: (params) => (
                  <button
                      onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/social-media/edit/${params.id}`);
                      }}
                      style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '5px 10px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                      }}
                  >
                      Düzenle
                  </button>
              )
          }
      ];

    return (
        
        <CListContainer pageName={'socialmediaList'} 
            error={error} 
            searchTerm={searchTerm} 
            handleSearch={handleSearch} 
            url={'/social-media/new'} 
            filteredData={filteredData} 
            columns={columns} 
            loading={loading} 
            pageSize={10}
        />  
  );
};

export default SocialMediaList;