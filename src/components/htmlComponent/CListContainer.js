import React from 'react';
import Breadcrumbs from '../public/Breadcrumbs';

import CListPageHeader from '../htmlComponent/CListPageHeader';
import CDataGrid from '../htmlComponent/CDataGrid';
import { getPageTitleText } from '../../utils/utils';

// import '../../css/HomePage.css';
 
const CListContainer = ({pageName, error, searchTerm, handleSearch, url, filteredData, columns, loading,pageSize }) => {
    
    return (
        <div className="home-container">
            <div className="main-content">
                <Breadcrumbs />
                <div className="data-grid-container">
                    <CListPageHeader pageName={pageName} error={error} searchTerm={searchTerm} handleSearch={handleSearch} url={url} />
                    <CDataGrid filteredData={filteredData} columns={columns} loading={loading} pageSize={pageSize} />
                </div>
            </div>
        </div>
    );
};

export default CListContainer;