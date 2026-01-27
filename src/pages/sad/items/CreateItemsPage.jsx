import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreateItemForm from "../../../forms/items/CreateItemForm";

const CreateItemsPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add New Item</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreateItemForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreateItemsPage;
