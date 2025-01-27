"use client";

import {Button} from "@chakra-ui/react";

const GlowingRedNeonButton = ({ children, ...props }) => {
    return (
        <Button
            {...props}
            bgGradient="linear(to-r, red.400, red.700)"
            color="gray.300"
            _hover={{
                bgGradient: "linear(to-r, red.500, red.600)",
                boxShadow: "0 0 40px rgba(255, 0, 0, 0.8)",
            }}
            _active={{
                bgGradient: "linear(to-r, red.500, red.600)",
                boxShadow: "0 0 40px rgba(255, 0, 0, 0.8)",
            }}
            boxShadow="0 0 40px rgba(255, 0, 0, 0.3)"
        >
            {children}
        </Button>
    );
};

export default GlowingRedNeonButton;