// CircleButton.js
"use client";

import { Box, Button } from "@chakra-ui/react";



const CircleButton = ({ relay, clickCB }) => {
    const intensity = relay.state ? 0.8 : 0.1;
    const color = relay.relay_type === 'start' ? `rgba(0, 255, 0, ${intensity})` : `rgba(255, 0, 0, ${intensity})`;

  return (
    <Box
      className="outer"
      position="relative"
      margin="0 30px"
      height="5em"
      width="5em"
      borderRadius="full"
      bg={color}
      boxShadow={`0 0 30px ${color}`}
      onClick={clickCB}
    >
      <Button
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="4em"
        width="4em"
        borderRadius="full"
        bg={color}//{isStart ? "#0e9c13" : "#781616"}
        color={relay.state === 1 ? "gray.800" : "#f2f2f2"}
        fontSize="20px"
        letterSpacing="1px"
        textTransform="uppercase"
        zIndex={9}
        boxShadow={`0 0 30px ${color}`}
      >
        {relay.relay_type}
      </Button>
      <Box
        as="span"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="100%"
        width="100%"
        bg="inherit"
        borderRadius="full"
        boxShadow={`0 0 30px ${color}`}
      />
      <Box
        as="span"
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        height="100%"
        width="100%"
        bg="inherit"
        borderRadius="full"
        boxShadow={`0 0 30px ${color}`}
      />
    </Box>
  );
};

export default CircleButton;