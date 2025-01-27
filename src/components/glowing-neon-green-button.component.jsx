"use client";

import {Button} from "@chakra-ui/react";

const GlowingGreenNeonButton = ({ children, ...props }) => {
    return (
        <Button
            {...props}
            bgGradient="linear(to-r, green.400, green.700)"
            color="gray.300"
            _hover={{
                bgGradient: "linear(to-r, green.500, green.600)",
                boxShadow: "0 0 40px rgba(0, 255, 0, 0.7)",
            }}
            _active={{
                bgGradient: "linear(to-r, green.500, green.600)",
                boxShadow: "0 0 40px rgba(0, 255, 0, 0.7)",
            }}
            boxShadow="0 0 40px rgba(0, 255, 0, 0.2)"
        >
            {children}
        </Button>
    );
};

export default GlowingGreenNeonButton;