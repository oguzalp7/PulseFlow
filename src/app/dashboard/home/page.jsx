"use client";

import React, {useContext, useEffect, useState} from 'react';

import UserContext from '@/contexts/user-context';
import {useLanguage} from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';

import CardGrid from '@/components/card-grid.component';
import SealedRemoteControlCard from '@/components/sealed-remote-control-card.component';
import { Box, Flex, Stack, HStack, Select, Spinner, Skeleton, VStack, IconButton, Text } from "@chakra-ui/react";
import { GrNext, GrPrevious  } from "react-icons/gr";
const DashboardHomePage = () => {
    const { user } = useContext(UserContext) || {};
    const { language } = useLanguage();
    const [showPagination, setShowPagination] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    
    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);
    
    const handleIncreasePage = () => setPage(page + 1);

    const handleDecreasePage = () => setPage(page - 1);

    useEffect(() => {
      if(projects  && !projectsLoading){ 
        setSelectedProject(projects[0].id);
      }
    }, [projects, projectsLoading, projectsError]);

    useEffect(() => {
          if (projects && projects.length > 0) {
            // Set the first project as the default selected option
            document.querySelector('select').value = projects[0].id;
          }else if(projects && projects.length === 0){
            document.querySelector('select').value = '';
          }
    }, [projects]);

   


    const { data: outputs, loading: outputsLoading, error: outputsError, refetch: fetchOutputs } = useFetchData(`/outputs/project/${selectedProject}/actuator_cards?outOfOrder=false&page=${page}&size=${limit}`);

    useEffect(() => {
      const interval = setInterval(() => {
        fetchOutputs();
      }, 3000); // 30000 milliseconds = 30 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [fetchOutputs]);

    useEffect(() => {
      if(outputs && outputs.total >= outputs.page * outputs.size ) {
        setShowPagination(true);
      } else {
        setShowPagination(false);
      }
    }, [selectedProject, outputs]);
   
    return (
      
      <Box p={4}>
       
        <HStack mt={2} spacing={4} align='center' justify='center'>
            {projectsLoading && (
              <Flex align='center' justify='center' direction='column'>
                <Spinner size="xl" color="green.500" />
                <Skeleton height="20px"/>
                {/* <SkeletonText mt={4} noOfLines={4} spacing="4" /> */}
              </Flex>
            )}
            {projects && !projectsLoading && (
              <Select w={'md'} color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder={language === 'en' ? "Select Project" : "Proje Seçiniz"} onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                {projects && projects.map((project, index) => (
                  <option key={index} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </Select>
            )}
            
        </HStack>

        <CardGrid >
          {outputsLoading && (
            <Flex align='center' justify='center' direction='column'>
              <Spinner size="xl" color="green.500" />
              <Skeleton height="20vh"/>
              {/* <SkeletonText mt={4} noOfLines={4} spacing="4" /> */}
            </Flex>
          )}
         
          {outputs && !outputsLoading && outputs.actuator_cards && outputs.actuator_cards.map((output) => (
                <SealedRemoteControlCard key={output.id} output={output} loading={outputsLoading} />
          ))}
          
        </CardGrid>
        {showPagination && (
              <VStack>
                <HStack>
                  {page > 1 && <IconButton variant={'ghost'} color={'green.500'} onClick={handleDecreasePage} icon={<GrPrevious />} />}
                  {outputs && outputs.total > outputs.page * outputs.size && <IconButton variant={'ghost'} color={'green.500'} onClick={handleIncreasePage} icon={<GrNext />} />}
                </HStack>
                <HStack justifyContent='center' mt={4}>
                  <Text color='gray.500'>{language === 'en' ? 'Page' : 'Sayfa'}</Text>
                  <Text color='gray.500'>{page}</Text>
                  <Text color='gray.500'>{language === 'en' ? 'of' : '/'}</Text>
                  <Text color='gray.500'>{outputs && outputs.total && Math.ceil(outputs.total / outputs.size)}</Text>
                  
                </HStack>
                <HStack>
                  <Text color='gray.500'>{language === 'en' ? 'Total' : 'Toplam'}</Text>
                  <Text color='gray.500'>{outputs && outputs.total}</Text>
                  <Text color='gray.500'>{language === 'en' ? 'Actuator' : 'Aktüatör'}</Text>
                </HStack>
              </VStack>
            )}
      
      </Box>
      
      
    );
};

export default DashboardHomePage;