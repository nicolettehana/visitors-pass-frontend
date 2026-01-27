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
  Badge,
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
import {
  useFetchYearRange,
  useFetchCategories,
} from "../../../hooks/masterQueries";
import ChangeMobileForm from "../../../forms/profile/ChangeMobileForm";
import { useState } from "react";
import VerifyChangeMobileOTPForm from "../../../forms/profile/VerifyChangeMobileOTPForm";
import {
  getCategoryColor,
  getCategoryColorScheme,
} from "../../../components/core/CategoryColors";
import CreateCategoryModal from "./CreateCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";

const CategoryPage = () => {
  // Queries
  const profileQuery = useFetchUsersProfile();
  const yearRangeQuery = useFetchYearRange();
  const categoryQuery = useFetchCategories();

  // States
  const [rowState, setRowState] = useState({});
  const { role } = useAuth();

  // Disclosures
  const createCategoryDisclosure = useDisclosure();
  const updateCategoryDisclosure = useDisclosure();

  return (
    <Main>
      <CreateCategoryModal
        isOpen={createCategoryDisclosure.isOpen}
        onClose={createCategoryDisclosure.onClose}
      />
      <UpdateCategoryModal
        isOpen={updateCategoryDisclosure.isOpen}
        onClose={updateCategoryDisclosure.onClose}
        name={rowState?.name}
        code={rowState?.code}
      />
      <Section>
        <Container maxW="container.xl">
          {/* User Info */}
          <Stack spacing={8} p={6}>
            <VStack spacing={4}>
              <HStack w="100%" justify="flex-end">
                {hasPermission(role, "canAddCategory") && (<Button
                  variant="brand"
                  leftIcon={<MdOutlineAddCircleOutline />}
                  onClick={createCategoryDisclosure.onOpen}
                >
                  Add New Category
                </Button>)}
              </HStack>

              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Sl. No.</Th>
                      <Th>Category Code</Th>
                      <Th>Category</Th>
                      <Th>Stock Type</Th>
                      <Th>Action</Th>
                    </Tr>
                  </Thead>

                  <Tbody>
                    {(categoryQuery.isPending
                      ? new Array(10).fill(null)
                      : categoryQuery?.data?.data
                    )?.map((row, index) => {
                      return (
                        <Tr key={index}>
                          <Td>
                            <SkeletonText
                              w="8"
                              noOfLines={1}
                              isLoaded={!categoryQuery.isPending}
                              fadeDuration={index}
                            >
                              {elementCounter(index)}
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!categoryQuery.isPending}
                              fadeDuration={index}
                            >
                              <Badge
                                colorScheme={getCategoryColorScheme(row?.code)}
                              >
                                {row?.code}
                              </Badge>
                            </SkeletonText>
                          </Td>
                          <Td>
                            <SkeletonText
                              noOfLines={1}
                              isLoaded={!categoryQuery.isPending}
                              fadeDuration={index}
                            >
                              <Badge
                                colorScheme={getCategoryColorScheme(row?.code)}
                              >
                                {row?.name}
                              </Badge>
                            </SkeletonText>
                          </Td>
                          <Td><Text fontSize="sm">{row?.stockType === 'S'? 'Stock':'Non-Stock'}</Text></Td>
                          <Td>
                              {hasPermission(role, "canEditCategory") && (<Button
                                variant="outline"
                                minW="auto"
                                //lineHeight="1"
                                bg="brand.50"
                                size="xs"
                                onClick={() => {
                                  setRowState(row);
                                  updateCategoryDisclosure.onOpen();
                                }}
                              >
                                <FaEdit />
                              </Button>)}
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

export default CategoryPage;
