import { Container, Heading } from "@chakra-ui/react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import CreatePurchaseOrderForm from "../../../forms/purchase/CreatePurchaseOrderForm";

const CreatePurchasePage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Heading size="md">Add new purchase order</Heading>
        </Container>
      </Section>

      <Section>
        <Container maxW="container.xl">
          <CreatePurchaseOrderForm />
        </Container>
      </Section>
    </Main>
  );
};

export default CreatePurchasePage;
