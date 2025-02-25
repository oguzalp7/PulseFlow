"use client";

import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';

import useFetchData from '@/hooks/useFetchData';

import CustomTabs from '@/components/CustomTabs';

const LogsPage = () => {

    const tabs = [
        {label: 'Internal Sensors', content: (<>Internal Sensors</>)},
    ];

    return(
        <CustomTabs tabs={tabs}/>
    );
};

export default LogsPage;