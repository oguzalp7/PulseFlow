import React from 'react';
import { FormControl, FormLabel, Select, Text, Flex, Spinner, Skeleton } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { useLanguage } from '@/contexts/language-context';

const FormSelect = ({ name, control, errors, label, placeholder, options, loading, onChange }) => {
    const { language } = useLanguage();

    return (
        <FormControl mb={4}>
            <FormLabel as={'legend'} color={'gray.300'}>{label}</FormLabel>
            {loading && (
                <Flex align='center' justify='center' direction='column'>
                    <Spinner size="xl" color="green.500" />
                    <Skeleton height="20px" />
                </Flex>
            )}
            {!loading && options && (
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Select {...field} color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder={placeholder} onChange={(e) => { field.onChange(e); onChange && onChange(e); }}>
                            {options.map((option, index) => (
                                <option key={index} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    )}
                />
            )}
            <Text as={'b'} color="red.500">{errors[name]?.message}</Text>
        </FormControl>
    );
};

export default FormSelect;
