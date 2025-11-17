import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import CListContainer from '../htmlComponent/CListContainer';
import ModalMessage from '../public/ModalMessage';
import { useApiCall, useDeleteApiCall } from '../../utils/apiCalls';
import { serverUrl } from '../../utils/utils';

const Users = () => {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [users, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { apiData, apiError, apiLoading } = useApiCall('/users', 'GET', null, true);    
    const { apiSuccess, apiError: deleteError, apiLoading: deleteLoading, deleteData } = useDeleteApiCall();
    
    useEffect(() => {
        if (apiData && apiData.users) {
            if (apiData.success && apiData.users.length > 0) {    
                setData(apiData.users);
            } 
        }
        if (apiError) {
            setError(apiData.message || 'Veriler yüklenirken bir hata oluştu');
        }
        setLoading(apiLoading);
    }, [apiData, apiError, apiLoading]);
    

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredData = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    //#region "state management for delete operation"
    // ...existing state...
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleDelete = async (itemId) => {
        const success = await deleteData(`/users/${itemId}`);
        if (success) {
            setData(users =>
            users.map(user =>
                user._id === itemId ? { ...user, isActivated: false } : user
            ));
            
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
            field: 'avatar',
            headerName: 'Avatar',
            width: 120,
            renderCell: (params) => (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={params.row.avatar ? `${serverUrl}${params.row.avatar}` : `${serverUrl}/uploads/avatars/default.jpg`}
                        alt={params.row.fullName}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                        onError={(e) => {
                            console.error('Avatar yükleme hatası:', e);
                            e.target.src = `${serverUrl}/uploads/avatars/default.jpg`;
                        }}
                    />
                </div>
            )
        },
        {
            field: 'fullName',
            headerName: 'Ad Soyad',
            flex: 1,
            minWidth: 150
        },
        {
            field: 'email',
            headerName: 'E-posta',
            flex: 1,
            minWidth: 200
        },
        {
            field: 'role',
            headerName: 'Yetki',
            width: 120,
            valueGetter: (params) => params.row.role || 'user'
        },
        {
            field: 'isActivated',
            headerName: 'Durumu',
            width: 120,
            // valueGetter: (params) => params.row.isActivated ?  'Aktif' : 'Pasif',
            renderCell: (params) => (   
                <span style={{ color: params.row.isActivated ? 'green' : 'red' }}>
                    {params.row.isActivated ? 'Aktif' : 'Pasif'}
                </span>
            )
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
                            navigate(`/users/edit/${params.row._id}`);
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
                   { params.row.isActivated && 
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
                }
                </div>
            )
        }
    ];

    if (!currentUser || currentUser.role !== 'admin') {
        return <div>Bu sayfaya erişim yetkiniz yok.</div>;
    }
    if (loading) {
        return <div className="loading">Yükleniyor...</div>;
    }

    return (
        <>
            <CListContainer pageName={'users'}  
                error={error} 
                searchTerm={searchTerm} 
                handleSearch={handleSearch} 
                url={'/users/new'} 
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

export default Users;
