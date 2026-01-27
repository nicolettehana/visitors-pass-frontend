import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import UpdateQuarterForm from "../../../forms/quarters/UpdateQuarterForm";
import { Navigate, useLocation } from "react-router-dom";

const UpdateQuartersPage = () => {
  // Router
  const location = useLocation();
  if (!location.state) return <Navigate to="/est/quarters" />;
  const rowState = location.state.rowState;

  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Update Quarter</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <UpdateQuarterForm rowState={rowState} />
        </Container>
      </Section>
    </Main>
  );
};

export default UpdateQuartersPage;
