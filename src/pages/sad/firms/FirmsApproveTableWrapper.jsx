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
  Checkbox,
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
import { useUpdateFirmYear } from "../../../hooks/firmQueries";

const FirmsApproveTableWrapper = ({
  yearRangeId,
  isEstate = true,
  query,
  searchText,
  pageNumber,
  setPageNumber,
  categoryCode
}) => {

  // States
  const [rowState, setRowState] = useState({});
  const [localChecked, setLocalChecked] = useState({});

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const updateFirmYear = useUpdateFirmYear(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["firms"] });
      navigate("/sad/firms");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Successfully updated",
      });
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to update",
      });
      return error;
    }
  );

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

  const handleApprovalChange = (row, checked) => {
    const previousValue = localChecked[row?.firmId] ?? row.isChecked;

    // Optimistic update
    setLocalChecked((prev) => ({
      ...prev,
      [row?.firmId]: checked ? 1 : 0,
    }));

    updateFirmYear.mutate(
      {
        categoryCode: categoryCode,
        yearRangeId,
        firmId: row.firmId,
        isChecked: checked ? 1 : 0,
      },
      {
        onError: () => {
          // 🔁 Rollback on error
          setLocalChecked((prev) => ({
            ...prev,
            [row.firmId]: previousValue,
          }));
        },
      }
    );
  };

  return (
    <Stack spacing={4}>
      
      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Firm</Th>
              <Th borderLeft="2px solid">Approval Status</Th>
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
                      {row?.firmName}
                    </SkeletonText>
                  </Td>
                  <Td>
                    <Checkbox
                      isChecked={(localChecked[row?.id] ?? row?.isChecked) === 1}
                      isDisabled={updateFirmYear.isLoading}
                      onChange={(e) =>
                        handleApprovalChange(row, e.target.checked)
                      }
                    />
                  </Td>
                  {/* <Td borderRight="1px solid #ccc">
                    <SkeletonText
                      noOfLines={row?.yearRanges?.length || 1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {row?.yearRanges?.map((item, i) => (
                        <HStack key={i} mb={1} spacing={2}>
                          <Checkbox
                            isChecked={yearRangeId === item.id}
                            isReadOnly // remove if you want it clickable
                          />
                          <Box>
                            {item.startYear}-{item.endYear}
                          </Box>
                        </HStack>
                      ))}
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

export default FirmsApproveTableWrapper;
