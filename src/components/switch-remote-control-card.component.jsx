"use client";

import React, { useState, useEffect, useContext } from 'react'
import {pfClient} from '@/pulseflowApiClient';

import { Card, CardHeader, CardBody, CardFooter, Divider, Spinner, HStack, Flex, VStack, Image, Skeleton, SkeletonText, Text, useToast } from '@chakra-ui/react'
import { useLanguage } from '@/contexts/language-context';
import  useFetchData  from '@/hooks/useFetchData';

import useToggleSwitch from '@/hooks/useToggleSwitch';
import NeonToggleSwitch from './neon-switch.component';
import DashboardAutomationRemoteContainer from './dashboard-automation-remote-container.component';


const SwitchRemoteControlCard = ({output, loading, projectId}) => {

    const toast = useToast();
    const {language} = useLanguage();

    const { isOn, toggleSwitch } = useToggleSwitch(output.state === 1 ? true : false);

    if(loading){
        return (
            <Card bgColor={"rgba(0, 0, 0, 0.1)"} w="full" p={4} boxShadow="lg" alignItems='center'>
                <CardHeader textAlign='center'>
                    <Spinner size="lg" color="green.500" />
                    <SkeletonText  w='md' mt={4} noOfLines={1} spacing="4" />
                </CardHeader>
                <CardBody textAlign='center'>
                    <Skeleton w='md' height='20vh'  /> 
                </CardBody>
            </Card>
        )
    };

    const buttonCB = async (relay) => {
        try {
            const response = await pfClient.get(`/toggle/output/${output.id}`);
            // toggleSwitch(output);
            
            toast({
                title: language === 'en' ? "Success" : "Başarılı",
                description: language === 'en' ? `${relay.relay_type.charAt(0).toUpperCase() + relay.relay_type.slice(1)} command successful.` : `${relay.relay_type.charAt(0).toUpperCase() + relay.relay_type.slice(1)} komutu başarılı.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.log(error);
            toast({
                title: language === 'en' ? "Error" : "Hata",
                description: language === 'en' ? `${relay.relay_type.charAt(0).toUpperCase() + relay.relay_type.slice(1)} command failed, please try again.` : `${relay.relay_type.charAt(0).toUpperCase() + relay.relay_type.slice(1)} komutu başarısız, lütfen tekrar deneyin.`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Card bgColor={"rgba(0, 0, 0, 0.1)"} w="full" p={4} boxShadow="lg">
            <CardHeader color="green.500" textAlign='center'>
                <Text fontSize='xl'>{output.output_name}</Text>
            </CardHeader>
            <CardBody textAlign='center'>
                <VStack spacing={7} alignItems='center'>
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
                    <HStack spacing={4} justifyContent='center' w={'full'} mr={10}>
                        {output.relays.map((relay, index) => (
                            <>
                                <Text color={'white'} mt={7} key={index}>
                                    {language === 'en' ? "Manual: " : "Manuel: "}
                                </Text>
                                <NeonToggleSwitch
                                    key={relay.id}
                                    isOn={output.state === 1 ? true : false}
                                    toggleSwitch={() => {
                                        // toggleSwitch();
                                        buttonCB(relay);
                                    }}
                                    onColor='rgba(0, 255, 0, 0.5)'
                                    offColor='rgba(255, 0, 0, 0.5)'
                                    outerBrightness={30}
                                    innerBrightness={15}
                                    // outerWidth={["4em", "8em"]}
                                    // outerHeight={["2em", "2.2em", "2.4em", "4em"]}
                                    // innerWidth={["1.5em", "1.8em", "2.5em"]}
                                    // innerHeight={["1.5em", "1.8em", "2.5em"]}
                                />
                                {/* <Text color={'white'} mt={7} key={relay.id}>
                                    {language === 'en' ? "START" : "BAŞLAT"}
                                </Text> */}
                            </>
                            
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
    );
};

export default SwitchRemoteControlCard;