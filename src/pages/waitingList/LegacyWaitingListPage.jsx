import {
  Container,
  Heading,
  Link,
  ListItem,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import legacyWaitingListPdf from "../../assets/pdf/legacy_waiting_list.pdf";

const LegacyWaitingListPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl" py={8}>
          <Stack spacing={4}>
            <Heading size="lg">Waiting List</Heading>

            <UnorderedList>
              <ListItem>
                <Link href={legacyWaitingListPdf} target="_blank">
                  Waiting List 1
                </Link>
              </ListItem>
              <ListItem>
                <Link href={legacyWaitingListPdf} target="_blank">
                  Waiting List 2
                </Link>
              </ListItem>
              <ListItem>
                <Link href={legacyWaitingListPdf} target="_blank">
                  Waiting List 3
                </Link>
              </ListItem>
              <ListItem>
                <Link href={legacyWaitingListPdf} target="_blank">
                  Waiting List 4
                </Link>
              </ListItem>
              <ListItem>
                <Link href={legacyWaitingListPdf} target="_blank">
                  Waiting List 5
                </Link>
              </ListItem>
            </UnorderedList>
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default LegacyWaitingListPage;
