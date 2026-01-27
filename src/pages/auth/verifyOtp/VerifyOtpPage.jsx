import { Navigate, useLocation } from "react-router-dom";
import VerifyOtpForm from "../../../forms/auth/VerifyOtpForm";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Box, Center, Container } from "@chakra-ui/react";

const VerifyOtpPage = () => {
  // Routers
  const location = useLocation();
  if (!location.state) return <Navigate to="/" />;
  const formData = location.state.formData;
  const otpToken = location.state.otpToken;

  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Center>
            <Box
              bg="paper"
              border="1px"
              borderColor="border"
              rounded="2xl"
              p={8}
              w="sm"
              maxW="sm"
            >
              <VerifyOtpForm formData={formData} otpToken={otpToken} />
            </Box>
          </Center>
        </Container>
      </Section>
    </Main>
  );
};

export default VerifyOtpPage;
