import React from 'react';
import PropTypes from 'prop-types';

/**
 * Компонент поиска по названию коллекции
 * @param {Object} props - Свойства компонента
 * @param {string} props.value - Значение поиска
 * @param {Function} props.onChange - Обработчик изменения значения
 */
export const SearchFilter = ({ value, onChange }) => {
    return (
        <div className="search-wrapper">
            <svg
                className="search-icon"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                width="15"
                height="15"
                aria-hidden="true"
            >
                <circle cx="8.5" cy="8.5" r="5.5" />
                <path d="M13 13l3.5 3.5" strokeLinecap="round" />
            </svg>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="search-input"
                placeholder="Поиск коллекции"
                type="search"
                aria-label="Поиск по названию коллекции"
            />
        </div>
    );
};

SearchFilter.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
};
