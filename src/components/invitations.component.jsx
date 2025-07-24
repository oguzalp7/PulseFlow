"use client";

import React, { useState, useEffect, useContext } from "react";
import { useToast } from "@chakra-ui/react";
import useFetchData from "@/hooks/useFetchData";
import useCreateData from "@/hooks/useCreateData";

import UserContext from "@/contexts/user-context";
import { useLanguage } from "@/contexts/language-context";

import CardGrid from "./card-grid.component";
import CardLayout from "./card-layout.component";
import { Box, Flex, Spinner, Skeleton, Text, VStack, HStack, IconButton } from "@chakra-ui/react";
import { GrNext, GrPrevious } from "react-icons/gr";

import InvitationCardContent from "@/card-contents/project-invitation.card-content";

const InvitationsComponent = () => {
    const {user} = useContext(UserContext);
    const { language } = useLanguage();
    const toast = useToast();

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const [showPagination, setShowPagination] = useState(false);
    const handleIncreasePage = () => setPage(page + 1);
    const handleDecreasePage = () => setPage(page - 1);


    const { data: invitations, loading: invitationsLoading, error: invitationsError, setData: setInvitations, refetch } = useFetchData(`/projects/invitations/me`);
    // console.log(invitations);

    useEffect(() => {
        if(invitations && invitations.total > invitations.page * invitations.size){
            setShowPagination(true);
        }else{
            setShowPagination(false);
        }
    }, [invitations]);

    
    return (
        <Box border={"1px"}>
            {invitationsLoading ? (
                <Flex align='center' justify='center' direction='column'>
                    <Spinner size="xl" color="green.500" />
                    <Skeleton height="20px" />
                </Flex>
            ) : invitations && invitations.invitations && invitations.invitations.length > 0 ? (
                <CardGrid>
                    {invitations.invitations.map((invitation, index) => (
                        <CardLayout
                            key={index}
                            cardChildren={<InvitationCardContent invitation={invitation} refetch={refetch} />}
                            // FormComponent={RelayCreateForm}
                            // onEdit={handleUpdateRelay}
                            // onDelete={handleDeleteRelay}
                            data={invitation}
                        />
                    ))}
                </CardGrid>
            ) : (
                <Flex align='center' justify='center' direction='column'>
                    <Text color='gray.500'>{language === 'en' ? 'No invitation found.' : 'Davet bulunamadı.'}</Text>
                </Flex>
            )}

            {showPagination && (
                <VStack>
                    <HStack>
                        {page > 1 && <IconButton variant={'ghost'} color={'green.500'} onClick={handleDecreasePage} icon={<GrPrevious />} />}
                        {relays && relays.total >= relays.page * relays.size && <IconButton variant={'ghost'} color={'green.500'} onClick={handleIncreasePage} icon={<GrNext />} />}
                    </HStack>
                    <HStack justifyContent='center' mt={4}>
                        <Text color='gray.500'>{language === 'en' ? 'Page' : 'Sayfa'}</Text>
                        <Text color='gray.500'>{page}</Text>
                        <Text color='gray.500'>{language === 'en' ? 'of' : '/'}</Text>
                        <Text color='gray.500'>{relays && relays.total && Math.ceil(relays.total / relays.size)}</Text>
                    </HStack>
                    <HStack>
                        <Text color='gray.500'>{language === 'en' ? 'Total' : 'Toplam'}</Text>
                        <Text color='gray.500'>{relays && relays.total}</Text>
                        <Text color='gray.500'>{language === 'en' ? 'Actuators' : 'Aktüatör'}</Text>
                    </HStack>
                </VStack>
            )}
        </Box>
    )
}

export default InvitationsComponent