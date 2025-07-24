"use client"

import React, {useState, useEffect, useContext} from 'react'
import CardLayout from './card-layout.component'
import UserContext from '@/contexts/user-context'
import { useLanguage } from '@/contexts/language-context'
import UserCardContent from '@/card-contents/user.card-content'
import UserUpdateForm from '@/forms/user-update.form'

import useUpdateData from '@/hooks/useUpdateData'
import { useToast } from '@chakra-ui/react'

const ProfileComponent = () => {
    const { user } = useContext(UserContext);
    const {language} = useLanguage();
    const toast = useToast();
    const { data, loading, error, updateData } = useUpdateData('/users');
    
    const handleUpdateUser = async (id, formData) => {
        await updateData(id, formData);
        if (!error) {
            toast({
                title: language === 'en' ? 'User updated successfully. 🎊' : 'Kullanıcı kaydı başarıyla güncellendi. 🎊',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            
        } else {
            toast({
                title: language === 'en' ? 'Error updating user record.' : 'Kullanıcı kaydı güncellenirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        
    }
    
    
  return (
    <CardLayout 
        cardChildren={<UserCardContent user={user} />}
        FormComponent={UserUpdateForm}
        onEdit={handleUpdateUser}
        data={user}
    />
  )
}

export default ProfileComponent