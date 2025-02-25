import React from 'react';
import { FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { useLanguage } from '@/contexts/language-context';

const FormInput = ({ name, control, type, errors, label, placeholder }) => {
    const { language } = useLanguage();

    return (
        <FormControl mb={4}>
            <FormLabel as={'legend'} color={'gray.300'}>{label}</FormLabel>
            <Controller
                name={name}
                control={control}
                render={({ field }) => <Input type={type} color={'lime'} focusBorderColor='lime' placeholder={placeholder} _placeholder={{ opacity: 0.4, color: 'inherit' }} {...field} />}
            />
            <Text as={'b'} color="red.500">{errors[name]?.message}</Text>
        </FormControl>
    );
};

export default FormInput;
