"use client";

import React, { useRef, useState } from 'react';
// import emailjs from "@emailjs/browser";
import { useLanguage } from '@/contexts/language-context';
import { Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Heading, Text, Icon } from '@chakra-ui/react';
import { SiMinutemailer } from "react-icons/si";

const ContactForm = () => {
    const { language, changeLanguage, availableLanguages } = useLanguage();
    const [success, setSuccess] = useState(null);
    const ref = useRef();

    const handleSubmit = (event) => {
        event.preventDefault();
        // emailjs
        // .sendForm(
        //     "service_mkyscf7",
        //     "template_sunelkf",
        //     ref.current,
        //     "vmaJcqFyWth3vePr2"
        // )
        // .then(
        //     (result) => {
        //     console.log(result.text);
        //     setSuccess(true);
        //     },
        //     (error) => {
        //     console.log(error.text);
        //     setSuccess(false);
        //     }
        // );
        
    }
   

    return(
        <Box as="form" w="full"  p={4} mb={[0, 0, 0, 0]} borderRadius="md" boxShadow="md" alignContent={'center'} display={'flex'} justifyContent={'center'} alignItems={'center'} >
        
        <VStack as={'form'} w={['300px', '300px', '500px', '500px']} ref={ref} onSubmit={handleSubmit} spacing={4}  mt={[100, 300, 200, 0]} mb={[100, 300, 0, 350]}>
            <Heading as={'h1'}  color={'white'} fontWeight={'200'}> {language === 'en' ? ("Contact") : ("İletişim")}</Heading>
            
            <FormControl id="name" isRequired>
            <FormLabel  color={'white'}>{language === 'en' ? (<>Name: </>) : (<>İsim: </>)}</FormLabel>
            <Input type="text" bgColor={'gray.900'} color={'gray.300'}   fontFamily={'monospace'} name="name" placeholder={language === 'en' ? ("Name/Title") : ("İsim/Ünvan")} />
            </FormControl>

            <FormControl id="email" isRequired>
            <FormLabel  color={'white'}>E-mail: </FormLabel>
            <Input type="email" bgColor={'gray.900'} color={'gray.300'} fontFamily={'monospace'} name="email" placeholder={language === 'en' ? "Enter Your Email" : "Mail Adresinizi Girin"} />
            </FormControl>

            <FormControl id="message" isRequired>
            <FormLabel color={'white'}>{language === 'en' ? (<>Message: </>) : (<>Mesaj: </>)}</FormLabel>
            <Textarea fontFamily={'monospace'}  bgColor={'gray.900'} color={'gray.300'}  name="message" placeholder={language === 'en' ? ("Write Your Message") : ("Mesajınızı Yazın.")} />
            </FormControl>
            <br/>

            <Button w={'full'} bgColor={'#da4ea2'} color={'white'} type="submit" >
                
                {language === 'en' ? (<>Send</>) : (<>Gönder</>)}
                <Icon as={SiMinutemailer} w={6} h={6}/>
            </Button>
            {success && language === 'en' && (<Text as={'p'} color='green'>"Your message has been sent. We'll get back to you soon."</Text>
            
            )}
            {success && language !== 'en' &&(
            "Mesajınız gönderildi. En kısa zamanda dönüş sağlayacağız."
            )}
            
            
        </VStack>
        </Box>
        
    );
}

export default ContactForm;