"use client";
import React, {useContext, useState, useEffect} from 'react'

import { Box, Text, Icon, HStack, VStack, IconButton, Spinner, Flex } from "@chakra-ui/react";
import { MdOutlineSensorsOff, MdOutlineSensors  } from "react-icons/md";
import { GrNext, GrPrevious } from "react-icons/gr";


import { useLanguage } from '@/contexts/language-context';
import UserContext from '@/contexts/user-context';
import useFetchData from '@/hooks/useFetchData';


import DashboardExternalSensorCard from './dashboard-external-sensor-card.compoınent';

const ExternalSensorContainer = ({project}) => {


    const { language } = useLanguage();
    const { user } = useContext(UserContext) || {};
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    const { data: sensors, loading: sensorsLoading, error: sensorsError, refetch: refetchSensors } = useFetchData(project ? `/external-sensors/?p=${project}&page=${page}&size=${limit}` : {});
    
    // Keep previous data visible while fetching new data
    const [visibleSensors, setVisibleSensors] = useState([]);
    const [visibleTotal, setVisibleTotal] = useState(0);

    // API response expected: { external_sensors: [...], total: number, page: number, size: number }
    const total = sensors?.total || visibleTotal || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const externalSensors = sensors?.external_sensors || visibleSensors;

    // Update visible data only after fetch completes
    useEffect(() => {
        if (sensors && sensors.external_sensors) {
        setVisibleSensors(sensors.external_sensors);
        setVisibleTotal(sensors.total);
        }
    }, [sensors]);

    useEffect(() => {
    const interval = setInterval(() => {
        refetchSensors();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
    }, [refetchSensors, page, limit, project]);

    // not found case
    if ( !sensorsLoading && sensors && sensors.total === 0) {
      return (
        <Box p={4} borderRadius="md" mt={5} mb={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
          {/* <Text color={'white'} fontSize="lg" fontWeight="bold">External Sensors</Text> */}
          <Icon as={MdOutlineSensorsOff} color="red.500" boxSize={10} />
          <Text color={'white'}>{language === 'en' ? 'No sensors available.' : 'Sensör bulunamadı.'}</Text>
        </Box>
      );
    }

    // Handle loading state
    if (sensorsLoading  && !sensors ) {
      return (
        <Box bgColor={'rgba(255, 255, 255, 0.1)'} p={4} borderRadius="md" mt={5} mb={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Spinner size="xl" color="green.500" />
            <Text color={'white'}>{language === 'en' ? 'Loading sensors...' : 'Sensörler yükleniyor...'}</Text>
        </Box>
      );
    }

    // // Handle error state
    // if (sensorsError) {
    //   return (
    //     <Box bgColor={'rgba(255, 255, 255, 0.1)'} p={4} borderRadius="md" mt={5} mb={5} display="flex" flexDirection="column" alignItems="center" justifyContent="center">
    //       <Text color={'white'} fontSize="lg" fontWeight="bold">Error loading sensors</Text>
    //       <Text color={'red.500'}>{sensorsError.message}</Text>
    //     </Box>
    //   );
    // }
    // Render
    return (
        <Box  p={4} borderRadius="md" mt={5} mb={5} >
        <VStack spacing={2} align="center" justify="center">
            
            <Flex w="100%" align="center" justify="space-between">
                <IconButton
                aria-label="Previous"
                icon={<GrPrevious />}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                variant="ghost"
                color="green.500"
                isDisabled={page <= 1}
                />
                <HStack spacing={4} justify="center" align="center">
                
                {externalSensors.map((sensor, idx) => (
                    <DashboardExternalSensorCard key={idx} sensor={sensor} icon={MdOutlineSensors} />

                ))}
                </HStack>
                <IconButton
                aria-label="Next"
                icon={<GrNext />}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                variant="ghost"
                color="green.500"
                isDisabled={totalPages <= 1}
                />
            </Flex>
            
            <Text color="gray.400" fontSize="sm">
            {`${page}/${totalPages}`}
            </Text>
        </VStack>
        </Box>
    );
};


export default ExternalSensorContainer;