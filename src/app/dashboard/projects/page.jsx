"use client";

import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/contexts/user-context';
import { useLanguage } from '@/contexts/language-context';
import useFetchData from '@/hooks/useFetchData';
import useCreateData from '@/hooks/useCreateData';
import useUpdateData from '@/hooks/useUpdateData';
import useDeleteData from '@/hooks/useDeleteData';
// import ProjectCard from '@/components/project-card.component';
import ProjectCreateForm from '@/forms/project-create.form';
import { Flex, Text, useToast, Spinner, SkeletonText, Box, Select } from '@chakra-ui/react';
import CardGrid from '@/components/card-grid.component';
import ProjectUsers from '@/components/project-users.component';
import CustomTabs from '@/components/CustomTabs';

import CardLayout from '@/components/card-layout.component';
import ProjectCardContent from '@/card-contents/project.card-content';

const ProjectsPage = () => {
    const { user } = useContext(UserContext);
    const { language } = useLanguage();
    const toast = useToast();
    const { data, loading, error, createData } = useCreateData('/projects/raw/');
    const { data: projects, loading: projectsLoading, error: projectsError, setData: setProjects, refetch } = useFetchData(`/users/projects/${user.id}`);
    const { updateData } = useUpdateData('/projects/raw');
    const { deleteData } = useDeleteData('/projects/raw');
    const [selectedProject, setSelectedProject] = useState(projects && projects.length > 0 ? projects[0].id : null);
    
    useEffect(() => {
        if (projects && !projectsLoading) {
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

    const tabs = [
        {
            label: user && user.auth_id > 3 ? (language === 'en' ? 'New Project' : 'Yeni Proje') : '',
            content: user && user.auth_id > 3 && <ProjectCreateForm onSubmit={handleCreateProject} />
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
                    {projects && (
                        <Select color={'green'} backgroundColor={'rgba(127, 127, 127, 0.2)'} textAlign={'center'} placeholder='Select Project' onChange={(e) => setSelectedProject(e.target.value)} value={selectedProject}>
                            {projects && projects.map((project, index) => (
                                <option key={index} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </Select>
                    )}
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