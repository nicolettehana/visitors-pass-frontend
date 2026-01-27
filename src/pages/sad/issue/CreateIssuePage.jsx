import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreatePurchaseForm from "../../../forms/purchase/CreatePurchaseForm";
import CreateIssueForm from "../../../forms/issue/CreateIssueForm";

const CreateIssuePage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">New Issue</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreateIssueForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreateIssuePage;
