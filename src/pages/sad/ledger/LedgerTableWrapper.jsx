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

const LedgerTableWrapper = ({
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
  startDate,
  endDate,
}) => {
  // States
  const [rowState, setRowState] = useState({});
  const formatted = new Date(startDate).toLocaleDateString("en-GB");

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
            <Heading size="md">No Issues</Heading>
            <Text color="body" textAlign="center">
              There are no issues made in the selected date range/category.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }


  return (
    <Stack spacing={4}>

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Category</Th>
              <Th>Particulars</Th>
              <Th>Unit</Th>
              <Th>
                Opening Balance <br /> as on{" "}
                {new Date(startDate).toLocaleDateString("en-GB")}
              </Th>
              <Th>#Purchases</Th>
              <Th>#Issues</Th>
              <Th>
                Closing Balance <br /> as on{" "}
                {new Date(endDate).toLocaleDateString("en-GB")}
              </Th>
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
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Box>
                        <Badge
                          colorScheme={getCategoryColorScheme(
                            row?.categoryCode
                          )}
                        >
                          {row?.category}
                        </Badge>
                      </Box>
                    </SkeletonText>
                  </Td>
                  <Td>
                    <SkeletonText
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.itemName}
                      {row?.subItems?.map((subItem, i) =>
                        subItem?.units?.map((unit, j) => (
                          <Box key={`${i}-${j}`} mb={1}>
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
                        ))
                      )}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.units?.length === 0 ? (
                        <Box mb={1}>&nbsp;</Box> // empty space
                      ) : (
                        row?.units?.map((unit, i) => (
                          <Box key={i} mb={1}>
                            {unit.unitName}
                          </Box>
                        ))
                      )}

                      {row?.subItems?.map((subItem, i) => (
                        <div key={i}>
                          {subItem?.units?.map((unit, j) => (
                            <Box key={j} mb={1}>
                              {unit.unitName}
                            </Box>
                          ))}
                        </div>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.units?.length === 0 ? (
                        <Box mb={1}>&nbsp;</Box> // empty space
                      ) : (
                        row?.units?.map((unit, i) => (
                          <Box key={i} mb={1}>
                            {unit.openingBalance}
                          </Box>
                        ))
                      )}

                      {row?.subItems?.map((subItem, i) => (
                        <div key={i}>
                          {subItem?.units?.map((unit, j) => (
                            <Box key={j} mb={1}>
                              {unit.openingBalance}
                            </Box>
                          ))}
                        </div>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.units?.length === 0 ? (
                        <Box mb={1}>&nbsp;</Box> // empty space
                      ) : (
                        row?.units?.map((unit, i) => (
                          <Box key={i} mb={1}>
                            {unit.noOfPurchases}
                          </Box>
                        ))
                      )}

                      {row?.subItems?.map((subItem, i) => (
                        <div key={i}>
                          {subItem?.units?.map((unit, j) => (
                            <Box key={j} mb={1}>
                              {unit.noOfPurchases}
                            </Box>
                          ))}
                        </div>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.units?.length === 0 ? (
                        <Box mb={1}>&nbsp;</Box> // empty space
                      ) : (
                        row?.units?.map((unit, i) => (
                          <Box key={i} mb={1}>
                            {unit.noOfIssues}
                          </Box>
                        ))
                      )}

                      {row?.subItems?.map((subItem, i) => (
                        <div key={i}>
                          {subItem?.units?.map((unit, j) => (
                            <Box key={j} mb={1}>
                              {unit.noOfIssues}
                            </Box>
                          ))}
                        </div>
                      ))}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={row?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.units?.length === 0 ? (
                        <Box mb={1}>&nbsp;</Box> // empty space
                      ) : (
                        row?.units?.map((unit, i) => (
                          <Box key={i} mb={1}>
                            {unit.closingBalance}
                          </Box>
                        ))
                      )}

                      {row?.subItems?.map((subItem, i) => (
                        <div key={i}>
                          {subItem?.units?.map((unit, j) => (
                            <Box key={j} mb={1}>
                              {unit.closingBalance}
                            </Box>
                          ))}
                        </div>
                      ))}
                    </SkeletonText>
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

export default LedgerTableWrapper;
