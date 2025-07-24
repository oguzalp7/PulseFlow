import React from 'react'
import { Box, Text, Icon, HStack } from "@chakra-ui/react";
import { useLanguage } from '@/contexts/language-context';

// Placeholder component for DashboardExternalSensorCard
// This should be replaced with the actual implementation of the card
const DashboardExternalSensorCard = ({ sensor, icon }) => {
    const { language } = useLanguage();
return (
    <Box borderWidth="1px" borderRadius="md" p={4} mb={4} bgColor={'rgba(127, 127, 127, 0.1)'}>
        <HStack>
            <Icon as={icon} color="green.500" boxSize={10} />
            <Text color={'white'} fontSize="lg" fontWeight="bold">{sensor.name}</Text>
        </HStack>
        <HStack alignItems="center" justifyContent="center" mt={2}>
            {/* <Text color={'white'} fontSize="xl" >
                {language === 'en' ? <b><u>Value:</u></b> : <b><u>Değer:</u></b>}
            </Text> */}
            {/* Assuming sensor.value and sensor.units_of_measure are available */}
            <Text color={'white'} fontSize="xl"> {sensor.value} {sensor.units_of_measure}</Text>
            {/* <Text color={'white'} fontSize="md">{sensor.location}</Text> */}
        </HStack>
    </Box>
)
}

export default DashboardExternalSensorCard