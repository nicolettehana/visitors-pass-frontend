import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Button,
  Container,
  HStack,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { useFetchRates, useExportRates } from "../../../hooks/ratesQueries";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import { useFetchCategories } from "../../../hooks/masterQueries";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import YearRangeFilter from "../../../components/filter/YearRangeFilter";
import RatesTableWrapper from "./RatesTableWrapper";
import { FaFileExport } from "react-icons/fa";
import CreateRateModal from "./CreateRateModal";
import { hasPermission } from "../../../components/auth/permissions";
import { useAuth } from "../../../components/auth/useAuth";

const RatesPage = () => {
  // States
  const [quarterCode, setQuarterCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [categoryCode, setCategoryCode] = useState("");
  const [yearRangeId, setYearRangeId] = useState("");
  const { role } = useAuth();

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const categoryQuery = useFetchCategories();
  const yearRangeQuery = useFetchYearRange();
  const ratesQuery = useFetchRates(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize,
    yearRangeId
  );
  const exportRatesMutation = useExportRates();

  //Disclosures
  const createRateDisclosure = useDisclosure();

  //Handlers
  const handleExport = () => {
    exportRatesMutation.mutate(
      {
        yearRange: yearRangeId,
        category: categoryCode === "" ? "" : categoryCode,
      },
      {
        onSuccess: (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          const categoryName =
            categoryCode === ""
              ? ""
              : "_" +
                  categoryQuery?.data?.data?.find(
                    (cat) => cat.code === categoryCode
                  )?.name || "";
          const yearRange =
            yearRangeId === ""
              ? ""
              : yearRangeQuery?.data?.data?.find(
                  (yearRange) => yearRange.id === Number(yearRangeId)
                )?.startYear+"-"+yearRangeQuery?.data?.data?.find(
                  (yearRange) => yearRange.id === Number(yearRangeId)
                )?.endYear || "";

          link.setAttribute(
            "download",
            `rates_${yearRange}${categoryName}.xlsx`
          );

          document.body.appendChild(link);
          link.click();
          link.remove();
        },
      }
    );
  };

  return (
    <>
      {/* Main */}
      <Main>
        {/* Modals */}
        <CreateRateModal
          isOpen={createRateDisclosure.isOpen}
          onClose={createRateDisclosure.onClose}
        />
        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filter */}
              <HStack justifyContent="space-between" spacing={2}>
                <HStack>
                  <YearRangeFilter
                    yearRangeId={yearRangeId}
                    setYearRangeId={setYearRangeId}
                    setPageNumber={setPageNumber}
                    query={yearRangeQuery}
                  />
                  <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                    stockType="S"
                  />
                </HStack>

                <HStack>
                  {hasPermission(role, "canAddRate") && (<Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={createRateDisclosure.onOpen}
                  >
                    Add New Rate
                  </Button>)}
                  {/* <Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={() => {
                      navigate("/sad/rates/create");
                    }}
                  >
                    Add New Rate
                  </Button> */}
                  {hasPermission(role, "canExportRates") && (<Button
                    variant="brand"
                    leftIcon={<FaFileExport />}
                    onClick={() => {
                      handleExport();
                    }}
                  >
                    Export to Excel
                  </Button>)}
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
              <RatesTableWrapper
                query={ratesQuery}
                searchText={searchText}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                yearRangeId={yearRangeId}
              />
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default RatesPage;
