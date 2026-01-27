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
import { useFetchYearRange, useFetchUnits } from "../../../hooks/masterQueries";
import { encodeEmail } from "../../../components/utils/emailFormatter";
import ChangeMobileForm from "../../../forms/profile/ChangeMobileForm";
import { useState } from "react";
import VerifyChangeMobileOTPForm from "../../../forms/profile/VerifyChangeMobileOTPForm";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import CreateUnitModal from "./CreateUnitModal";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";

const UnitsPage = () => {
  // Queries
  const profileQuery = useFetchUsersProfile();
  const yearRangeQuery = useFetchYearRange();
  const unitsQuery = useFetchUnits();

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
      <CreateUnitModal
        isOpen={createYearRangeDisclosure.isOpen}
        onClose={createYearRangeDisclosure.onClose}
      />

      <Section>
        <Container maxW="container.xl">
          {/* User Info */}
          <Stack spacing={8} p={6}>
            <VStack spacing={4}>
              <HStack w="100%" justify="flex-end">
                {hasPermission(role, "canAddUnit") && (<Button
                  variant="brand"
                  leftIcon={<MdOutlineAddCircleOutline />}
                  onClick={createYearRangeDisclosure.onOpen}
                >
                  Add New Unit
                </Button>)}
              </HStack>

              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Sl. No.</Th>
                      <Th>Unit Format</Th>
                      <Th>Unit of Measure</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {(unitsQuery.isPending
                      ? new Array(10).fill(null)
                      : unitsQuery?.data?.data
                    )?.map((row, index) => {
                      return (
                        <Tr key={index}>
                          <Td>
                            <SkeletonText
                              w="8"
                              noOfLines={1}
                              isLoaded={!unitsQuery.isPending}
                              fadeDuration={index}
                            >
                              {elementCounter(index)}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!unitsQuery.isPending}
                              fadeDuration={index}
                            >
                              {row?.name}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!unitsQuery.isPending}
                              fadeDuration={index}
                            >
                              {row?.unit}
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

export default UnitsPage;
