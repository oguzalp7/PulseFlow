"use client";

import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';

import ButtonTriggeredModal from '@/components/modal.component';

// import ProjectCard from '@/components/project-card.component';
import ProjectCreateForm from '@/forms/project-create.form';
import { Flex, Text, useToast, Spinner, SkeletonText, Box, Select, Stack } from '@chakra-ui/react';
import CardGrid from '@/components/card-grid.component';
import ProjectUsers from '@/components/project-users.component';
import InvitationsComponent from '@/components/invitations.component';
import CustomTabs from '@/components/CustomTabs';

import CardLayout from '@/components/card-layout.component';
import ProjectCardContent from '@/card-contents/project.card-content';
import ProjectInvitationForm from '@/forms/project-invitation.form';

import { EmailIcon } from "@chakra-ui/icons";
import { MdGroupAdd } from "react-icons/md";

const ProjectsPage = () => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const toast = useToast();
    const { data, loading, error, createData } = useCreateData('/projects/raw/');
    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch } = useFetchData(`/users/projects/${user.id}`);
    const { updateData } = useUpdateData('/projects/raw');
    const { deleteData } = useDeleteData('/projects/raw');
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);
    const [invitationURL, setInvitationURL] = useState(`/projects/${selectedProject}/invite`)
    const { data: invitations, loading: invitationsLoading, error: invitationsError, createData: createInvitation } = useCreateData(invitationURL);

    useEffect(() => {
        setInvitationURL(`/projects/${selectedProject}/invite`);
    }, [selectedProject]);

    useEffect(() => {
        if (projects && !projectsLoading && projects[0] && projects[0].id) {
            setSelectedProject(projects[0].id);
        }
    }, [projects, projectsLoading, projectsError]);

    const handleCreateProject = async (formData) => {
        await createData(formData);
        if (!error) {
            toast({
                title: language === 'en' ? data.name + ' created successfully. 🎊' : data.name + ' başarıyla oluşturuldu. 🎊',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            refetch(); // Re-fetch projects after creation
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error creating new project.' : 'Yeni proje oluşturulurken hata oluştu.',
                description: language === 'en' ? 'Another project with the same name exists, please try again with a different name.' : 'Aynı isimde farklı bir proje mevcut, lütfen farklı bir isimle deneyiniz.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleUpdateProject = async (id, updatedProject) => {
        await updateData(id, updatedProject);
        if (!error) {
            toast({
                title: language === 'en' ? 'Project updated successfully.' : 'Proje başarıyla güncellendi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Update the local state
            const updatedProjects = projects.map((project) =>
                project.id === id ? { ...project, ...updatedProject } : project
            );
            setProjects(updatedProjects);
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error updating project.' : 'Proje güncellenirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleDeleteProject = async (id) => {
        await deleteData(id);
        if (!error) {
            toast({
                title: language === 'en' ? 'Project deleted successfully.' : 'Proje başarıyla silindi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // Update the local state
            const updatedProjects = projects.filter((project) => project.id !== id);
            setProjects(updatedProjects);
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error deleting project.' : 'Proje silinirken hata oluştu.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    useEffect(() => {
        if (projects && projects.length > 0) {
            // Set the first project as the default selected option
            document.querySelector('select').value = projects[0].id;
        } else if (projects && projects.length === 0) {
            document.querySelector('select').value = '';
        }
    }, [projects]);

    const handleSubmitInvitation = async (formData) => {
        // console.log(formData)
        // console.log(selectedProject)
        
        await createInvitation(formData);
        console.log(invitationsError);
        if (!invitationsError) {
            toast({
                title: language === 'en' ? 'Project invitation sent successfully.' : 'Proje davetiyesi gönderildi.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } else {
            console.log(error);
            toast({
                title: language === 'en' ? 'Error sending project invitation.' : 'Proje gönderilemedi.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }


    const optionStyle = {
        backgroundColor: '#1A202C', // dark background
        color: '#68D391',           // green text
        padding: '8px',
        fontWeight: 'bold',
    };

    const tabs = [
        {
            label: user && user.auth_id > 3 ? (language === 'en' ? 'New Project' : 'Yeni Proje') : '',
            content: user && user.auth_id > 3 && <ProjectCreateForm onSubmit={handleCreateProject} />
        },
        {
            label: language === 'en' ? 'Project Invitations' : 'Proje Davetleri',
            content: <InvitationsComponent />
        },
        {
            label: language === 'en' ? 'Projects' : 'Projelerim',
            content: (
                <CardGrid>
                    {projectsLoading && (
                        <Box padding='6' boxShadow='lg' bg='gray.700'>
                            <Spinner color='green' size={'xl'} />
                            <SkeletonText mt='4' noOfLines={4} spacing='4' skeletonHeight='2' />
                        </Box>
                    )}
                    {projects && projects.map((project, index) => (
                       // <ProjectCard key={index} project={project} onUpdate={handleUpdateProject} onDelete={handleDeleteProject} />
                        <CardLayout 
                            key={index} 
                            cardChildren={<ProjectCardContent project={project} />} 
                            FormComponent={ProjectCreateForm}
                            onEdit={handleUpdateProject}
                            onDelete={handleDeleteProject}
                            data={project}
                        />
                    ))}
                </CardGrid>
            )
        },
        {
            label: language === 'en' ? 'Project Users' : 'Proje Kullanıcıları',
            content: (
                <>
                    {projectsLoading && <Spinner color='green' size={'xl'} />}
                    <Stack flexDirection={['column', 'row']} justifyContent={'space-between'} alignItems={'center'} width={'100%'}>
                        {projects && (
                        <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'}  onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                            <option style={optionStyle} value=''>{language === 'en' ? 'Select Project' : 'Proje Seçiniz.'}</option>
                            {projects && projects.map((project, index) => (
                                <option style={optionStyle} key={index} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </Select>
                    )}
                    <br/>
                    {selectedProject && (
                        <ButtonTriggeredModal
                            buttonTitle={language === 'en' ? 'Invite User' : 'Davet Et'} 
                            leftIcon={<MdGroupAdd />} 
                            modalTitle={language === 'en' ? 'Invitation Form' : 'Davetiye Formu'}
                            children={<ProjectInvitationForm projects={projects} selectedProject={selectedProject} onSubmit={handleSubmitInvitation}/>}
                        />)}
                    </Stack>
                    {selectedProject && <ProjectUsers projectId={selectedProject} />}
                </>
            )
        },
        
    ];

    if(user.auth_id < 3){
        tabs.shift();
    }

    return <CustomTabs tabs={tabs} />;
};

export default ProjectsPage;