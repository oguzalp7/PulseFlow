"use client";

import React, { useState, useContext } from 'react';
import { useLanguage } from '@/contexts/language-context';
import UserContext from '@/contexts/user-context';
import { Box, Heading, Text, Button, IconButton, HStack, VStack, Stack, ButtonGroup, useToast  } from '@chakra-ui/react';


const UserCardContent = ({user}) => {
    const {language} = useLanguage();
  return (
    <Box p={4}>
        <Stack spacing='3' align={'center'}>
            <HStack>
                <Text as={'b'} color={'gray.300'}>
                    {language === 'en' ? 'User Name: ' : 'Kullanıcı Adı: '}
                </Text>
                <Text  color={'gray.300'}>
                    {user.username}
                </Text>
            </HStack>

            <HStack>
                <Text as={'b'} color={'gray.300'}>
                    {language === 'en' ? 'Full Name: ' : 'Ad/Soyad: '}
                </Text>
                <Text  color={'gray.300'}>
                    {user.name}
                </Text>
            </HStack>

            <HStack>
                <Text as={'b'} color={'gray.300'}>
                    {language === 'en' ? 'Email: ' : 'Email: '}
                </Text>
                <Text  color={'gray.300'}>
                    {user.email}
                </Text>
            </HStack>

            <HStack>
                <Text as={'b'} color={'gray.300'}>
                    {language === 'en' ? 'Contact: ' : 'İletişim: '}
                </Text>
                <Text  color={'gray.300'}>
                    {user.contact}
                </Text>
            </HStack>

            <HStack>
                <Text as={'b'} color={'gray.300'}>
                    {language === 'en' ? 'Address: ' : 'Adres: '}
                </Text>
                <Text  color={'gray.300'}>
                    {user.address}
                </Text>
            </HStack>

            <HStack>
                <Text as={'b'} color={'gray.300'}>
                    {language === 'en' ? 'Preferred Language: ' : 'Tercih Edilen Dil: '}
                </Text>
                <Text  color={'gray.300'}>
                    {user.preferred_language === 'en' ? 'EN' : 'TR'}
                </Text>
            </HStack>
        </Stack>
    </Box>
  )
}

export default UserCardContent