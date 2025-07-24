"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Button
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react';
import { useLanguage } from '@/contexts/language-context';

const ButtonTriggeredModal = ({
    buttonTitle,
    leftIcon,
    modalTitle,
    children,
    childProps = {}
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { language } = useLanguage();

    return (
        <div>
            <Button
                variant='outline'
                colorScheme='green'
                aria-label='Send Invitation'
                leftIcon={leftIcon}
                onClick={onOpen}
            >
                {buttonTitle}
            </Button>
            <Modal  isOpen={isOpen} onClose={onClose}>
                <ModalOverlay 
                    bg='blackAlpha.300'
                    backdropFilter='blur(3px) ' //hue-rotate(180deg)
                    //bg='none'
                    //backdropFilter='auto'
                    backdropInvert='80%'
                    // backdropBlur='2px'
                />
                <ModalContent bgImage={'/images/bg.jpeg'}>
                    <ModalHeader textAlign={'center'} color={'gray.300'}>{modalTitle}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {children
                            ? React.isValidElement(children)
                                ? React.cloneElement(children, { ...childProps, onClose })
                                : children
                            : (language === 'en' ? 'No Content.' : 'İçerik Bulunamadı.')}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' onClick={onClose}>
                            {language === 'en' ? 'Close' : 'Kapat'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default ButtonTriggeredModal