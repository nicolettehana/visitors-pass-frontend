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
import {
  useFetchItemsByType,
  useExportItems,
} from "../../../hooks/itemQueries";
import VisitorsTableWrapper from "./VisitorsTableWrapper";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import { useNavigate } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import CreateItemsModal from "./CreateItemsModal";
import { useAuth } from "../../../components/auth/useAuth";
import { hasPermission } from "../../../components/auth/permissions";
import DateFilter from "../../../components/filter/DateFilter";
import dayjs from "dayjs";

const VisitorsPage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [categoryCode, setCategoryCode] = useState("");
  const [startDate, setStartDate] = useState(
      dayjs().subtract(2, "months").startOf("M").format("YYYY-MM-DD")
    );
    const [endDate, setEndDate] = useState(
      dayjs().startOf("day").format("YYYY-MM-DD")
    );
  const { role } = useAuth();

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const itemsByTypeQuery = useFetchItemsByType(
    categoryCode === "" ? null : categoryCode,
    searchValue,
    pageNumber,
    pageSize
  );
  const exportItemsMutation = useExportItems();

  //Disclosures
  const createItemDisclosure = useDisclosure();

  //Handlers
  const handleExport = () => {
    exportItemsMutation.mutate(
      {
        category: categoryCode === "" ? "" : categoryCode,
      },
      {
        onSuccess: (response) => {
          const url = window.URL.createObjectURL(new Blob([response.data]));

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `items_${categoryCode || "all"}.xlsx`);

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
        <CreateItemsModal
          isOpen={createItemDisclosure.isOpen}
          onClose={createItemDisclosure.onClose}
        />

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
                    <MenuButton as={Button} leftIcon={<FaFileDownload />}>Download</MenuButton>
                    <MenuList>
                      <MenuItem onClick={() => {
                      handleExport();
                    }}>Excel</MenuItem>
                      <MenuItem>PDF</MenuItem>
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
                query={itemsByTypeQuery}
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
