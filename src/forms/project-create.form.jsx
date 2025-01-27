import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, Button, FormControl, FormLabel, Input, Select, Text, Textarea } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useLanguage } from '@/contexts/language-context';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';

const schema = yup.object().shape({
    name: yup.string().required("Project name is required. / Proje adı zorunludur."),
    description: yup.string()
});

const ProjectCreateForm = ({ onSubmit, defaultValues }) => {
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        defaultValues
    });

    const { language } = useLanguage();

    return (
        <Box boxSize={['90%', '100%']} mr={10} p={4}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Project Name:' : 'Proje Adı:'}</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <Input color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? 'Please enter your project name.' : 'Projenizin adını giriniz.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text as={'b'} color="red.500">{errors.name?.message}</Text>
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Project Description:' : 'Proje Açıklaması:'}</FormLabel>
                    <Controller
                        name="description"
                        control={control}
                        render={({ field }) => <Textarea color={'lime'} focusBorderColor='lime' placeholder={language === 'en' ? "(Optional) Please describe your project for other users to understand." : '(Opsiyonel) Proje detaylarını diğer kullanıcıların anlayabileceği şekilde açıklayınız.'} _placeholder={{opacity: 0.4, color: 'inherit'}} {...field} />}
                    />
                    <Text color="red.500">{errors.description?.message}</Text>
                </FormControl>
                <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>
            </form>
        </Box>
    );
};

export default ProjectCreateForm;