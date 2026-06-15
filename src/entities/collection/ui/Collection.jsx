import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import './Collection.css';

/**
 * Lightbox компонент для полноэкранного просмотра фото
 */
const Lightbox = ({ src, alt, onClose }) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [handleKeyDown]);

    return (
        <div
            className="lightbox-backdrop"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={`Просмотр: ${alt}`}
        >
            <button
                className="lightbox-close"
                onClick={onClose}
                aria-label="Закрыть"
                tabIndex={0}
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/>
                </svg>
            </button>
            <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
                <img
                    src={src}
                    alt={alt}
                    className="lightbox-image"
                    loading="eager"
                />
                <p className="lightbox-caption">{alt}</p>
            </div>
        </div>
    );
};

Lightbox.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

/**
 * Компонент коллекции фотографий
 * @param {Object} props - Свойства компонента
 * @param {string} props.name - Название коллекции
 * @param {Array<string>} props.images - Массив URL изображений
 * @param {number} props.index - Порядковый номер (для editorial-нумерации)
 */
export const Collection = ({ name, images, index = 0 }) => {
    const [lightbox, setLightbox] = useState(null);
    const [thumbsVisible, setThumbsVisible] = useState(false);

    const serial = String(index + 1).padStart(2, '0');

    const openLightbox = (src) => {
        setLightbox(src);
    };

    const closeLightbox = () => {
        setLightbox(null);
    };

    return (
        <>
            <article
                className="collection"
                onMouseEnter={() => setThumbsVisible(true)}
                onMouseLeave={() => setThumbsVisible(false)}
            >
                {/* Serial number editorial badge */}
                <span className="collection__serial" aria-hidden="true">{serial}</span>

                {/* Main hero photo */}
                <div className="collection__hero" onClick={() => openLightbox(images[0])}>
                    <img
                        src={images[0]}
                        alt={name}
                        className="collection__hero-img"
                        loading="lazy"
                    />
                    <div className="collection__overlay">
                        <div className="collection__overlay-content">
                            <h3 className="collection__name">{name}</h3>
                            <span className="collection__view-hint">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                                    <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Открыть
                            </span>
                        </div>
                    </div>
                </div>

                {/* Thumbnail filmstrip */}
                <div className={`collection__filmstrip ${thumbsVisible ? 'collection__filmstrip--visible' : ''}`}>
                    {[images[1], images[2], images[3]].map((src, i) => (
                        <div
                            key={i}
                            className="collection__thumb"
                            onClick={() => openLightbox(src)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${name} — фото ${i + 2}`}
                            onKeyDown={(e) => e.key === 'Enter' && openLightbox(src)}
                        >
                            <img
                                src={src}
                                alt={`${name} — фото ${i + 2}`}
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </article>

            {lightbox && (
                <Lightbox
                    src={lightbox}
                    alt={name}
                    onClose={closeLightbox}
                />
            )}
        </>
    );
};

Collection.propTypes = {
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    index: PropTypes.number,
};
