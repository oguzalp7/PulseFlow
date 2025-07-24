"use client";

import React, { useState, useContext } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Heading, Text, HStack, Tag, Icon } from '@chakra-ui/react';

import useFetchData from '@/hooks/useFetchData';

const InternalSensorCardContent = ({ internalSensor }) => {
    const { data: deviceData, loading: deviceLoading, error: deviceError } = useFetchData(`/devices/raw/${internalSensor.device_id}`);
    const { data: outputData, loading: outputLoading, error: outputError } = useFetchData(`/outputs/raw/${internalSensor.output_id}`);

    const { language } = useLanguage();

    return (
        <>
        <Heading as="h3" size="lg" color={'white'}>
            {internalSensor.name}
        </Heading>
        <Text color={'white'}>
            {internalSensor.description}
        </Text>
        <Text color={'white'}>
            {internalSensor.value} {internalSensor.units_of_measure}
        </Text>
        <Text color={'white'}>
            {internalSensor.sensor_type}
        </Text>
        <Text color={'white'}>
            {deviceData && deviceData.name}
        </Text>
        <Text color={'white'}>
            {outputData && outputData.name}
        </Text>
        </>
    );
};

export default InternalSensorCardContent;