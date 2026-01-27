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
import { MdRateReview } from "react-icons/md";
import AddRateModal from "./AddRateModal";

const RatesTableWrapper = ({
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
  yearRangeId,
}) => {
  // Disclosures
  const addRateDisclosure = useDisclosure();

  // States
  const [rowState, setRowState] = useState({});

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

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

  const [addRateState, setAddRateState] = useState({
    itemId: null,
    itemName: "",
    subItemId: null,
    subItemName: "",
  });

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
              Coulnd't find search item. {searchText}
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
            <Heading size="md">No Rates added</Heading>
            <Text color="body" textAlign="center">
              It seems you haven't added any rates yet.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  return (
    <Stack spacing={4}>
      {/* Modals */}
      <AddRateModal
        isOpen={addRateDisclosure.isOpen}
        onClose={addRateDisclosure.onClose}
        itemId={addRateState.itemId}
        itemName={addRateState.itemName}
        subItemId={addRateState.subItemId}
        subItemName={addRateState.subItemName}
        yearRangeId={yearRangeId}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              {/* <Th>Year Range</Th> */}
              <Th>Category</Th>
              <Th>Item</Th>
              <Th>Unit</Th>
              <Th>Rate (₹)</Th>
              {/* <Th>Actions</Th> */}
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
                  {/* <Td>
                    <SkeletonText
                      w="8"
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.startYear}-{row?.endYear}
                    </SkeletonText>
                  </Td> */}
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Badge
                        colorScheme={getCategoryColorScheme(row?.categoryCode)}
                      >
                        {row?.category}
                      </Badge>
                    </SkeletonText>
                  </Td>
                  <Td whiteSpace="normal">
                    <SkeletonText
                      noOfLines={row?.subItems.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.name}

                      {row?.subItems?.map((subItem, i) => {
                        const hasRates = subItem?.rates?.length > 0;

                        return hasRates ? (
                          subItem.rates.map((rate, j) => (
                            <Box key={`${i}-${j}`} mb={1}>
                              ({String.fromCharCode(97 + i)}){" "}
                              {subItem.name || "-"}
                            </Box>
                          ))
                        ) : (
                          <Box key={i} mb={1}>
                            ({String.fromCharCode(97 + i)}){" "}
                            {subItem.name || "-"}
                          </Box>
                        );
                      })}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.subItems.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.rates?.map((rate, i) => (
                        <Box key={i} mb={1}>
                          {rate.unit || "-"}
                        </Box>
                      ))}
                      {row?.subItems?.length > 0 && "\u00A0"}
                      {row?.subItems.length == 0 &&
                        row?.rates?.length == 0 &&
                        "-"}
                      {row?.subItems?.map((subItem, i) => {
                        const hasRates = subItem?.rates?.length > 0;

                        return hasRates ? (
                          subItem.rates.map((rate, j) => (
                            <Box key={`${i}-${j}`} mb={1}>
                              ({String.fromCharCode(97 + i)}) {rate.unit || "-"}
                            </Box>
                          ))
                        ) : (
                          <Box key={i} mb={1}>
                            ({String.fromCharCode(97 + i)}) {"-"}
                          </Box>
                        );
                      })}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.subItems.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.rates?.map((rate, i) => (
                        <Box key={i} mb={1}>
                          {rate.rate || "-"}
                        </Box>
                      ))}
                      {row?.subItems?.length > 0 && "\u00A0"}
                      {row?.subItems.length == 0 && row?.rates?.length == 0 && (
                        <Tooltip label="Add Rate" hasArrow>
                          <Button
                            p={0}
                            m={0}
                            size="small"
                            onClick={() => {
                              setAddRateState({
                                itemId: row.id,
                                itemName: row.name,
                                subItemId: null,
                                subItemName: "",
                                yearRangeId: yearRangeId,
                              });
                              addRateDisclosure.onOpen();
                            }}
                          >
                            <MdRateReview />
                          </Button>
                        </Tooltip>
                      )}
                      {/* {row?.subItems?.map((subItem, i) =>
                        subItem?.rates?.map((rate, j) => (
                        <Box key={`${i}-${j}`} mb={1}>
                          ({String.fromCharCode(97 + i)}) {rate.rate || "-"}
                        </Box>
                        ))
                      )} */}
                      {row?.subItems?.map((subItem, i) => {
                        const hasRates = subItem?.rates?.length > 0;

                        return hasRates ? (
                          subItem.rates.map((rate, j) => (
                            <Box key={`${i}-${j}`} mb={1}>
                              ({String.fromCharCode(97 + i)}){" "}
                              {rate.rate || (
                                <Tooltip label="Add Rate" hasArrow>
                                  <Button
                                    p={0}
                                    m={0}
                                    size="small"
                                    onClick={() => {
                                      setAddRateState({
                                        itemId: row.id,
                                        itemName: row.name,
                                        subItemId: subItem?.id || null,
                                        subItemName: subItem?.name || "",
                                        yearRangeId: yearRangeId,
                                      });
                                      addRateDisclosure.onOpen();
                                    }}
                                  >
                                    <MdRateReview />
                                  </Button>
                                </Tooltip>
                              )}
                            </Box>
                          ))
                        ) : (
                          <Box key={i} mb={1}>
                            ({String.fromCharCode(97 + i)}){" "}
                            {
                              <Tooltip label="Add Rate" hasArrow>
                                <Button
                                  p={0}
                                  m={0}
                                  size="small"
                                  onClick={() => {
                                    setAddRateState({
                                      itemId: row.id,
                                      itemName: row.name,
                                      subItemId: subItem?.id || null,
                                      subItemName: subItem?.name || "",
                                    });
                                    addRateDisclosure.onOpen();
                                  }}
                                >
                                  <MdRateReview />
                                </Button>
                              </Tooltip>
                            }
                          </Box>
                        );
                      })}
                    </SkeletonText>
                  </Td>
                  {/* <Td>
                    <ButtonGroup variant="outline" isAttached={true}>
                      {isEstate && (
                        <Button
                          onClick={() => {
                            navigate("/est/quarters/update", {
                              state: { rowState: row },
                            });
                          }}
                        >
                          Edit
                        </Button>
                      )}
                    </ButtonGroup>
                  </Td> */}
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

export default RatesTableWrapper;
