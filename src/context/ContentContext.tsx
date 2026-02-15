
import React, { createContext, useContext, useState, useEffect } from 'react';
import { siteData as initialSiteData } from '../../data';

type ContentContextType = {
    content: typeof initialSiteData;
    updateContent: (path: string, value: string) => void;
    saveChanges: () => Promise<void>;
    isEditing: boolean;
    toggleEditMode: () => void;
    hasUnsavedChanges: boolean;
};

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState(initialSiteData);
    const [isEditing, setIsEditing] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Deep update utility
    const updateContent = (path: string, value: string) => {
        setContent(prevContent => {
            const newContent = JSON.parse(JSON.stringify(prevContent));
            const keys = path.split('.');
            let current = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                if (current[keys[i]] === undefined) return prevContent; // Path invalid
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newContent;
        });
        setHasUnsavedChanges(true);
    };

    const saveChanges = async () => {
        try {
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) throw new Error('Failed to save changes');

            setHasUnsavedChanges(false);
            alert('Cambios guardados exitosamente. El sitio se reconstruirá en unos minutos.');
            window.location.reload();
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error al guardar cambios. Verifica la consola y tu configuración.');
        }
    };

    const toggleEditMode = () => setIsEditing(prev => !prev);

    // Keyboard shortcut for toggle: Ctrl + . 
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key === '.') {
                e.preventDefault();
                toggleEditMode();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <ContentContext.Provider value={{ content, updateContent, saveChanges, isEditing, toggleEditMode, hasUnsavedChanges }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within a ContentProvider');
    return context;
};
