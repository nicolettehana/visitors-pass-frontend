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
import { FaEdit } from "react-icons/fa";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCategoryColorScheme } from "../../../components/core/CategoryColors";
import UpdateFirmModal from "./UpdateFirmModal";

const FirmsTableWrapper = ({
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
}) => {
  // Disclosures
  const updateFirmDisclosure = useDisclosure();

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
            <Heading size="md">Firm not found</Heading>
            <Text color="body" textAlign="center">
              Coulnd't find firm. {searchText}
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
            <Heading size="md">Empty inventory</Heading>
            <Text color="body" textAlign="center">
              You haven't added any firms yet.
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
              <Th>Firm</Th>
              <Th>Action</Th>
              {/* <Th>Category</Th> */}
              <Th borderLeft="2px solid">Year approved</Th>
              {/* <Th>Action</Th> */}
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
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.firm}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Button
                      variant="outline"
                      minW="auto"
                      //lineHeight="1"
                      bg="brand.50"
                      size="xs"
                      onClick={() => {
                        setRowState(row); // 👈 store row data
                        updateFirmDisclosure.onOpen();
                      }}
                      // onClick={() => {
                      //   navigate("/est/quarters/update", {
                      //     state: { rowState: row },
                      //   });
                      // }}
                    >
                      <FaEdit />
                    </Button>
                  </Td>
                  {/* <Td>
                    <SkeletonText
                      noOfLines={row?.categories.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.categories.map((cat, i) => (
                        <Box key={i} mb={1}>
                          <Badge
                            colorScheme={getCategoryColorScheme(cat?.code)}
                          >
                            {cat?.name}
                          </Badge>
                        </Box>
                      ))}
                    </SkeletonText>
                  </Td> */}

                  <Td borderRight="1px solid #ccc">
                    <SkeletonText
                      noOfLines={row?.yearRanges.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.yearRanges?.map((item, i) => (
                        <Box key={i} mb={1}>
                          {item.startYear}-{item.endYear} (
                          {item?.categoryCodes?.map((code, j) => (
                            <span key={j}>{j>0 && ", "}{<Badge
                            colorScheme={getCategoryColorScheme(code)}
                          >
                            {code}
                          </Badge>}</span>
                          ))}
                          )
                        </Box>
                      ))}
                      {/* <Button
                      variant="outline"
                      minW="auto"
                      //lineHeight="1"
                      bg="brand.50"
                      size="xs"
                      onClick={() => {
                        navigate("/est/quarters/update", {
                          state: { rowState: row },
                        });
                      }}
                    >
                      <FaEdit />
                    </Button> */}
                    </SkeletonText>
                  </Td>
                  {/* <Td>
                    <Button
                      variant="outline"
                      minW="auto"
                      py={5}
                      //pb={5}
                      //lineHeight="1"
                      iconLeft={<FaEdit />}
                      bg="brand.50"
                      size="xs"
                      onClick={() => {
                        navigate("/est/quarters/update", {
                          state: { rowState: row },
                        });
                      }}
                    >
                      New <br /> Approval
                    </Button>
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

export default FirmsTableWrapper;
