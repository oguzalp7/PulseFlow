"use client"

import React from 'react'

import LandingPageHeader from '@/components/landing-page/header.component'
import { Box, Text, Stack } from '@chakra-ui/react'
import LandingPageLayout from '@/components/landing-page/layout.component'
import LandingPageAdsContainer from '@/components/landing-page/ads-container.component'
import Footer from '@/components/footer.component'

import LandingPageContent from '@/components/landing-page/content.component'

const Content = () => {
    return (
        <Stack flex={1} alignItems="center" justifyContent="center" p={4}>
            <Text fontSize="2xl" color="gray.700" textAlign="center">
                This is a testing page for Pulse Flow.
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            <Text fontSize="md" color="gray.500" textAlign="center">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorem culpa facilis illo sit, possimus harum beatae quae suscipit voluptas consectetur illum deserunt explicabo omnis inventore temporibus reprehenderit quos sint veniam?
            </Text>
            
        </Stack>
    )
}

const Testing = () => {
  return (
    <Box p={4}>
        <LandingPageHeader/>
        <LandingPageLayout>
            <LandingPageAdsContainer imageSrc="/images/ads.png"  rotate={0} isLeft={true}/>
            <LandingPageContent>
                <Content />
            </LandingPageContent>
            <LandingPageAdsContainer imageSrc="/images/ads.png" rotate={0} isLeft={false}/>
        </LandingPageLayout>
        <Footer/>
    </Box>
  )
}

export default Testing