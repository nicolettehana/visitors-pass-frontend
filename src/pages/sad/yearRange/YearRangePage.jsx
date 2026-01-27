import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Avatar,
  AvatarBadge,
  Button,
  Container,
  HStack,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
  SkeletonText,
} from "@chakra-ui/react";
import {
  elementCounter,
  Pagination,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/core/Table";
import { useFetchUsersProfile } from "../../../hooks/userQueries";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { encodeEmail } from "../../../components/utils/emailFormatter";
import ChangeMobileForm from "../../../forms/profile/ChangeMobileForm";
import { useState } from "react";
import VerifyChangeMobileOTPForm from "../../../forms/profile/VerifyChangeMobileOTPForm";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import CreateYearRangeModal from "./CreateYearRangeModal";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";

const YearRangePage = () => {
  // Queries
  const profileQuery = useFetchUsersProfile();
  const yearRangeQuery = useFetchYearRange();

  // States
  const [otpToken, setOtpToken] = useState("");
  const [mobileno, setMobileno] = useState("");
  const { role } = useAuth();

  // Disclosures
  const mobileDisclosure = useDisclosure();
  const verifyOtpDisclosure = useDisclosure();
  const createYearRangeDisclosure = useDisclosure();

  return (
    <Main>
      {/* Modals */}
      <CreateYearRangeModal
        isOpen={createYearRangeDisclosure.isOpen}
        onClose={createYearRangeDisclosure.onClose}
      />
      <ChangeMobileForm
        isOpen={mobileDisclosure.isOpen}
        onClose={mobileDisclosure.onClose}
        verifyOtpOnOpen={verifyOtpDisclosure.onOpen}
        setOtpToken={setOtpToken}
        setMobileno={setMobileno}
      />

      <VerifyChangeMobileOTPForm
        isOpen={verifyOtpDisclosure.isOpen}
        onClose={verifyOtpDisclosure.onClose}
        otpToken={otpToken}
        mobileno={mobileno}
      />

      <Section>
        <Container maxW="container.xl">
          {/* User Info */}
          <Stack spacing={8} p={6}>
            <VStack spacing={4}>
              <HStack w="100%" justify="flex-end">
                {hasPermission(role, "canAddYearRange") && (<Button
                  variant="brand"
                  leftIcon={<MdOutlineAddCircleOutline />}
                  onClick={createYearRangeDisclosure.onOpen}
                >
                  Add New Year Range
                </Button>)}
              </HStack>

              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Sl. No.</Th>
                      <Th>Start Year</Th>
                      <Th>End Year</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {(yearRangeQuery.isPending
                      ? new Array(10).fill(null)
                      : yearRangeQuery?.data?.data
                    )?.map((row, index) => {
                      return (
                        <Tr key={index}>
                          <Td>
                            <SkeletonText
                              w="8"
                              noOfLines={1}
                              isLoaded={!yearRangeQuery.isPending}
                              fadeDuration={index}
                            >
                              {elementCounter(index)}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!yearRangeQuery.isPending}
                              fadeDuration={index}
                            >
                              {row?.startYear}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!yearRangeQuery.isPending}
                              fadeDuration={index}
                            >
                              {row?.endYear}
                            </SkeletonText>
                          </Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </Stack>
        </Container>
      </Section>
    </Main>
  );
};

export default YearRangePage;
