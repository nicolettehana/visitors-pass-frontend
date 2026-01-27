import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Heading,
  Stack,
  Badge,
} from "@chakra-ui/react";
import registrationVid from "../../assets/manual/user_registration_sign_in.mp4";
import applicationVid from "../../assets/manual/applying_for_quarters.mp4";

const ManualPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Stack spacing={8}>
            <Heading size="lg">Manual</Heading>
            {/* "teal.400",  "green.400", "lime.400",
            "cyan.400", "facebook.400", "messenger.400", "whatsapp.400",
            "linkedin.400", "twitter.400", "gray.500", "gray.600", "cyan.500",
            "red.500", "purple.500", "orange.500", "indigo.500", "pink.500",
            "cyan.500", */}
            {/* <Badge colorScheme="red">Hello</Badge> */}
            {/* <Accordion allowToggle>
              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Heading size="md" flex="1" textAlign="left">
                      User Registration & Sign In
                    </Heading>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box as="video" w="full" controls>
                    <source src={registrationVid} type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <h2>
                  <AccordionButton>
                    <Heading size="md" flex="1" textAlign="left">
                      Applying for Quarters
                    </Heading>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Box as="video" w="full" controls>
                    <source src={applicationVid} type="video/mp4" />
                    Your browser does not support the video tag.
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion> */}
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default ManualPage;
