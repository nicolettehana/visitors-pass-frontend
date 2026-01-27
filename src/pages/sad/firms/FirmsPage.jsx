import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Button,
  Container,
  HStack,
  Stack,
  SimpleGrid,
  useDisclosure,
  Tabs,
  TabList,
  Tab,
  Badge,
  Text,
  TabPanels,
  TabPanel,
  SkeletonText,
} from "@chakra-ui/react";

import {
  useFetchCategories,
  useFetchCategoryStats,
} from "../../../hooks/masterQueries";
import { useFetchFirmsByType, useExportFirms } from "../../../hooks/firmQueries";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import FirmsTableWrapper from "./FirmsTableWrapper";
import ApprovedFirmsTableWrapper from "./ApprovedFirmsTableWrapper";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import FirmCategoryStats from "../../../components/stats/FirmCategoryStats";
import { useNavigate } from "react-router-dom";
import YearRangeFilter from "../../../components/filter/YearRangeFilter";
import StatCard2 from "../../../components/core/theme/StatCard2";
import { FaFileExport } from "react-icons/fa";
import CreateFirmModal from "./CreateFirmModal";
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
import FirmsApprovePage from "./FirmsApprovePage";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";

const FirmsPage = () => {

  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryCode, setCategoryCode] = useState("");
  const [yearRangeId, setYearRangeId] = useState("");
  const [approvedYearRangeId, setApprovedYearRangeId] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedYearRangeId, setSelectedYearRangeId] = useState("");
  const [yearRange, setYearRange] = useState("");

  const activeYearRangeId = activeTab === 1 ? yearRangeId : approvedYearRangeId;
  const { role } = useAuth();

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const yearRangeQuery = useFetchYearRange();
  const categoryQuery = useFetchCategories();
  const firmsByTypeQuery = useFetchFirmsByType(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    activeYearRangeId
  );

  const exportFirmsMutation = useExportFirms();

  const categoryStatsQuery = useFetchCategoryStats(activeYearRangeId);
  const categoryCount =
  (categoryStatsQuery?.data?.data.byCategory?.length || 0);

  //Disclosures
  const createFirmDisclosure = useDisclosure();

  //Handlers

  const handleExport = () => {
  exportFirmsMutation.mutate(
    {
      yearRangeId: activeYearRangeId,
      category: categoryCode === "" ? "" : categoryCode,
    },
    {
      onSuccess: (response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data])
        );

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `approved_firms_${activeYearRangeId || "all"}.xlsx`
        );

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    }
  );
};

  const handleTabChange = (index) => {
    setActiveTab(index);
    setPageNumber(0);
    setCategoryCode("");
    if (index === 1) {
      setYearRangeId("");
    }
  };

  return (
    <>
      {/* Main */}
      <Main>
        {/* Modals */}
        <CreateFirmModal
          isOpen={createFirmDisclosure.isOpen}
          onClose={createFirmDisclosure.onClose}
        />
        <Section>
          <Container maxW="100%" pl={0} pr={0}>
            <Tabs pb={5} onChange={handleTabChange}>
              <TabList pl={5}>
                <Tab as={HStack}>
                  <Text>Approved Firms</Text>
                </Tab>
                <Tab as={HStack}>
                  <Text>All Firms</Text>
                </Tab>
                {hasPermission(role, "canManageApprovedFirms") && (<Tab as={HStack}>
                  <Text>Manage Approved Firms</Text>
                </Tab>)}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <SimpleGrid columns={{ base: 1, md: categoryCount }} spacing={6} pb={7} pt={2}>
                    {categoryStatsQuery?.data?.data?.byCategory?.map((c) => (
                      <StatCard2
                        key={c.categoryCode}
                        title={c.category}
                        value={c.totalFirms}
                        categoryCode={c.categoryCode}
                      />
                    ))}
                    {/* <StatCard2
                      key={"total"}
                      title={"Total"}
                      value={categoryStatsQuery?.data?.data.total}
                      categoryCode={""}
                    /> */}
                  </SimpleGrid>
                  <Section>
                    <Container minW="full">
                      <Stack spacing={4}>
                        {/* Filter */}
                        <HStack justifyContent="space-between" spacing={2}>
                          <HStack>
                            <YearRangeFilter
                              yearRangeId={approvedYearRangeId}
                              setYearRangeId={setApprovedYearRangeId}
                              setPageNumber={setPageNumber}
                              query={yearRangeQuery}
                              includeAll="0"
                            />
                            <CategoriesFilter
                              categoryCode={categoryCode}
                              setCategoryCode={setCategoryCode}
                              setPageNumber={setPageNumber}
                              query={categoryQuery}
                              stockType="S"
                            />
                          </HStack>
                          <HStack justifyContent="space-between" spacing={2}>
                            {/* <Button
                              variant="brand"
                              leftIcon={<FaEdit />}
                              onClick={() => {
                                navigate("/sad/firms/add-approved-firm");
                              }}
                            >
                              Approve New Firm
                            </Button> */}
                            <Button
                              variant="brand"
                              leftIcon={<FaFileExport />}
                              onClick={() => {
                                handleExport();
                              }}
                            >
                              Export to Excel
                            </Button>
                          </HStack>
                        </HStack>

                        {/* Filters */}
                        <HStack justifyContent="space-between" spacing={4}>
                          <PageSizing
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setPageNumber={setPageNumber}
                          />
                          <SearchInput
                            searchText={searchText}
                            setSearchText={setSearchText}
                            setPageNumber={setPageNumber}
                            w="fit-content"
                          />
                        </HStack>

                        {/* Table */}
                        <ApprovedFirmsTableWrapper
                          query={firmsByTypeQuery}
                          searchText={searchText}
                          pageNumber={pageNumber}
                          setPageNumber={setPageNumber}
                        />
                      </Stack>
                    </Container>
                  </Section>
                </TabPanel>
                <TabPanel>
                  {/* <SimpleGrid maxW="15%" spacing={4} pb={10}>
                    {categoryStatsQuery?.data?.data.byCategory.map((c) => (
                      <StatCard2
                        key={c.categoryCode}
                        title={c.category}
                        value={c.totalFirms}
                        categoryCode={c.categoryCode}
                      />
                    ))}
                    <StatCard2
                      key={"total"}
                      title={"Total"}
                      value={categoryStatsQuery?.data?.data.total}
                      categoryCode={""}
                    />
                  </SimpleGrid> */}
                  <Section>
                    <Container minW="full">
                      <Stack spacing={4}>
                        {/* Filter */}
                        <HStack justifyContent="space-between" spacing={2}>
                          <HStack>
                            {/* <YearRangeFilter
                              yearRangeId={yearRangeId}
                              setYearRangeId={setYearRangeId}
                              setPageNumber={setPageNumber}
                              query={yearRangeQuery}
                              includeAll='1'
                            /> */}
                            {/* <CategoriesFilter
                              categoryCode={categoryCode}
                              setCategoryCode={setCategoryCode}
                              setPageNumber={setPageNumber}
                              query={categoryQuery}
                            /> */}
                            <Text fontWeight="bold" color="brand.700">Total Firms: {categoryStatsQuery?.data?.data.total}</Text>
                            
                          </HStack>
                          <HStack justifyContent="space-between" spacing={2}>
                            {hasPermission(role, "canAddFirm") && (<Button
                              variant="brand"
                              leftIcon={<MdOutlineAddCircleOutline />}
                              onClick={createFirmDisclosure.onOpen}
                            >
                              Add New Firm
                            </Button>)}
                            {/* <Button
                              variant="brand"
                              leftIcon={<MdOutlineAddCircleOutline />}
                              onClick={() => {
                                navigate("/sad/firms/create");
                              }}
                            >
                              Add New Firm
                            </Button> */}
                            <Button
                              variant="brand"
                              leftIcon={<FaFileExport />}
                              onClick={() => {
                                handleExport();
                              }}
                            >
                              Export to Excel
                            </Button>
                          </HStack>
                        </HStack>

                        {/* Filters */}
                        <HStack justifyContent="space-between" spacing={4}>
                          <PageSizing
                            pageSize={pageSize}
                            setPageSize={setPageSize}
                            setPageNumber={setPageNumber}
                          />
                          <SearchInput
                            searchText={searchText}
                            setSearchText={setSearchText}
                            setPageNumber={setPageNumber}
                            w="fit-content"
                          />
                        </HStack>

                        {/* Table */}
                        <FirmsTableWrapper
                          query={firmsByTypeQuery}
                          searchText={searchText}
                          pageNumber={pageNumber}
                          setPageNumber={setPageNumber}
                        />
                      </Stack>
                    </Container>
                  </Section>
                </TabPanel>
                <TabPanel>
                  <Section>
                    <Container minW="full">
                      
                      {selectedYearRangeId==="" &&
                        <HStack justify="right" pb={5}>
                        
                        <Button
                          variant="brand"
                          leftIcon={<FaEdit />}
                          onClick={() => {
                            navigate("/sad/firms/add-approved-firm");
                          }}
                        >
                          Approve New Firm
                        </Button>
                      </HStack>}

                      {selectedYearRangeId ? (
                        <FirmsApprovePage
                          yearRangeId={selectedYearRangeId}
                          yearRange={yearRange}
                          onClose={() => setSelectedYearRangeId(null)}
                        />
                      ) : (
                        <TableContainer maxW="fit-content" mx="auto">
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>Sl. No.</Th>
                                <Th>Year Range</Th>
                                <Th>Action</Th>
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
                                        {row?.startYear}-{row?.endYear}
                                      </SkeletonText>
                                    </Td>
                                    <Td>
                                      <Button
                                        variant="brand"
                                        leftIcon={<FaEdit />}
                                        onClick={() => {
                                          setSelectedYearRangeId(row.id);
                                          setYearRange((row?.startYear)+"-"+(row?.endYear))
                                        }}
                                      >
                                        Manage Approved Firms
                                      </Button>
                                    </Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                          </Table>
                        </TableContainer>
                      )}
                    </Container>
                  </Section>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default FirmsPage;
