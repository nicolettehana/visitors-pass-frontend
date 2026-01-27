import { useState } from "react";
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
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Heading,
  HStack,
  IconButton,
  LightMode,
  SkeletonText,
  Stack,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  MdOutlineInfo,
  MdOutlineSearch,
  MdOutlineSensorOccupied,
  MdOutlineTableChart,
} from "react-icons/md";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCategoryColorScheme } from "../../../components/core/CategoryColors";
import { FaEdit } from "react-icons/fa";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";
import CreatePurchaseOrderModal from "./CreatePurchaseOrderModal";

const PurchaseOrderTableWrapper = ({
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
}) => {
  // States
  const [rowState, setRowState] = useState({});
  const { role } = useAuth();

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

  //Disclosures
  const createPurchaseOrderDisclosure = useDisclosure();

  if (query.isError) {
    return (
      <Center py={16}>
        <VStack spacing={4}>
          <Box
            bg="paperSecondary"
            w="fit-content"
            border="1px"
            borderColor="border"
            rounded="full"
            p={4}
          >
            <MdOutlineTableChart size={48} />
          </Box>

          <VStack>
            <Heading size="md">Something went wrong</Heading>
            <Text color="body" textAlign="center">
              {query?.error?.response?.data?.detail}
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Empty Search
  if (
    query.isSuccess &&
    query?.data?.data?.content?.length === 0 &&
    searchText !== ""
  ) {
    return (
      <Center py={16}>
        <VStack spacing={4}>
          <Box
            bg="paperSecondary"
            w="fit-content"
            border="1px"
            borderColor="border"
            rounded="full"
            p={4}
          >
            <MdOutlineSearch size={48} />
          </Box>

          <VStack>
            <Heading size="md">No results</Heading>
            <Text color="body" textAlign="center">
              Coulnd't find search value. {searchText}
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Empty State
  if (query.isSuccess && query?.data?.data?.content?.length === 0) {
    return (
      <Center py={16}>
        <VStack spacing={4}>
          <Box
            bg="paperSecondary"
            w="fit-content"
            border="1px"
            borderColor="border"
            rounded="full"
            p={4}
          >
            <MdOutlineTableChart size={48} />
          </Box>

          <VStack>
            <Heading size="md">No Purchases</Heading>
            <Text color="body" textAlign="center">
              There are no purchases in the selected date range/category.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <CreatePurchaseOrderModal
        isOpen={createPurchaseOrderDisclosure.isOpen}
        onClose={createPurchaseOrderDisclosure.onClose}
        data={rowState}
      />
      {/* Table */}
      <TableContainer overflowX={{ base: "auto", md: "visible" }}>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>File no. & Date</Th>
              <Th>Firm</Th>
              <Th>Category</Th>
              <Th>Particulars</Th>
              <Th>Quantity</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(10).fill(null)
              : query?.data?.data?.content
            )?.map((row, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <SkeletonText
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {elementCounter(index, query)}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.fileNo}
                      <br />

                      {row?.date
                        ? new Date(row.date)
                            .toLocaleDateString("en-GB")
                            .replace(/\//g, "-") // dd-mm-yyyy
                        : ""}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Box whiteSpace="normal">{row?.firmName}</Box>
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          <Badge
                            colorScheme={getCategoryColorScheme(
                              item?.categoryCode
                            )}
                          >
                            {item.category}
                          </Badge>
                          {item?.subItems
                            ?.filter((s) => s) // <-- removes null values
                            .map((subItem, i) => (
                              <Box key={i} mb={1}>
                                {"\u00A0"}
                              </Box>
                            ))}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td maxW={{ md: "500px", lg: "600px" }}>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box
                          key={i}
                          mb={1}
                          whiteSpace="normal"
                          //wordBreak="break-word"
                          overflowWrap="anywhere"
                        >
                          <b>{i + 1})</b> {item.itemName}
                          {item?.subItems
                            ?.filter((s) => s) // <-- removes null values
                            .map((subItem, i) => (
                              <Box key={i} mb={1}>
                                &nbsp;&nbsp;
                                <Badge
                                  textTransform="none"
                                  fontSize="sm"
                                  fontWeight="normal"
                                  bg="white"
                                >
                                  <b>({String.fromCharCode(97 + i)}) </b>
                                  {subItem.subItemName}
                                </Badge>
                              </Box>
                            ))}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.subItems?.every((s) => s == null)
                            ? item.quantity
                            : "\u00A0"}
                          {item?.subItems?.map(
                            (subItem, i) =>
                              subItem?.subItemName && (
                                <Box key={i} mb={1}>
                                  {subItem.quantity}
                                </Box>
                              )
                          )}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  <Td>
                    {row?.billNo && <Badge colorScheme="green">Received</Badge>}
                    {!row?.billNo && <Badge colorScheme="red">Pending</Badge>}
                    <br />
                    {hasPermission(role, "canCreatePurchase") &&
                      !row?.billNo && (
                        <Button
                          variant="outline"
                          minW="auto"
                          //lineHeight="1"
                          bg="brand.50"
                          size="xs"
                          onClick={() => {
                            setRowState(row);
                            createPurchaseOrderDisclosure.onOpen();
                          }}
                        >
                          <FaEdit />
                        </Button>
                      )}
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Pagination
        query={query}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
    </Stack>
  );
};

export default PurchaseOrderTableWrapper;
