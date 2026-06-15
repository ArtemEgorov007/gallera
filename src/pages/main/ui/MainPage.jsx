import React, { useEffect, useState } from 'react';
import { Collection } from '../../../entities/collection';
import { CategoryFilter, SearchFilter } from '../../../features/filter-collections';
import { Pagination } from '../../../shared/ui';
import { fetchCollections } from '../../../shared/api';
import './MainPage.css';

/**
 * Главная страница приложения
 */
export const MainPage = () => {
    const [categoriesActive, setCategoriesActive] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [collections, setCollections] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchCollections(categoriesActive, page).then((collections) => {
            if (collections) setCollections(collections);
        });
    }, [categoriesActive, page]);

    return (
        <div className="app-container">
            <h1>Gallera</h1>
            <p className="app-subtitle">Моя коллекция фотографий</p>
            <div className="top">
                <CategoryFilter 
                    activeCategory={categoriesActive} 
                    onCategoryChange={setCategoriesActive} 
                />
                <SearchFilter 
                    value={searchValue} 
                    onChange={setSearchValue} 
                />
            </div>

            <div className="content">
                {collections
                    .filter(collection => collection.name.toLowerCase().includes(searchValue.toLowerCase()))
                    .map((collection, index) => (
                        <Collection
                            key={index}
                            name={collection.name}
                            images={collection.photos}
                        />
                    ))}
            </div>

            <Pagination 
                currentPage={page} 
                totalPages={5} 
                onPageChange={setPage} 
            />
        </div>
    );
};
