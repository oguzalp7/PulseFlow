"use client";

import { useState } from "react";
import { Input, InputGroup, InputRightElement, Button, FormLabel, Text, VStack, Box, IconButton, Icon, FormControl } from "@chakra-ui/react";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";

const PasswordInput = ({ label, placeholder, name, value, onChange }) => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
  
    return (
      <FormControl isRequired>
        <FormLabel htmlFor={name}>
          <Text  as="b">
            {label}:
          </Text>
        </FormLabel>
        <InputGroup>
          <Input
            pr="10rem"
            type={show ? "text" : "password"}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
          />
          <InputRightElement width="4.5rem">
            {/* <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Gizle" : "Göster"}
            </Button> */}
            <IconButton  h="1.75rem" size="sm" onClick={handleClick} icon={show ? <BiSolidHide/> : <BiSolidShow/> }/>
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
};
  
export default PasswordInput;