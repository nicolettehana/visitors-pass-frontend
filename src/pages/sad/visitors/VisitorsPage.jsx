import { useState } from "react";
import Main from "../../../components/core/semantics/Main";
import Section from "../../../components/core/semantics/Section";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Container,
  HStack,
  Stack,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";

import { useExportVisitors } from "../../../hooks/visitorQueries";
import { useFetchVisitors } from "../../../hooks/visitorQueries";
import VisitorsTableWrapper from "./VisitorsTableWrapper";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import { useAuth } from "../../../components/auth/useAuth";
import DateFilter from "../../../components/filter/DateFilter";
import dayjs from "dayjs";

const VisitorsPage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryCode, setCategoryCode] = useState("");
  const [format, setFormat] = useState("PDF");
  const [startDate, setStartDate] = useState(
    dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD"),
  );
  const [endDate, setEndDate] = useState(
    dayjs().startOf("day").format("YYYY-MM-DD"),
  );
  const { role } = useAuth();

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries

  const visitorsQuery = useFetchVisitors(
    searchValue,
    pageNumber,
    pageSize,
    startDate,
    endDate,
  );
  const exportVisitorsMutation = useExportVisitors();

  //Disclosures

  //Handlers
  
  const handleExportVisitors = (exportFormat) => {
    const extension = exportFormat === "PDF" ? "pdf" : "xlsx";

    exportVisitorsMutation.mutate(
      {
        startDate,
        endDate,
        format: exportFormat,
      },
      {
        onSuccess: (response) => {
          const url = window.URL.createObjectURL(new Blob([response]));
          const mimeType =
            exportFormat === "PDF"
              ? "application/pdf"
              : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

          const blob = new Blob([response], { type: mimeType });

          const link = document.createElement("a");
          link.href = url;
          link.download = `Visitors_${startDate}-${endDate}.${extension}`;
          link.click();
          link.remove();
        },
      },
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
                </HStack>

                <HStack>
                  <Menu>
                    <MenuButton as={Button} leftIcon={<FaFileDownload />} variant="brand">
                      Download
                    </MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => handleExportVisitors("Excel")}>
                        Excel
                      </MenuItem>
                      <MenuItem onClick={() => handleExportVisitors("PDF")}>
                        PDF
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  {/* <Button
                    variant="brand"
                    leftIcon={<FaFileExport />}
                    onClick={() => {
                      handleExport();
                    }}
                  >
                    Export to Excel
                  </Button> */}
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
              <VisitorsTableWrapper
                query={visitorsQuery}
                searchText={searchText}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
              />
            </Stack>
          </Container>
        </Section>
      </Main>
    </>
  );
};

export default VisitorsPage;
