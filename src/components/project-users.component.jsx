"use client";

import React, { useState, useEffect, useContext } from 'react'

import UserContext from '@/contexts/user-context';

import useFetchData from '@/hooks/useFetchData';

import DataTable from './data-table.component';

import { useLanguage } from '@/contexts/language-context';

import { MdGroupRemove } from "react-icons/md";

import useDeleteData from '@/hooks/useDeleteData';

/*
    TODO: Implement invite user to project.
*/

const ProjectUsers = ({ projectId }) => {
    const { user } = useContext(UserContext);
    const { data: users, loading, error, refetch } = useFetchData(`/projects/${projectId}/roles`);
    const { language } = useLanguage();

    const { deleteData } = useDeleteData(`/projects/${projectId}/users`);
    
    const columns = [
        {title : language === 'en' ? 'ID' : 'ID', field: 'id', hidden: true},
        {title : language === 'en' ? 'User' : 'Kullanıcı', field: 'user'},
        {title : language === 'en' ? 'Auth' : 'Yetki', field: 'auth'},
        {title : language === 'en' ? 'Role' : 'Rol', field: 'role'},
        {title : language === 'en' ? 'Contact' : 'İletişim', field: 'contact'},
        {title : language === 'en' ? 'Email' : 'E-posta', field: 'email'},
        {title : language === 'en' ? 'Address' : 'Adres', field: 'address'}
    ];

    const customButtons = [
        {
            label: language === 'en' ? 'Remove User' : 'Kullanıcıyı Kaldır',
            icon: <MdGroupRemove />,
            onClick: (rowData) => {
                console.log('Remove user', rowData);
                deleteData(rowData.id);
                refetch();
            },
            color: 'red.500'
        }
    ];

    /*
    {
        "id": 1,
        "auth": "La Vittoria Mühendis/Geliştirici",
        "role": "Proje Sahibi",
        "user": "La Vittoria AI",
        "contact": "+90 541 771 47 69",
        "email": "oguz@lavittoria.ai",
        "address": "Sinanpaşa Mah. Girne Bulv. No: 55, Yüreğir/Adana"
    }
    */
    return (
       <>
        {users && !loading && !error && (
            <DataTable title={language === 'en' ? 'Users' : 'Kullanıcılar'} data={users} loading={loading} error={error} columns={columns} customButtons={customButtons} />  
        )}
       </>
    );
}

export default ProjectUsers;