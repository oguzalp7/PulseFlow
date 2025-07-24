import ContactForm from "@/components/contact-form.component";
import { Box } from "@chakra-ui/react";
import AddressContainer from "@/components/address-container.component";
const ContactPage = () => {
    return (
        <Box p={4} m={4} borderRadius="md" boxShadow="md" >
            <ContactForm />
            <AddressContainer />
        </Box>
    );
}

export default ContactPage;