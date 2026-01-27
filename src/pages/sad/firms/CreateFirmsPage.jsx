import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreateFirmForm from "../../../forms/firms/CreateFirmForm";

const CreateFirmsPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add New Firm</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreateFirmForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreateFirmsPage;
