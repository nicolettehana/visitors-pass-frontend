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

const PurchaseTableWrapper = ({
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
}) => {
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

  const calculateItemGST = (amount, gstPercentage = 0) => {
    const gst = (amount * gstPercentage) / 100;
    return {
      cgst: gst / 2,
      sgst: gst / 2,
      gst,
    };
  };

  const calculateRowTotals = (items = []) => {
    let subtotal = 0;
    let gstTotal = 0;

    items.forEach((item) => {
      // If subItems exist, calculate from subItems
      if (item?.subItems?.some((s) => s)) {
        item.subItems.forEach((subItem) => {
          if (!subItem) return;
          subtotal += subItem.amount || 0;
          gstTotal += calculateItemGST(
            subItem.amount || 0,
            subItem.gstPercentage
          ).gst;
        });
      } else {
        subtotal += item.amount || 0;
        gstTotal += calculateItemGST(item.amount || 0, item.gstPercentage).gst;
      }
    });

    return {
      subtotal,
      gstTotal,
      grandTotal: subtotal + gstTotal,
    };
  };

  return (
    <Stack spacing={4}>
      {/* Table */}
      <TableContainer overflowX={{ base: "auto", md: "visible" }}>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Bill No. & Date</Th>
              <Th>Firm</Th>
              <Th>Category</Th>
              <Th>Particulars</Th>
              <Th>Quantity</Th>
              <Th>Rate (₹)</Th>
              <Th>Amount (₹)</Th>
              <Th>Total (₹)</Th>
              {/* <Th>Remarks</Th> */}
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
                      {row?.billNo}
                      <br />
                      {row?.billDate
                        ? new Date(row.billDate)
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
                    <SkeletonText
                      noOfLines={row?.items?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.items?.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.subItems?.every((s) => s == null)
                            ? `${item.rate} ${item.unit}`
                            : "\u00A0"}
                          {item?.subItems?.map(
                            (subItem, i) =>
                              subItem?.subItemName && (
                                <Box key={i} mb={1}>
                                  {subItem.rate} {subItem.unit}
                                </Box>
                              )
                          )}
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
                          {item.subItems?.every((s) => s == null) ? (
                            <>
                              <HStack>
                                <Text>₹{item.amount}</Text>
                                <Text fontSize="sm">
                                  {item.gstPercentage && " CGST: ₹" + item.cgst}
                                  {item.gstPercentage && " SGST: ₹" + item.sgst}
                                </Text>
                              </HStack>
                            </>
                          ) : (
                            "\u00A0"
                          )}
                          {item?.subItems?.map(
                            (subItem, i) =>
                              subItem?.subItemName && (
                                <Box key={i} mb={1}>
                                  <HStack>
                                    <Text >₹{subItem.amount}</Text>
                                    <Text fontSize="sm">
                                      {subItem.gstPercentage &&
                                        " CGST: ₹" + subItem.cgst}
                                      {subItem.gstPercentage &&
                                        " SGST: ₹" + subItem.sgst}
                                    </Text>
                                  </HStack>
                                </Box>
                              )
                          )}
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td>
                  {/* <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Badge
                        fontSize="xs"
                        fontWeight="bold"
                        colorScheme="black"
                        textTransform="none"
                      >
                        Sub-total: ₹{row?.totalCost}
                      </Badge>
                      <br />
                      <Badge
                        fontSize="xs"
                        fontWeight="bold"
                        colorScheme="black"
                        textTransform="none"
                      >
                        GST: ₹{row?.gst} ({row?.gstPercentage}%)
                      </Badge>
                      <br />
                      <Badge
                        fontSize="xs"
                        fontWeight="bold"
                        colorScheme="green"
                        textTransform="none"
                      >
                        Total: ₹{row?.totalCost + row?.gst}
                      </Badge>
                    </SkeletonText>
                  </Td> */}
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {(() => {
                        const { subtotal, gstTotal, grandTotal } =
                          calculateRowTotals(row?.items);

                        return (
                          <>
                            <Badge
                              fontSize="xs"
                              fontWeight="bold"
                              colorScheme="black"
                              textTransform="none"
                            >
                              Sub-total: ₹{subtotal.toFixed(2)}
                            </Badge>
                            <br />
                            <Badge
                              fontSize="xs"
                              fontWeight="bold"
                              colorScheme="black"
                              textTransform="none"
                            >
                              GST: ₹{gstTotal.toFixed(2)}
                            </Badge>
                            <br />
                            <Badge
                              fontSize="xs"
                              fontWeight="bold"
                              colorScheme="green"
                              textTransform="none"
                            >
                              Total: ₹{grandTotal.toFixed(2)}
                            </Badge>
                          </>
                        );
                      })()}
                    </SkeletonText>
                  </Td>

                  {/* <Td maxW={{ md: "300px", lg: "400px" }}>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.remarks}
                    </SkeletonText>
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

export default PurchaseTableWrapper;
