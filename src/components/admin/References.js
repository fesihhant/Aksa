import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CListContainer from '../htmlComponent/CListContainer';
import { useDeleteApiCall } from '../../utils/apiCalls';
import '../../css/Products.css';
import { apiUrl, serverUrl } from '../../utils/utils';
import ModalMessage from '../public/ModalMessage';

const References = () => {
    const navigate = useNavigate();
    const [references, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { apiSuccess, apiError: deleteError, apiLoading: deleteLoading, deleteData } = useDeleteApiCall();
    
    useEffect(() => {
        const fetchReferences = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login'); // Kullanıcıyı giriş sayfasına yönlendir
                    return;
                }
                const response = await fetch(`${apiUrl}/references`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();

                if (data.success) {
                    setData(data.references);
                } else {
                    setError('Referanslar yüklenirken bir hata oluştu');
                }
            } catch (error) {
                console.error('Referanslar yüklenirken hata:', error);
                setError('Sunucu bağlantısı başarısız');
            } finally {
                setLoading(false);
            }
        };

        fetchReferences();
    }, []);

    //#region "state management for delete operation"
    // ...existing state...
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = async (itemId) => {
        const success = await deleteData(`/references/${itemId}`);
        if (success) {
            setData(references.filter(p => p._id !== itemId));
            
        } else if (deleteError) {
            setError(deleteError);
        }
        setLoading(deleteLoading);
    };

    // Modal onaylandığında silme işlemi
    const handleModalConfirm = async () => {
        setModalOpen(false);
        if (deleteId) {
            await handleDelete(deleteId);
            setDeleteId(null);
        }
    };

    // Modal iptal edildiğinde
    const handleModalCancel = () => {
        setModalOpen(false);
        setDeleteId(null);
    };
    //#endregion

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = references.filter(reference =>
        reference.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reference.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            field: 'imageUrl',
            headerName: 'Görsel',
            width: 100,
            renderCell: (params) => (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {params.value ? (
                        <img
                            src={`${serverUrl}${params.value}`}
                            alt={params.row.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                    ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#f5f5f5', borderRadius: '4px' }} />
                    )}
                </div>
            )
        },
        {
            field: 'name',
            headerName: 'Referans Adı',
            flex: 1,
            minWidth: 200
        }, 
        {
            field: 'description',
            headerName: 'Açıklama',
            flex: 1,
            minWidth: 200
        },
        {
            field: 'actions',
            headerName: 'İşlemler',
            width: 150,
            renderCell: (params) => (
            
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // navigate(`/reference/edit/${params.row._id}`);
                            navigate('/referencedetail', { state: {referenceData: params.row }});
                        }}
                        className='submit-button'
                    >
                        Düzenle
                    </button>
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();
                            setDeleteId(params.row._id);
                            setModalOpen(true);
                        }}
                        className='cancel-button'
                    >
                        Sil
                    </button>
                </div>
            )
        }
    ];

    return (
        <>
        <CListContainer pageName={'references'} 
            error={error} 
            searchTerm={searchTerm} 
            handleSearch={handleSearch} 
            url={'/reference/new'} 
            filteredData={filteredData} 
            columns={columns} 
            loading={loading} 
            pageSize={10}
        /> 
        
        <ModalMessage
            open={modalOpen}
            type="warning"
            message="Bu kaydı silmek istediğinize emin misiniz?"
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
        />  
        </>
    );
};

export default References;
