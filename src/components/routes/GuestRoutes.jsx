import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import GuestNavbar from "../navigations/guest/GuestNavbar";
import GuestNavDrawer from "../navigations/guest/GuestNavDrawer";
import Footer from "./Footer";
import {
  Center,
  Spinner,
  Stack,
  useDisclosure,
  Container,
  useColorModeValue,
} from "@chakra-ui/react";
import ScrollToTop from "./ScrollToTop";
import { useFetchUsersProfile } from "../../hooks/userQueries";

const GuestRoutes = () => {
  // Disclosures
  const drawer = useDisclosure();

  // Hooks
  //const contianerBg = useColorModeValue("brand.300", "brand.700");
  const contianerBg = useColorModeValue("brand.100", "white");
  //const stackBg = useColorModeValue("brand.50", "brand.950");
  const stackBg = useColorModeValue("white", "white");

  // Queries
  const profileQuery = useFetchUsersProfile();

  if (profileQuery.isPending) {
    return (
      <Center minH="100dvh">
        <Spinner thickness="4px" size="xl" color="brand.600" />
      </Center>
    );
  }

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "USER")
    return <Navigate to="/user/dashboard" />;

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "CH")
    return <Navigate to="/ch/dashboard" />;

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "EST")
    return <Navigate to="/est/dashboard" />;

  if (profileQuery.isSuccess && profileQuery?.data?.data?.role === "ADMIN")
    return <Navigate to="/admin/logs" />;

  return (
    <>
      <ScrollToTop />
      <GuestNavDrawer isOpen={drawer.isOpen} onClose={drawer.onClose} />
      <Container bg={contianerBg} w="full" maxWidth="none">
        <Stack
          minH="100dvh"
          justifyContent="space-between"
          spacing={8}
          bg={stackBg}
          mx={{ base: "0%", md: "5%" }}
          px={{ base: 0, md: 4 }}
        >
          {/* <Stack spacing={8}> */}
          <GuestNavbar onOpen={drawer.onOpen} />
          <Outlet />
          {/* </Stack> */}
          <Footer />
        </Stack>
      </Container>
    </>
  );
};

export default GuestRoutes;
