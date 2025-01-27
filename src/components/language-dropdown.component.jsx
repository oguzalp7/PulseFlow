"use client"

import React from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Select, Text } from '@chakra-ui/react';

const LanguageDropdown = () => {
    const { language, changeLanguage, availableLanguages } = useLanguage();

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        changeLanguage(newLanguage);
    };

    // React.useEffect(() => {
    //     const options = document.querySelectorAll('.chakra-select__wrapper option');
    //     options.forEach(option => {
    //         option.style.backgroundColor = 'transparent';
    //     });
    // }, []);

    return (
        <Select backgroundColor={'transparent'} color='green' textAlign='center' value={language} onChange={handleLanguageChange}>
        {availableLanguages.map((lang, index) => (
            <option key={lang.id} value={lang.code}> 
                {lang.name}
            </option>
        ))}
        </Select>
    );
};

export default LanguageDropdown;