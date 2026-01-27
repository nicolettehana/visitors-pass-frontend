import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import AddApprovedFirmForm from "../../../forms/firms/AddApprovedFirmForm";

const AddApprovedFirmsPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add Approved Firm</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <AddApprovedFirmForm />
        </Container>
      </Section>
    </Main>
  );
};

export default AddApprovedFirmsPage;
