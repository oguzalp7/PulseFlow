"use client";

import React, {useContext} from 'react';

import UserContext from '@/contexts/user-context';
import {useLanguage} from '@/contexts/language-context';
import LanguageDropdown from '@/components/language-dropdown.component';

import ProtectedRoute from '@/components/protected-route.component';


const DashboardHomePage = () => {
    const { user } = useContext(UserContext) || {};
    const { language } = useLanguage();
    
  return (
    <ProtectedRoute>
      <div>
        <h1>Dashboard Home</h1>
        

        <LanguageDropdown/>
        {/* Add dashboard content here */}
      </div>
    </ProtectedRoute>
  );
};

export default DashboardHomePage;