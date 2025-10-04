import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CListContainer from '../htmlComponent/CListContainer';
import { useApiCall, useDeleteApiCall } from '../../utils/apiCalls';
import ModalMessage from '../public/ModalMessage';
import '../../css/Products.css';
import { serverUrl, substringValue } from '../../utils/utils';

const Projects = () => {
    const navigate = useNavigate();
    const [projects, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');    
    
    const { apiData, apiError, apiLoading } = useApiCall('/projects', 'GET', null, true);
    const { apiSuccess, apiError: deleteError, apiLoading: deleteLoading, deleteData } = useDeleteApiCall();

    useEffect(() => {
        if (apiData && apiData.success) {
            if (apiData.projects && apiData.projects.length > 0) {    
                setData(apiData.projects);
            } 
        }
        if (apiError) {
            setError(apiError.message || 'Veriler yüklenirken bir hata oluştu');
        }
        setLoading(apiLoading);
    }, [apiData, apiError, apiLoading]);
    
    //#region "state management for delete operation"
    // ...existing state...
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = async (itemId) => {
        const success = await deleteData(`/projects/${itemId}`);
        if (success) {
            setData(projects.filter(p => p._id !== itemId));
            
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

    const filteredData = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        {
            field: 'imageUrls',
            headerName: 'Görsel',
            width: 100,
            renderCell: (params) => (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    
                    {params.value && params.value.length > 0 ? (
                                    <img
                                        src={`${serverUrl}${params.value[0]}`}
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
            field: 'typeofActivityId.name',
            headerName: 'Faaliyet Türü',
            width: 250,
            valueGetter: (params) => params.row.typeofActivityId?.name || 'Belirtilmemiş'
        },      
        {
            field: 'statusType',
            headerName: 'Durumu',
            width: 150,
            valueFormatter: (params) => {
                return params.value === 'true' ? 'Aktif' : 'Pasif';
            }
        },
        {
            field: 'startDate',
            headerName: 'Başlama Tarihi',
            width: 126,
            type: 'datetime',
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                });
            }
        },
        {
            field: 'projectCost',
            headerName: 'Maliyet',
            width: 150,
            valueFormatter: (params) => {
                return new Intl.NumberFormat('tr-TR', {
                    style: 'currency',
                    currency: 'TRY'
                }).format(params.value);
            }
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
                            // navigate('/projectdetail', { state: {projectData: params.row }});
                            navigate(`/projects/edit/${params.row._id}`);

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
    {loading && (
        <div className="loading-spinner">
            <div className="spinner"></div>
        </div>
    )}
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    return (
        <>
        <CListContainer pageName={'projects'}
            error={error} 
            searchTerm={searchTerm} 
            handleSearch={handleSearch} 
            url={'/projects/new'} 
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

export default Projects;
