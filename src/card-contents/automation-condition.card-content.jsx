"use client";

import React, { useState, useContext } from 'react';
import { Text } from '@chakra-ui/react';
const AutomationConditionCardContent = ({ condition }) => {
    return(
        <>
            <Text>{condition.condition_type}</Text>
            <Text>{condition.start_time}</Text>
            <Text>{condition.end_time}</Text>
            <Text>{condition.specific_date}</Text>
            <Text>{condition.interval_seconds}</Text>
            <Text>{condition.internal_sensor_id}</Text>
            <Text>{condition.external_sensor_id}</Text>
            <Text>{condition.threshold_value}</Text>
            <Text>{condition.comparison_type}</Text>
        </>
    );
};

export default AutomationConditionCardContent;