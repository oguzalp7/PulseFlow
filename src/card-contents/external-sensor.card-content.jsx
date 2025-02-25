"use client";

import { useLanguage } from '@/contexts/language-context';
import React, { useState, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { Heading, Text, HStack, IconButton, Icon } from '@chakra-ui/react';
import useFetchData from '@/hooks/useFetchData';

const ExternalSensorCardContent = ({ externalSensor }) => {
    const { language } = useLanguage();

    const { data: deviceData, loading: deviceLoading, error: deviceError } = useFetchData(`/devices/raw/${externalSensor.device_id}`);
    
    return(
        <>
        <Heading as="h3" size="lg">
            {externalSensor.name}
        </Heading>
        <Text>
            {externalSensor.description}
        </Text>
        <Text>
            {externalSensor.value} {externalSensor.units_of_measure}
        </Text>
        <Text>
            {deviceData && deviceData.name}
        </Text>
        <Text>
            {externalSensor.location}
        </Text>
        </>
    );
}

export default ExternalSensorCardContent;