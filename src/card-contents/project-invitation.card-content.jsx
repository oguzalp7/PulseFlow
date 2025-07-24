"use client";

import React, { useState, useContext } from 'react';
import { useLanguage } from '@/contexts/language-context';
import UserContext from '@/contexts/user-context';
import { Box, Heading, Text, Button, IconButton, HStack, VStack, Stack, ButtonGroup, useToast  } from '@chakra-ui/react';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Tag, Icon
} from '@chakra-ui/react'

import { BiSolidHide, BiSolidShow, BiEdit, BiTrash } from "react-icons/bi";

import { GrTroubleshoot, GrPower  } from "react-icons/gr";

import { MdOutlineCheck, MdClose  } from "react-icons/md";


import useCreateData from '@/hooks/useCreateData';
import useDeleteData from '@/hooks/useDeleteData';


const InvitationCardContent = ({invitation, refetch}) => {
    const {language} = useLanguage();
    const [showData, setShowData] = useState(false); // show instensive data
    const { user } = useContext(UserContext);
    const toast = useToast();
    // const toggleData = () => setShowData(!showData);
    const { data, loading, error, createData } = useCreateData('/projects/accept_invitation');
    const { deleteData } = useDeleteData('/projects/invitations/me');

    const handleAcceptInvitation = async (token) => {
        await createData({
            token: token
        })
        if (!error) {
            toast({
                title: language === 'en' ? 'Invitation Accepted.🎊' : 'Davet Kabul Edildi.🎊',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error Accepting Invitation.' : 'Davet Kabul Edilemedi.',
                description: language === 'en' ? 'Another project with the same name exists, please try again with a different name.' : 'Aynı isimde farklı bir proje mevcut, lütfen farklı bir isimle deneyiniz.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        refetch();
    }

    const handleRejectInvitation = async (id) => {
        await deleteData(id);

        if (!error) {
            toast({
                title: language === 'en' ? 'Invitation Rejected' : 'Davetiye Reddedildi.',
                status: 'info',
                duration: 5000,
                isClosable: true,
            });
            
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error rejecting invitation.' : 'Davetiye reddedilirken bir sorun oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        refetch();
    }

    return(
        <Box p={4}>
            {/* {JSON.stringify(invitation)} */}
            <Stack spacing='3' align={'center'}>
                <HStack>
                    <Heading color={'gray.300'} as="h4" size="md" >
                        {language === 'en' ? 'Project: ' : 'Proje: '}
                    </Heading>
                    <Heading color={'gray.300'} as="u" size="md" fontWeight={'xl'}>
                        {invitation.project}
                    </Heading>
                </HStack>
                <Text color={'gray.300'}>
                    {invitation.description}
                </Text>

                <HStack>
                    <Text as={'b'} color={'gray.300'}>
                        {language === 'en' ? 'Role: ' : 'Rol: '}
                    </Text>
                    <Text  color={'gray.300'}>
                        {invitation.role}
                    </Text>
                </HStack>

                <HStack>
                    <Text as={'b'} color={'gray.300'}>
                        {language === 'en' ? 'Inviter: ' : 'Gönderen: '}
                    </Text>
                    <Text noOfLines={1} color={'gray.300'}>
                        {invitation.user}
                    </Text>
                </HStack>

                <ButtonGroup spacing='4'>
                    <Button onClick={() => {handleAcceptInvitation(invitation.token)}} colorScheme='rgba(0, 255, 0, 0.4)' variant='outline' color={'lime'} leftIcon={<MdOutlineCheck /> }>{language === 'en' ? 'Accept' : 'Kabul Et'}</Button>
                    <Button onClick={() => {handleRejectInvitation(invitation.id)}} colorScheme='rgba(255, 0, 0, 0.4)' variant={'outline'} color={'red'} leftIcon={<MdClose /> }>{language === 'en' ? 'Reject': 'Reddet'}</Button>
                </ButtonGroup>

            </Stack>
        </Box>
    );
};

export default InvitationCardContent;