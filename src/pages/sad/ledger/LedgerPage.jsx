import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import { Button, Container, HStack, Stack } from "@chakra-ui/react";
import { useFetchYearRange } from "../../../hooks/masterQueries";
import { useFetchRates } from "../../../hooks/ratesQueries";
import { useFetchPurchases } from "../../../hooks/purchaseQueries";
import { useFetchIssues } from "../../../hooks/issueQueries";
import { useFetchLedger, useExportLedger } from "../../../hooks/ledgerQueries";
import { MdOutlineHome } from "react-icons/md";
import { useFetchCategories } from "../../../hooks/masterQueries";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import PurchaseTableWrapper from "./LedgerTableWrapper";
import dayjs from "dayjs";
import DateFilter from "../../../components/filter/DateFilter";
import LedgerTableWrapper from "./LedgerTableWrapper";
import { FaFileExport } from "react-icons/fa";

const LedgerPage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryCode, setCategoryCode] = useState("");
  const [yearRangeId, setYearRangeId] = useState("");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    dayjs().startOf("day").format("YYYY-MM-DD")
  );

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const categoryQuery = useFetchCategories();

  const ledgerQuery = useFetchLedger(
    pageNumber,
    pageSize,
    startDate,
    endDate,
    categoryCode === "" ? "" : categoryCode,
    searchValue
  );

  const exportLedgerMutation = useExportLedger();

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  //Handlers
  const handleExport = () => {
    exportLedgerMutation.mutate(
      {
        startDate: startDate,
        endDate: endDate,
        categoryCode: categoryCode === "" ? "" : categoryCode,
      },
      {
        onSuccess: (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          const categoryName =
            categoryCode === ""
              ? ""
              : "_" +
                  categoryQuery?.data?.data?.find(
                    (cat) => cat.code === categoryCode
                  )?.name || "";

          link.href = url;
          link.setAttribute(
            "download",
            `Ledger ${categoryName} ${formatDate(startDate)} to ${formatDate(
              endDate
            )}.xlsx`
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
        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filter */}
              <HStack justifyContent="space-between" spacing={2}>
                <HStack>
                  <DateFilter
                    fromDate={startDate}
                    setFromDate={setStartDate}
                    toDate={endDate}
                    setToDate={setEndDate}
                    setPageNumber={setPageNumber}
                  />
                  <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                    stockType="S"
                  />
                </HStack>

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

              {/* Filters */}
              <HStack justifyContent="space-between" spacing={4}>
                <PageSizing
                  pageSize={pageSize}
                  setPageSize={setPageSize}
                  setPageNumber={setPageNumber}
                />
                {/* <SearchInput
                  searchText={searchText}
                  setSearchText={setSearchText}
                  setPageNumber={setPageNumber}
                  w="fit-content"
                /> */}
              </HStack>

              {/* Table */}
              <LedgerTableWrapper
                query={ledgerQuery}
                searchText={searchText}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                startDate={startDate}
                endDate={endDate}
              />
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default LedgerPage;
