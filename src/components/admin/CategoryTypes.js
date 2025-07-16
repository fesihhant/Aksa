import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CListContainer from '../htmlComponent/CListContainer';
import ModalMessage from '../public/ModalMessage';
import { useApiCall, useDeleteApiCall } from '../../utils/apiCalls';

const CategoryTypes = () => {
    const navigate = useNavigate();
    const [categoryTypes, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { apiData, apiError, apiLoading } = useApiCall('/categoryTypes', 'GET', null, true);
    const { apiSuccess, apiError: deleteError, apiLoading: deleteLoading, deleteData } = useDeleteApiCall();
    
    useEffect(() => {
        if (apiData && apiData.categoryTypes) {
            if (apiData.success && apiData.categoryTypes.length > 0) {    
                setData(apiData.categoryTypes);
            } 
        }
        if (apiError) {
            setError(apiData.message || 'Kategoriler yüklenirken bir hata oluştu');
        }
        setLoading(apiLoading);
    }, [apiData, apiError, apiLoading]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = categoryTypes.filter(categori =>
        categori.name.toLowerCase().includes(searchTerm.toLowerCase()) 
    );

    //#region "state management for delete operation"
    // ...existing state...
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = async (itemId) => {
        const success = await deleteData(`/categoryTypes/${itemId}`);
        if (success) {
            setData(categoryTypes.filter(cat => cat._id !== itemId));
            
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

        
    const columns = [        
        {
            field: 'name',
            headerName: 'Kategori Türü',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'createdAt',
            headerName: 'Kayıt Tarihi',
            width: 150,
            valueFormatter: (params) => new Date(params.value).toLocaleDateString('tr-TR')
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
                            navigate(`/categoryTypes/edit/${params.row._id}`);
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
                    <button
                        onClick={async (e) => {
                            e.stopPropagation();                            
                            setDeleteId(params.row._id);
                            setModalOpen(true);
                        }}
                        style={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Sil
                    </button>
                </div>
            )
        }
    ];    
    
    return (
        <>
        <CListContainer pageName={'categoryTypes'} 
            error={error} 
            searchTerm={searchTerm} 
            handleSearch={handleSearch} 
            url={'/categoryTypes/new'} 
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

export default CategoryTypes;
