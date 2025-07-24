"use client"


import { Box } from "@chakra-ui/react";



const NeonToggleSwitch = ({ isOn, toggleSwitch, onColor='rgba(0, 255, 0, 0.5)', offColor='rgba(255, 0, 0, 0.5)', outerBrigthness=30, innerBrigthness=15, outerWidth=["4em", "5em"], outerHeight=["2em", "2.2em", "2.4em", "2.6em"], innerWidth=["1.5em", "1.8em"], innerHeight=["1.5em", "1.8em"] }) => {
    return (
      <Box position="relative" display="inline-block" width="4em" height="2em" onClick={toggleSwitch}>
        <Box
          position="absolute"
          top="0.5em"
          left="0.5em"
          width={outerWidth}//"4em"
          height={outerHeight} //"2em"
          overflow="hidden"
          borderRadius="1em"
          bg={isOn ? 'gray.900' : 'gray.900'}
          boxShadow={isOn ? `0 0 ${outerBrigthness}px ${onColor}` : `0 0 ${outerBrigthness}px ${offColor}`}
          cursor="pointer"
          transition="all 0.3s"
        >
          
          <Box
            position="absolute"
            top="50%"
            left={isOn ? 'calc(100% - 2em)' : '0.5em'}
            transform="translateY(-50%)"
            width={innerWidth} //"1.5em"
            height={innerHeight}//"1.5em"
            borderRadius="50%"
            bg={isOn ? `${onColor}`: `${offColor}`}
            boxShadow={isOn ? `0 0 ${innerBrigthness}px ${onColor}` : `0 0 ${innerBrigthness}px ${offColor}`}
            transition="all 0.3s"
          />
        </Box>
      </Box>
    );
};

export default NeonToggleSwitch;