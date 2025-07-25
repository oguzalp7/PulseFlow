"use client";

import React, {useContext, useEffect, useState} from 'react';

import UserContext from '@/contexts/user-context';
import {useLanguage} from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';

import { Box, Flex, Stack, HStack, Select, Spinner, Skeleton, VStack, IconButton, Text, Icon, Button } from "@chakra-ui/react";
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'

import { GrNext, GrPrevious  } from "react-icons/gr";
import { optionStyle } from '@/utils';

import ExternalSensorContainer from '@/components/external-sensor-container.component';
import CardGrid from '@/components/card-grid.component';
import SealedRemoteControlCard from '@/components/sealed-remote-control-card.component';
import SwitchRemoteControlCard from '@/components/switch-remote-control-card.component';

import { useRouter } from "next/navigation";
import { LuSearchX } from "react-icons/lu";
import { ImStack } from "react-icons/im";
import { MdBuild , MdCall } from "react-icons/md"

const DashboardHomePage = () => {
    const { user } = useContext(UserContext) || {};
    const router = useRouter();
    const { language } = useLanguage();
    const [showPagination, setShowPagination] = useState(false);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(6);
    
    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch: refetchProjects } = useFetchData(`/users/projects/${user.id}`);
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);
    
    const handleIncreasePage = () => setPage(page + 1);

    const handleDecreasePage = () => setPage(page - 1);

    const [isRefreshing, setIsRefreshing] = useState(false);


    // projects fetching
    useEffect(() => {
      if(projects  && !projectsLoading && projects[0] && projects[0].id){ 
        
        setSelectedProject(projects[0].id);
      }else{
        setSelectedProject(null);
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

    

    // fetching outputs here
    const { data: outputs, loading: outputsLoading, error: outputsError, refetch: fetchOutputs } = useFetchData(selectedProject ? `/outputs/project/${selectedProject}/actuator_cards?outOfOrder=false&page=${page}&size=${limit}` : null);

    useEffect(() => {
      const interval = setInterval(() => {
        if (outputs && outputs.actuator_cards) {
          setIsRefreshing(true);
        }
        fetchOutputs().finally(() => setIsRefreshing(false));
      }, 15000); // 30000 milliseconds = 30 seconds

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [fetchOutputs, outputs]);

    useEffect(() => {
      if(outputs && outputs.total >= outputs.page * outputs.size ) {
        setShowPagination(true);
      } else {
        setShowPagination(false);
      }
    }, [selectedProject, outputs]);

    if(!projectsLoading  && selectedProject === null) {
      // router.push('/dashboard/projects');
      return (
        <Box p={4} bgColor={'rgba(0, 0, 0, 0.1)'} borderRadius="md">
          <Flex align='center' justify='center' direction='column'>
            <Icon as={LuSearchX} boxSize={10} color='gray.500' />
            <Text color='gray.500' fontSize='lg' mt={2}>{language === 'en' ? 'No projects found.' : 'Hiç proje bulunamadı.'}</Text>
            <Text color='gray.500' fontSize='md'>{language === 'en' ? 'Either check for project invitations, or contact us for creating a project.' : 'Davetiye kontrol edin veya bir proje oluşturmak için bizimle iletişime geçin.'}</Text>
            <Flex mt={4} justify='center'>
              {/* <IconButton
                colorScheme='green'
                variant='solid'
                onClick={() => router.push('/dashboard/projects')}
                icon={<ImStack />}
                aria-label={language === 'en' ? 'Go to Projects' : 'Projeler sayfasına git'}
              /> */}
              <Button onClick={() => router.push('/dashboard/projects')} leftIcon={<ImStack />} colorScheme='green' variant='solid' ml={2}>
                {language === 'en' ? 'Go to Projects' : 'Projeler sayfasına git'}
              </Button>
              <Button onClick={() => router.push('/dashboard/contact')} leftIcon={<ImStack />} colorScheme='green' variant='solid' ml={2}>
                {language === 'en' ? 'Go to Contact' : 'İletişim sayfasına git'}
              </Button>
            </Flex>

          </Flex>
        </Box>
      );
    }else{
      return (
      
        <Box p={4} bgColor={'rgba(0, 0, 0, 0.1)'} borderRadius="md">
        
          <HStack mt={2} spacing={4} align='center' justify='center'>
              {projectsLoading && (
                <Flex align='center' justify='center' direction='column'>
                  <Spinner size="xl" color="green.500" />
                  <Skeleton height="20px"/>
                  {/* <SkeletonText mt={4} noOfLines={4} spacing="4" /> */}
                </Flex>
              )}
              {projects && !projectsLoading && (
                <Select w={'md'} color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'}  onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                  <option style={optionStyle} value=''>{language === 'en' ? 'Select Project' : 'Proje Seçiniz.'}</option>
                  {projects && projects.map((project, index) => (
                    <option style={optionStyle} key={index} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </Select>
              )}
              
          </HStack>
          
          <Accordion allowToggle bgColor={'rgba(255, 255, 255, 0.1)'} mt={4} mb={4} borderRadius="md" >
            <AccordionItem>
              <h2>
                <AccordionButton color={'white'} _expanded={{ bg: 'green.800', color: 'white' }} _hover={{ bg: 'green.900' }}>
                  <Box color={'white'} as='span' flex='1' textAlign='center'>
                    <Text color={'white'} fontSize="lg" fontWeight="bold">{language === 'en' ? 'Sensors' : 'Sensörler'}</Text>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <ExternalSensorContainer project={selectedProject} />
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <CardGrid>
            {outputsLoading && !outputs ? (
              <Flex align='center' justify='center' direction='column'>
                <Spinner size="xl" color="green.500" />
                <Skeleton height="20vh"/>
              </Flex>
            ) : (
              <>
                {isRefreshing && (
                  <Spinner size="sm" color="green.500" position="absolute" top={2} right={2} />
                )}
                {outputs && outputs.actuator_cards && outputs.actuator_cards.map((output) =>
                  output.relays[0].relay_type === 'toggle' ? (
                    <SwitchRemoteControlCard key={output.id} output={output} loading={false} projectId={selectedProject} />
                  ) : (
                    <SealedRemoteControlCard key={output.id} output={output} loading={false} projectId={selectedProject} />
                  )
                )}
              </>
            )}
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
    }
    
    
};

export default DashboardHomePage;