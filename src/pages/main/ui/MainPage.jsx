import React, { useEffect, useState } from 'react';
import { Collection } from '../../../entities/collection';
import { CategoryFilter, SearchFilter } from '../../../features/filter-collections';
import { Pagination } from '../../../shared/ui';
import { fetchCollections } from '../../../shared/api';
import './MainPage.css';

/**
 * Скелетон-плейсхолдер для загружаемой коллекции
 */
const CollectionSkeleton = () => (
    <div className="skeleton-tile" aria-hidden="true">
        <div className="skeleton-hero skeleton-shimmer" />
        <div className="skeleton-footer">
            <div className="skeleton-line skeleton-shimmer" style={{ width: '60%' }} />
            <div className="skeleton-line skeleton-shimmer" style={{ width: '35%' }} />
        </div>
    </div>
);

/**
 * Главная страница приложения
 */
export const MainPage = () => {
    const [categoriesActive, setCategoriesActive] = useState(0);
    const [searchValue, setSearchValue] = useState('');
    const [collections, setCollections] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchCollections(categoriesActive, page).then((data) => {
            if (data) setCollections(data);
            setLoading(false);
        });
    }, [categoriesActive, page]);

    const handleCategoryChange = (idx) => {
        setCategoriesActive(idx);
        setPage(1);
    };

    const filtered = collections.filter(
        (c) => c.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <div className="app-container">
            {/* ── HEADER ── */}
            <header className="site-header">
                <div className="site-header__top">
                    <div className="site-header__rule" aria-hidden="true" />
                </div>
                <div className="site-header__body">
                    <h1 className="site-header__title">Gallera</h1>
                    <p className="site-header__subtitle">A Photography Archive</p>
                </div>
                <div className="site-header__bottom" aria-hidden="true" />
            </header>

            {/* ── CONTROLS ── */}
            <div className="controls">
                <CategoryFilter
                    activeCategory={categoriesActive}
                    onCategoryChange={handleCategoryChange}
                />
                <SearchFilter
                    value={searchValue}
                    onChange={setSearchValue}
                />
            </div>

            {/* ── GRID ── */}
            <main className="content" aria-live="polite" aria-busy={loading}>
                {loading ? (
                    <>
                        <CollectionSkeleton />
                        <CollectionSkeleton />
                        <CollectionSkeleton />
                    </>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48" aria-hidden="true">
                            <rect x="4" y="10" width="40" height="30" rx="3" strokeOpacity="0.4"/>
                            <circle cx="16" cy="20" r="4" strokeOpacity="0.4"/>
                            <path d="M4 34l10-9 8 7 6-5 16 13" strokeOpacity="0.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <p className="empty-state__text">Коллекций не найдено</p>
                        <span className="empty-state__hint">Попробуйте изменить запрос или категорию</span>
                    </div>
                ) : (
                    filtered.map((collection, i) => (
                        <Collection
                            key={`${collection.name}-${i}`}
                            name={collection.name}
                            images={collection.photos}
                            index={i}
                        />
                    ))
                )}
            </main>

            {/* ── PAGINATION ── */}
            <Pagination
                currentPage={page}
                totalPages={5}
                onPageChange={setPage}
            />
        </div>
    );
};
