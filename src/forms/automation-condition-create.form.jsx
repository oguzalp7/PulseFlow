"use client";

import React, { useState, useEffect, useContext } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box, HStack, Text, FormLabel, Divider } from '@chakra-ui/react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useFetchData from '@/hooks/useFetchData';
import { useLanguage } from '@/contexts/language-context';
import FormInput from '@/components/form-input.component';
import FormSelect from '@/components/form-select.component';
import GlowingGreenNeonButton from '@/components/glowing-neon-green-button.component';
import useToggleSwitch from '@/hooks/useToggleSwitch';
import NeonSwitch from '@/components/neon-switch.component';

import { optionStyle } from '@/utils';

const schema = yup.object().shape({
  automation_id: yup.number().required('Automation ID is required').positive('Automation ID must be greater than 0'),
  condition_type: yup.mixed().oneOf(['time', 'external_sensor', 'internal_sensor', 'external_event']).default('time'),
  start_time: yup.string().nullable(),
  end_time: yup.string().nullable(),
  specific_date: yup.date().nullable(),
  internal_sensor_id: yup.number().nullable().positive('Internal sensor ID must be greater than 0'),
  external_sensor_id: yup.number().nullable().positive('External sensor ID must be greater than 0'),
  threshold_value: yup.number().nullable(),
  comparison_type: yup.string().nullable(),
  //comparison_type: yup.mixed().oneOf(['>', '<', '==', '>=', '<=']).default("==").nullable(),
});

const AutomationConditionCreateForm = ({ onSubmit, defaultValues, automation }) => {
    //const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const [sensorSelect, setSensorSelect] = useState('internal');
    const { control, handleSubmit, formState: { errors }, setValue } = useForm({
        resolver: yupResolver(schema),
        defaultValues: defaultValues || {
            automation_id: automation.id,
            condition_type: "", //automation.automation_type === 'time' ? 'time' : `${sensorSelect}_sensor`,
            start_time: null,
            end_time: null,
            specific_date: null,
            interval_seconds: null,
            internal_sensor_id: null,
            external_sensor_id: null,
            threshold_value: null,
            comparison_type: null,
        }
    });
  
  const isSensor = automation.automation_type === 'sensor' || automation.automation_type === 'time_and_sensor';
  const [isOn, setIsOn] = useToggleSwitch(false);
  

  useEffect(() => {
    setSensorSelect(isOn ? 'external' : 'internal');
  }, [isOn]);

  const fetchUrl = `/${isOn ? 'external' : 'internal'}-sensors/?p=${automation.project_id}&page=1&size=50`;
  const { data: sensors, loading: sensorsLoading, error: sensorsError } = useFetchData(fetchUrl);
  const [sensorOptions, setSensorOptions] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState("");

  useEffect(() => {
    if (sensors) {
      setSensorOptions(sensors[`${sensorSelect}_sensors`]);
    }
  }, [sensors, sensorSelect]);

  useEffect(() => {
    if (defaultValues) {
      Object.keys(defaultValues).forEach(key => {
        setValue(key, defaultValues[key]);
      });
    }
  }, [defaultValues, setValue]);
  // console.log(defaultValues);
  return (
    <>
    <Box p={4} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormInput type='hidden' name='automation_id' control={control} errors={errors} label={language === 'en' ? '' : ''} placeholder={language === 'en' ? 'Please enter the automation ID.' : 'Otomasyon ID giriniz.'} />
        <FormSelect
            name='condition_type'
            control={control}
            errors={errors}
            label={language === 'en' ? 'Condition Type' : 'Koşul Tipi'}
            placeholder={language === 'en' ? 'Please select the condition type.' : 'Koşul tipini seçiniz.'}
            options={[
              { value: 'time', label: language === 'en' ? 'Time' : 'Zaman' },
              { value: 'external_sensor', label: language === 'en' ? 'External Sensor' : 'Harici Sensör' },
              { value: 'internal_sensor', label: language === 'en' ? 'Internal Sensor' : 'Dahili Sensör' },
              { value: 'external_event', label: language === 'en' ? 'External Event' : 'Harici Olay' },
            ]}
            loading={false}
        />
        {(automation.automation_type.includes('time')) && (
            <Box mb={10}>
                <FormInput
                    name='start_time'
                    control={control}
                    errors={errors}
                    label={language === 'en' ? 'Start Time' : 'Başlangıç Zamanı'}
                    placeholder={language === 'en' ? 'Please enter the start time.' : 'Başlangıç zamanını giriniz.'}
                    type='time'
                />
                <FormInput
                    name='end_time'
                    control={control}
                    errors={errors}
                    label={language === 'en' ? 'End Time' : 'Bitiş Zamanı'}
                    placeholder={language === 'en' ? 'Please enter the end time.' : 'Bitiş zamanını giriniz.'}
                    type='time'
                />
                <FormInput
                    name='specific_date'
                    control={control}
                    errors={errors}
                    label={language === 'en' ? 'Specific Date' : 'Belirli Tarih'}
                    placeholder={language === 'en' ? 'Please enter the specific date.' : 'Belirli tarihi giriniz.'}
                    type='date'
                />
            </Box>
        )}
        {isSensor && automation.automation_type !== 'time' && (
            <Box mb={10}>
                <FormLabel as={'legend'} color={'gray.300'}>{language === 'en' ? 'Sensor Type: ' : 'Sensör Tipi: '}</FormLabel>
                <HStack spacing={10} align='center' justify='center'>
                    <Text mt={7} fontSize='lg' as={'legend'} color={'gray.300'}>{language === 'en' ? "Internal" : "Dahili"}</Text>
                    <NeonSwitch isOn={isOn} toggleSwitch={setIsOn}
                        offColor="rgba(255, 0, 255, 0.5)"
                        outerBrigthness={50}
                        innerBrigthness={10}
                    />
                    <Text mt={7} ml={7} fontSize='lg' as={'legend'} color={'gray.300'}>{language === 'en' ? "External" : "Harici"}</Text>
                </HStack>
                <Divider mb={5} mt={5} />
                <FormSelect
                    name={`${sensorSelect}_sensor_id`}
                    control={control}
                    errors={errors}
                    label={language === 'en' ? 'Sensor' : 'Sensör'}
                    placeholder={language === 'en' ? 'Please select the sensor.' : 'Sensör seçiniz.'}
                    options={sensorOptions ? sensorOptions.map(sensor => ({ value: sensor.id, label: sensor.name })) : []}
                    loading={sensorsLoading}
                    onChange={(e) => setSelectedSensor(e.target.value)}
                />
                <FormInput
                    name='threshold_value'
                    control={control}
                    errors={errors}
                    label={language === 'en' ? 'Threshold Value' : 'Eşik Değeri'}
                    placeholder={language === 'en' ? 'Please enter the threshold value.' : 'Eşik değerini giriniz.'}
                />
                <FormSelect
                    name='comparison_type'
                    control={control}
                    errors={errors}
                    label={language === 'en' ? 'Comparison Type' : 'Karşılaştırma Tipi'}
                    placeholder={language === 'en' ? 'Please select the comparison type.' : 'Karşılaştırma tipini seçiniz.'}
                    options={[
                        { value: '>', label: '>' },
                        { value: '<', label: '<' },
                        { value: '==', label: '==' },
                        { value: '>=', label: '>=' },
                        { value: '<=', label: '<=' },
                    ]}
                    loading={false}
                />
            </Box>
        )}  

        
        
        
        <GlowingGreenNeonButton type="submit">{language === 'en' ? 'Save' : 'Kaydet'}</GlowingGreenNeonButton>
    </Box>
    </>      
         
  );
};

export default AutomationConditionCreateForm;


