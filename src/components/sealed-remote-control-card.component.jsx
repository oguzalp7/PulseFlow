"use client";

import React, { useState, useEffect, useContext } from 'react'
import { Card, CardHeader, CardBody, CardFooter, Spinner, HStack, Flex, VStack, Image, Skeleton, SkeletonText, Text, useToast, Divider } from '@chakra-ui/react'
import { useLanguage } from '@/contexts/language-context';
import  useFetchData  from '@/hooks/useFetchData';
import CircleButton from './circle-button.component';

import {pfClient} from '@/pulseflowApiClient';

import DashboardAutomationRemoteContainer from './dashboard-automation-remote-container.component';


const SealedRemoteControlCard = ({output, loading, projectId}) => {
    const toast = useToast();
    const {language} = useLanguage();
    // const { data: toggleOn, loading: toggleOnLoading, error: toggleOnError, fetchData: fetchOnToggle } = useFetchData(`/toggle/output/${output.id}/on`);
    // const { data: toggleOff, loading: toggleOffLoading, error: toggleOffError, fetchData: fetchOffToggle } = useFetchData(`/toggle/output/${output.id}/off`);
    
    if(loading){
        return (
            <Card bgColor={"rgba(0, 0, 0, 0.1)"} w="full" p={4} boxShadow="lg" alignItems='center'>
                <CardHeader textAlign='center'>
                    <Spinner size="lg" color="green.500" />
                    <SkeletonText  w='md' mt={4} noOfLines={1} spacing="4" />
                </CardHeader>
                <CardBody textAlign='center'>
                    {/* <Spinner size="xl" color="green.500" />  */}
                    <Skeleton w='md' height='20vh'  /> 
                </CardBody>
            </Card>
        )
    };



    const buttonCB = async (relay) => {
        if(relay.relay_type === 'start'){
            try {
                const response = await pfClient.get(`/toggle/output/${output.id}/on`);
                toast({
                    title: language === 'en' ? "Success" : "Başarılı",
                    description: language === 'en' ? "Start command successfull, please wait while starting." : "Başlatma komutu başarılı, başlatılırken lütfen bekleyin.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.log(error);
                toast({
                    title: language === 'en' ? "Error" : "Hata",
                    description: language === 'en' ? "Start command failed, please try again." : "Başlatma komutu başarısız, lütfen tekrar deneyin.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }else if(relay.relay_type === 'stop'){
            try{
                const response = await pfClient.get(`/toggle/output/${output.id}/off`);
                toast({
                    title: language === 'en' ? "Success" : "Başarılı",
                    description: language === 'en' ? "Stop command successfull, please wait while stopping." : "Durdurma komutu başarılı, durdurulurken lütfen bekleyin.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            } catch (error) {
                console.log(error);
                toast({
                    title: language === 'en' ? "Error" : "Hata",
                    description: language === 'en' ? "Stop command failed, please try again." : "Durdurma komutu başarısız, lütfen tekrar deneyin.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    }

    return (
        <Card mt={4} bgColor={"rgba(0, 0, 0, 0.1)"} w="full" p={4} boxShadow="lg">
            <CardHeader color="green.500" textAlign='center'>
                <Text>{output.output_name}</Text>       
            </CardHeader>
            <CardBody>
                <VStack>
                    <Flex
                        bg={output.state === 1 ? "rgba(0, 255, 0, 0.1)" : "rgba(255, 0, 0, 0.1)"}
                        rounded={'full'}
                        boxShadow={`0 0 30px ${output.state === 1 ? "rgba(0, 255, 0, 0.8)" : "rgba(255, 0, 0, 0.8)"}`}
                        justifyContent={'center'}
                        boxSize={["200px", "200px", "300px", "300px"]}
                        //display={["full", "none", "full"]}
                    >
                        <Image rounded={'full'}  src='/images/motor-icon.png'/>
                    </Flex>
                    <HStack mt={4} spacing={4} align='center' justify='center'>
                        {output.relays.map((relay, index) => (
                            <CircleButton key={index} relay={relay} clickCB={() => buttonCB(relay)} />
                        ))}
                    </HStack>
                    
                    {output.internal_sensors.map((sensor, index) => (
                        <HStack mt={4} spacing={4} align='center' justify='center' key={index}>
                            <Text color='gray.300'  fontSize="lg"  as='b'>{sensor.name}: </Text>
                            <Text color='gray.300'   fontSize="lg" > {sensor.value} {sensor.units_of_measure}</Text>
                        </HStack>
                    ))}
                    <Divider mt={4} />
                    <DashboardAutomationRemoteContainer projectId={projectId} output={output} />
                </VStack>
            </CardBody>
        </Card>
    )
}

export default SealedRemoteControlCard;