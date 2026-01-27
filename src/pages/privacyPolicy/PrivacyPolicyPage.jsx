import React from "react";
import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import {
  Container,
  Heading,
  ListItem,
  OrderedList,
  Stack,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

const PrivacyPolicyPage = () => {
  return (
    <Main>
      <Section>
        <Container maxW="container.xl">
          <Stack spacing={8}>
            <Heading size="lg">Privacy Policy</Heading>

            <OrderedList spacing={4}>
              <Stack>
                <ListItem fontWeight="bold">Introduction</ListItem>
                <Text>
                  Welcome to the Quarters Application System for Government of
                  Meghalaya Employees. This system allows you to easily book
                  quarters online. This Privacy Policy explains how we collect,
                  use, disclose, and protect your personal information when you
                  use the quarters booking services.
                </Text>
              </Stack>

              <Stack>
                <ListItem fontWeight="bold">Information we collect</ListItem>
                <Text>
                  To facilitate your quarters booking, we collect necessary
                  personal information, which may include:
                </Text>
                <UnorderedList>
                  <ListItem>
                    Contact Information: Name, Email, Phone Number
                  </ListItem>
                  <ListItem>Address and Identification Details</ListItem>
                  <ListItem>Purpose of Visit</ListItem>
                  <ListItem>Booking Preferences</ListItem>
                </UnorderedList>
              </Stack>

              <Stack>
                <ListItem fontWeight="bold">
                  How We Use Your Information
                </ListItem>
                <Text>
                  We use the information we collect for the following purposes:
                </Text>
                <UnorderedList>
                  <ListItem>
                    Processing and managing your quarters bookings
                  </ListItem>
                  <ListItem>
                    Communicating with you regarding your booking status
                  </ListItem>
                  <ListItem>
                    Providing relevant information about available quarters
                  </ListItem>
                  <ListItem>
                    Improving the booking system and user experience
                  </ListItem>
                </UnorderedList>
              </Stack>

              <Stack>
                <ListItem fontWeight="bold">Data Security</ListItem>
                <Text>
                  We are committed to safeguarding your personal information. We
                  implement industry-standard security practices to protect your
                  data from unauthorized access, disclosure, alteration, or
                  destruction.
                </Text>
              </Stack>

              <Stack>
                <ListItem fontWeight="bold">Your Choices</ListItem>
                <Text>
                  You have the right to review, update, or delete your personal
                  information. You can also withdraw your consent from this
                  privacy policy at any time. Simply log in and visit the
                  "Withdraw Consent" section to make changes.
                </Text>
              </Stack>

              <Stack>
                <ListItem fontWeight="bold">
                  Changes to the Privacy Policy
                </ListItem>
                <Text>
                  We may update this Privacy Policy from time to time. Any
                  changes will take effect immediately upon posting the updated
                  policy on the system.
                </Text>
              </Stack>
            </OrderedList>

            <Text>
              By using the Quarters Application System for Government of
              Meghalaya Employees, you signify your acceptance of this Privacy
              Policy. Please review this policy regularly for any updates.
            </Text>
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default PrivacyPolicyPage;
