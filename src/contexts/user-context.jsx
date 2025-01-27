"use client";

import { createContext, useState } from "react";
import { pfClient } from "@/pulseflowApiClient";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import Cookies from 'js-cookie';
import { useLanguage } from "@/contexts/language-context";


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const toast = useToast();
    const {language, changeLanguage, availableLanguages} = useLanguage();
    const login = async (username, password) => {
        const data = new URLSearchParams();
        data.append("grant_type", "");
        data.append("username", username);
        data.append("password", password);
        data.append("scope", "");
        data.append("client_id", "");
        data.append("client_secret", "");

        try {
            const response = await pfClient.post("/auth/token", data, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            });
            console.log(response.data)
            pfClient.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            localStorage.setItem('token', response.data.access_token);
            setUser(response.data.user);

            const preferredLanguage = response.data.user.preferred_language || Cookies.get('language') || 'tr';
            
            changeLanguage(preferredLanguage);

            router.push('/dashboard/home')
        } catch (error) {
            console.log(error)
            toast({
                title: 'TR: Giriş Başarısız. / EN: Login Failed.',
                description: JSON.stringify(error),
                status: 'error',
                //duration: 9000,
                isClosable: true,
            })
        }
    };
    
    const logout = () => {
        setUser(null);
        delete pfClient.defaults.headers.common['Authorization']
        router.push('/')
    };
    
    return (
        <UserContext.Provider value={{ user, login, logout }}>
        {children}
        </UserContext.Provider>
    );
    }

export default UserContext;