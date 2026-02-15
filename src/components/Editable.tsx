
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


    // We use a ref to handle the contentEditable changes without re-rendering on every keystroke for performance,
    // but we need to update the context on blur to save.
    const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
        // Prevent updates if value hasn't changed to avoid unnecessary re-renders/API calls logic
        if (e.target.innerText !== value) {
            updateContent(path, e.target.innerText);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
        if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            e.currentTarget.blur();
        }
    };

    if (isEditing) {
        return (
            <Tag
                contentEditable
                suppressContentEditableWarning
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={`outline-none min-w-[20px] transition-all cursor-text rounded-sm px-0.5 empty:before:content-['Empty'] empty:before:text-gray-300 border border-transparent hover:border-brand-blue/30 focus:border-brand-blue/50 focus:bg-white/5 ${className}`}
            >
                {displayValue}
            </Tag>
        );
    }

    return (
        <Tag className={className}>
            {displayValue}
        </Tag>
    );
};
