import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Hide,
  HStack,
  UnorderedList,
  SimpleGrid,
  Stack,
  Text,
  ListItem,
  Link as CLink,
  Show,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignInForm from "../../forms/auth/SignInForm";
import quartersImg from "../../assets/quarters6.png";
import inventoryImg from "../../assets/inventory4.png";
//import inventoryImg from "../../assets/inventoryy.jpg";
import MdIcon from "../../components/core/MdIcon";
import { useGetXsrfToken } from "../../hooks/authQueries";

const HomePage = () => {
  // Queries
  // const xsrfQuery = useGetXsrfToken();

  return (
    <Main bg="white">
      <Section bg="white">
        <Container maxW="container.xl" bg="white">
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={0}>
            {/* LHS */}
            <Hide below="lg">
              <Stack
                spacing={4}
                //mt={16}
                backgroundImage={`url(${inventoryImg})`}
                minH="100%"
                backgroundSize="cover"
                backgroundPosition="center"
              >
                <Stack spacing={16}>
                  <Stack
                    spacing={16}
                    //backgroundImage={inventoryImg}
                    backgroundSize="cover"
                    backgroundPosition="center"
                  >
                    <Stack spacing={3} color="brand.700">
                      <Heading size="xl">Stock Keeping System</Heading>
                      <Text fontSize="2xl">
                        <strong>Secretariat Administration Department</strong>{" "}
                        <br />
                        <Text fontSize="xl">
                          <strong>Government Of Meghalaya</strong>
                        </Text>
                      </Text>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
            </Hide>

            {/* RHS */}
            <Center>
              <VStack spacing={8}>
                <Box
                  //bg="brand.100"
                  //bg="paper"
                  // bg="white"
                  border="1px"
                  borderColor="border"
                  rounded="2xl"
                  p={8}
                  w="sm"
                  maxW="sm"
                  shadow="lg"
                >
                  <SignInForm />
                </Box>
              </VStack>
            </Center>
          </SimpleGrid>
        </Container>
      </Section>
    </Main>
  );
};

export default HomePage;
