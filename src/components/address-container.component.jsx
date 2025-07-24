"use client";

import { Box, VStack, HStack, Text, Heading} from '@chakra-ui/react';
import { useLanguage } from '@/contexts/language-context';

const AddressContainer = () => {
    const { language, changeLanguage, availableLanguages } = useLanguage();
    return (
        <Box mt={[0,-40]}>
            <VStack >
                <Box  borderColor={'gray.300'} borderRadius={'lg'} w={['full', '50vh']} p={3}>
                    <HStack ml={'10%'}>
                        <Heading as={'b'} color={'gray.300'} fontSize={'14px'}>{language === 'en' ? ("Address: ") : ("Adres: ")}</Heading>
                        <Text as={'p'} color={'gray.300'} fontSize={'12px'}>Sinanpaşa Mah. Girne Bulv. No:55, Yüreğir/ADANA</Text>
                    </HStack>
                    <hr/>
                    <HStack ml={'10%'}>
                        <Heading as={'b'} color={'gray.300'} fontSize={'14px'}>{language === 'en' ? ("Phone: ") : ("Cep Telefonu: ")} </Heading>
                        <Text as={'p'} color={'gray.300'} fontSize={'12px'}>+90 539 309 98 28 </Text>
                    </HStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default AddressContainer;