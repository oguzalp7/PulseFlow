"use client";

import { useLanguage } from '@/contexts/language-context';
import React, { useState, useContext } from 'react';

import { Heading,
    Text,
    HStack,
    
    Tag,
    Icon,
  
}  from '@chakra-ui/react';

import { GrTroubleshoot, GrPower  } from "react-icons/gr";

const ActuatorCardContent = ({ actuator }) => {
    const { language } = useLanguage();
    return (
        <>
            <Heading color={'gray.300'} size="md">{actuator.name}</Heading>
            <HStack>
                <Text color={'gray.300'}>{language === 'en' ? 'Wiring: ' : 'Bağlantı şeması:'}</Text>
                <Text color={'gray.300'} >{actuator.circuit_type === 'sealed' ? (language === 'en' ? "Star-Triangle" : "Yıldız-Üçgen") : (language === 'en' ? "Straight" : 'Düz')}</Text>
            </HStack>
            <HStack>
                <Text color={'gray.300'}>{language === 'en' ? 'State: ' : 'Durum: '}</Text>
                <Tag colorScheme={actuator.state === 1 ? 'green' : 'red'}><Icon as={GrPower}/></Tag>
            </HStack>
            <HStack>
                <Text color={'gray.300'}>{language === 'en' ? 'Fault Status: ' : 'Arıza Durumu: '}</Text>
                <Tag colorScheme={actuator.is_out_of_order ? 'red' : 'green'}><Icon as={GrTroubleshoot}/></Tag>
            </HStack>
        </>
    );
};

export default ActuatorCardContent;