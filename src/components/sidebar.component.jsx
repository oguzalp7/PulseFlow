"use client"

import React, { useState, useContext } from 'react'
import {
    Flex,
    Text,
    IconButton,
    Divider,
    Avatar,
    Heading,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    Link
} from '@chakra-ui/react'

import {
    FiMenu,
    FiHome,
    FiCalendar,
    FiUser,
    FiLogOut,
    FiPhoneOutgoing,
    FiCast,
    FiSettings,
    FiToggleRight
} from 'react-icons/fi'

import {useLanguage} from '@/contexts/language-context';
import UserContext from '@/contexts/user-context';
import { useRouter } from 'next/navigation';
import { AiOutlineProject } from "react-icons/ai";
import { LuBrainCircuit } from "react-icons/lu";
import { GiRobotGrab } from "react-icons/gi";
import { IoIosSwitch } from "react-icons/io";
import { MdOutlineMonitorHeart, MdMonitorHeart } from "react-icons/md";



import NextLink from 'next/link';


const NavHoverBox = ({ title, icon, description }) => {
    return (
        <>
            <Flex
                pos="absolute"
                mt="calc(100px - 7.5px)"
                ml="-10px"
                width={0}
                height={0}
                borderTop="10px solid transparent"
                borderBottom="10px solid transparent"
                borderRight="10px solid #82AAAD"
            />
            <Flex
                h={200}
                w={200}
                //w="100%"
                flexDir="column"
                alignItems="center"
                justify="center"
                backgroundColor="black"
                borderRadius="10px"
                color="rgba(0, 0, 0, 0.1)"
                textAlign="center"
            >
                <Icon as={icon} fontSize="3xl" mb={4} />
                <Heading size="md" fontWeight="normal">{title}</Heading>
                <Text color='gray.300'>{description}</Text>
            </Flex>
        </>
    )
}

const NavItem = ({ title, icon, active, description, navSize, href }) => {

    return (
        <Flex
            mt={30}
            flexDir="column"
            w="100%"
            alignItems={navSize == "small" ? "center" : "flex-start"}
        >
            <Menu placement="right">
                <Link
                    as={NextLink}
                    backgroundColor={active && "#AEC8CA"}
                    p={3}
                    borderRadius={8}
                    href={href}
                    _hover={{ textDecor: 'none', backgroundColor: "rgba(0, 255, 0, 0.2)" }}
                    w={navSize == "large" && "100%"}
                >
                    <MenuButton w="100%">
                        <Flex>
                            <Icon as={icon} fontSize="xl" color={active ? "green" : "gray.300"} />
                            <Text color={active ? "green" : 'gray.300'} ml={5} display={navSize == "small" ? "none" : "flex"}>{title}</Text>
                        </Flex>
                    </MenuButton>
                </Link>

                {/* <MenuList
                    py={0}
                    border="none"
                    w={200}
                    h={200}
                    ml={5}
                >
                    <NavHoverBox title={title} icon={icon} description={description} />
                </MenuList> */}
            </Menu>

        </Flex>
    )
}

const Sidebar = () => {
    const [navSize, changeNavSize] = useState("small")
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const {user} = useContext(UserContext);
    
    const roles_en = ["Basic", "Standard", "Dealer", "La Vittoria Staff", "La Vittoria Developer"];
    const roles_tr = ["Basit", "Standart", "Teknik Bayii", "La Vittoria Personel", "La Vittoria Geliştirici"];
    const auth_index = user ? user.auth_id - 1 : null;
    
    return (
        <Flex
            pos="sticky"
            left="5"
            //h={navSize == "small" ? "120vh" : "130vh"}
            
            marginTop="2.5vh"
            boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
            backgroundColor="rgba(255, 255, 255, 0.05)"
            borderRadius={navSize == "small" ? "15px" : "30px"}
            w={navSize == "small" ? "75px" : "200px"}
            flexDir="column"
            justifyContent="space-between"
            overflowY={'auto'}
            //maxH={"100vh"}
        >
            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                as="nav"
            >
                <IconButton
                    background="none"
                    color="gray.300"
                    mt={5}
                    _hover={{ background: 'none' }}
                    icon={<FiMenu />}
                    onClick={() => {
                        if (navSize == "small")
                            changeNavSize("large")
                        else
                            changeNavSize("small")
                    }}
                />
                
                <NavItem navSize={navSize} icon={FiHome} title={language == 'en' ? 'Dashboard' : 'Pano'} href={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={AiOutlineProject} title={language == 'en' ? 'Projects' : 'Projeler'} href={'/dashboard/projects'}/>
                <NavItem navSize={navSize} icon={LuBrainCircuit} title={language == 'en' ? 'Devices' : 'Cihazlar'} href={'/dashboard/devices'}/>
                <NavItem navSize={navSize} icon={GiRobotGrab } title={language == 'en' ? 'Actuators' : 'Aktüatörler'} href={'/dashboard/actuators'}/>
                <NavItem navSize={navSize} icon={IoIosSwitch  } title={language == 'en' ? 'Relays' : 'Röleler'} href={'/dashboard/relays'}/>
                <NavItem navSize={navSize} icon={MdMonitorHeart} title={language == 'en' ? 'Internal Sensors' : 'Dahili Sensörler'}  href={'/dashboard/internal-sensors'}/>
                <NavItem navSize={navSize} icon={MdOutlineMonitorHeart} title={language == 'en' ? 'External Sensor' : 'Harici Sensörler'}  href={'/dashboard/internal-sensors'}/>

                <NavItem navSize={navSize} icon={FiCalendar} title={language == 'en' ? 'Automations' : 'Otomasyonlar'} href={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiUser} title={language == 'en' ? 'User' : 'Kullanıcı'} href={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiSettings} title={language == 'en' ? 'Settings' : 'Ayarlar'} href={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiPhoneOutgoing} title={language == 'en' ? 'Contact' : 'İletişim'} href={'/dashboard/home'}/>
                <NavItem navSize={navSize} icon={FiLogOut} title={language == 'en' ? 'Logout' : 'Çıkış'}  href={'/dashboard/logout'}/> 
                
                
                {/* 
                <NavItem navSize={navSize} icon={IoPawOutline} title="Animals" />
                <NavItem navSize={navSize} icon={FiDollarSign} title="Stocks" />
                <NavItem navSize={navSize} icon={FiBriefcase} title="Reports" />
                <NavItem navSize={navSize} icon={FiLock} title="Settings" /> */}
            </Flex>

            <Flex
                p="5%"
                flexDir="column"
                w="100%"
                alignItems={navSize == "small" ? "center" : "flex-start"}
                mb={4}
            >
                <Divider display={navSize == "small" ? "none" : "flex"} />
                <Flex mt={4} align="center">
                    
                    <Flex flexDir="column" ml={4} display={navSize == "small" ? "none" : "flex"}>
                        {user && (
                            <>
                             <Heading color='gray.300' as="h3" size="sm">{user && user.name ? user.name : ""}</Heading>
                             <Text color='gray.300' size="xs">{language === 'en' ? `${roles_en[auth_index]}`:`${roles_tr[auth_index]}`}</Text>
                            </>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Sidebar;