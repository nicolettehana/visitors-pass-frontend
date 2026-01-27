import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreateQuarterForm from "../../../forms/quarters/CreateQuarterForm";

const CreateQuartersPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Create Quarter</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreateQuarterForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreateQuartersPage;
