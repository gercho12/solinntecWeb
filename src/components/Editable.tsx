
import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';

interface EditableProps {
    path: string; // e.g., "hero.title"
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
    className?: string;
    children?: React.ReactNode; // Original content as fallback/initial render
    multiline?: boolean;
}

export const Editable: React.FC<EditableProps> = ({ path, as: Tag = 'span', className = '', children, multiline = false }) => {
    const { content, isEditing, updateContent } = useContent();

    // Helper to get value from path string
    const getValue = (obj: any, path: string) => {
        return path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);
    };

    const value = getValue(content, path);
    // If value is not found in content (e.g. array item not handled yet), fallback to children or empty string
    const displayValue = value !== undefined ? value : children;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateContent(path, e.target.value);
    };

    if (isEditing) {
        const inputClass = `w-full bg-yellow-50/50 border-2 border-dashed border-yellow-400/50 rounded px-1 transition-all focus:outline-none focus:border-yellow-500 focus:bg-white text-slate-900 font-inherit ${className}`;

        if (multiline) {
            return (
                <textarea
                    value={String(displayValue || '')}
                    onChange={handleChange}
                    className={inputClass}
                    rows={3}
                />
            );
        }

        return (
            <input
                type="text"
                value={String(displayValue || '')}
                onChange={handleChange}
                className={inputClass}
            />
        );
    }

    return (
        <Tag className={className}>
            {displayValue}
        </Tag>
    );
};
