"use client";
import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, TableCaption, TableContainer, Skeleton, Box, Heading, IconButton } from '@chakra-ui/react';
import { useLanguage } from '@/contexts/language-context';

const DataTable = ({ title, data, loading, error, columns, customButtons }) => {
    
    const { language } = useLanguage();

    if ( data === null && loading === true ) {
        return (
            <Skeleton height="50vh" opacity={0.2}/>
        );
    }

    if ( error && !loading  && data === null ) {
        return (
            <Box>
                <Heading as={'h1'}>Error fetching data</Heading>
            </Box>
        );
    }
    if (data && data.length === 0 && !loading) {
        return (
            <Box>
                <Heading as={'h1'}>No data available</Heading>
            </Box>
        );
    }
    return (
        <TableContainer overflowX={'auto'} boxSize={["100%", '100%']} >
            <Table variant="simple" colorScheme="green" size="sm">
                <TableCaption placement='top' color={'limegreen'}>{title}</TableCaption>
                <Thead >
                    {/* <Tr>
                        {Object.keys(data[0]).map((key) => (
                            <Th color={'green'} key={key}>{key}</Th>
                        ))}
                    </Tr> */}
                    <Tr>
                        {columns.map((column, index) => (
                        !column.hidden && <Th color={'green'} key={index}>{column.title}</Th>
                        ))}
                        {customButtons && <Th color={'green'}>{language === 'en' ? 'Actions' : 'İşlemler'}</Th>}
                    </Tr>
                </Thead>
                <Tbody>
                    {/* {data.map((row, index) => (
                        <Tr key={index}>
                            {Object.values(row).map((value, i) => (
                                <Td color={'gray.300'} key={i}>{value}</Td>
                            ))}
                        </Tr>
                    ))} */}
                    {loading ? (
                        <Tr>
                        <Td colSpan={columns.length + (customButtons ? 1 : 0)}>Loading...</Td>
                        </Tr>
                    ) : error ? (
                        <Tr>
                        <Td colSpan={columns.length + (customButtons ? 1 : 0)}>Error: {error.message}</Td>
                        </Tr>
                    ) : (
                        data.map((row, rowIndex) => (
                        <Tr color='gray.300' key={rowIndex}>
                            {columns.map((column, colIndex) => (
                            !column.hidden && <Td key={colIndex}>{row[column.field]}</Td>
                            ))}
                            {customButtons && (
                            <Td>
                                {customButtons.map((button, btnIndex) => (
                                <IconButton
                                    key={btnIndex}
                                    aria-label={button.label}
                                    icon={button.icon}
                                    onClick={() => button.onClick(row)}
                                    mr={2}
                                    color={button.color}
                                    variant={'ghost'}
                                />
                                ))}
                            </Td>
                            )}
                        </Tr>
                        ))
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;