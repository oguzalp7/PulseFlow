import React from 'react';
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box, Spinner, SkeletonText } from '@chakra-ui/react';

/**
 * CustomTabs component to encapsulate the common Tabs structure.
 *
 * @param {Array} tabs - An array of objects representing the tabs. Each object should have a `label` and `content` property.
 * @param {Object} styleProps - Optional style properties to customize the Tabs component.
 */
const CustomTabs = ({ tabs, styleProps }) => {
    return (
        <Tabs variant='soft-rounded' align='center' colorScheme='purple' w={['md', 'md', 'full']} p={4} boxShadow="lg" {...styleProps}>
            <TabList border={'1px'} borderRadius={'10px'} borderColor={'rgba(0, 255, 0, 0.3)'} mr={[10, 0]} paddingRight={[10, 0]} p={2} mb={4} boxSize={['100%', '100%']} overflowX={'auto'}>
                {tabs.map((tab, index) => (
                    <Tab key={index} color={'green'}>{tab.label}</Tab>
                ))}
            </TabList>
            <TabPanels boxSize={'100%'}>
                {tabs.map((tab, index) => (
                    <TabPanel key={index} align={['center', 'left']}>
                        {tab.content}
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    );
};

export default CustomTabs;

/**
 * Usage Instructions:
 *
 * 1. Import the CustomTabs component in your page file.
 *    import CustomTabs from 'path/to/CustomTabs';
 *
 * 2. Define the tabs array with label and content properties.
 *    const tabs = [
 *        { label: 'Tab 1', content: <ComponentForTab1 /> },
 *        { label: 'Tab 2', content: <ComponentForTab2 /> },
 *        // Add more tabs as needed
 *    ];
 *
 * 3. Use the CustomTabs component and pass the tabs array as a prop.
 *    <CustomTabs tabs={tabs} />
 *
 * 4. Optionally, you can pass additional style properties to customize the Tabs component.
 *    <CustomTabs tabs={tabs} styleProps={{ variant: 'enclosed', colorScheme: 'blue' }} />
 */
