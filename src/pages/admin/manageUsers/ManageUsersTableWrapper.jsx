import {
  Badge,
  Box,
  Center,
  Heading,
  HStack,
  LightMode,
  SkeletonText,
  Stack,
  Switch,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import {
  elementCounter,
  PageSizing,
  Pagination,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "../../../components/core/Table";
import { MdOutlineTableChart } from "react-icons/md";
import { useEnableDisableUsers } from "../../../hooks/adminQueries";
import { useQueryClient } from "@tanstack/react-query";

const ManageUsersTableWrapper = ({
  query,
  pageNumber,
  setPageNumber,
  pageSize,
  setPageSize,
}) => {
  // Error State
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
              {query?.error?.response?.data?.detail || "Couldn't fetch data."}
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Empty State
  if (query.isSuccess && query?.data?.data?.empty) {
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
            <Heading size="md">Users is empty</Heading>
            <Text color="body" textAlign="center">
              Users that are registered will be displayed here.
            </Text>
          </VStack>
        </VStack>
      </Center>
    );
  }

  // Hooks
  const toast = useToast();

  // Queries
  const queryClient = useQueryClient();
  const enableDisableQuery = useEnableDisableUsers(
    (response) => {
      queryClient.invalidateQueries({
        queryKey: ["fetch-all-users"],
      });

      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.message || "Enabled/Disabled successfully",
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
        description:
          error.response.data.detail ||
          "Oops! something went wrong. Couldn't enable/disable users.",
      });
      return error;
    }
  );

  return (
    <Stack spacing={4}>
      {/* Page Size */}
      <PageSizing
        pageSize={pageSize}
        setPageNumber={setPageNumber}
        setPageSize={setPageSize}
      />

      {/* Table */}
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>Sl. No.</Th>
              <Th>Name & Username</Th>
              <Th>Department & Designation</Th>
              <Th>Email & Mobile No.</Th>
              <Th>Role</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {(query.isPending
              ? new Array(pageSize).fill(null)
              : query?.data?.data?.content
            )?.map((row, index) => {
              return (
                <Tr key={index}>
                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      {elementCounter(index, query)}
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <Text>{row?.name}</Text>
                        <Text color="body" fontSize="sm">
                          {row?.username}
                        </Text>
                      </Stack>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <Text>{row?.department}</Text>
                        <Text color="body" fontSize="sm">
                          {row?.designation}
                        </Text>
                      </Stack>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={2}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Stack spacing={0}>
                        <Text>{row?.email || "-"}</Text>
                        <Text color="body" fontSize="sm">
                          {row?.mobileNo}
                        </Text>
                      </Stack>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <SkeletonText
                      noOfLines={1}
                      isLoaded={!query.isPending}
                      fadeDuration={index}
                    >
                      <Badge
                        colorScheme={
                          row?.role === "USER"
                            ? "brand"
                            : row?.role === "ADMIN"
                            ? "red"
                            : row?.role === "CH"
                            ? "orange"
                            : row?.role === "EST"
                            ? "green"
                            : ""
                        }
                      >
                        {row?.role}
                      </Badge>
                    </SkeletonText>
                  </Td>

                  <Td>
                    <HStack>
                      {row?.enabled ? (
                        <Badge colorScheme="green">Enabled</Badge>
                      ) : (
                        <Badge colorScheme="red">Disabled</Badge>
                      )}

                      <LightMode>
                        <Switch
                          colorScheme="brand"
                          isChecked={row?.enabled}
                          onChange={() => {
                            enableDisableQuery.mutate({
                              username: row?.username,
                            });
                          }}
                        />
                      </LightMode>
                    </HStack>
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

export default ManageUsersTableWrapper;
