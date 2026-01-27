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
} from "@chakra-ui/react";
import { useFetchCategories } from "../../../hooks/masterQueries";
import { useFetchItemCategoryStats } from "../../../hooks/masterQueries";
import {
  useFetchItemsByType,
  useExportItems,
} from "../../../hooks/itemQueries";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import ItemsTableWrapper from "./ItemsTableWrapper";
import CategoriesFilter from "../../../components/filter/CategoriesFilter";
import SearchInput from "../../../components/core/SearchInput";
import { useDebounce } from "use-debounce";
import { PageSizing } from "../../../components/core/Table";
import FirmCategoryStats from "../../../components/stats/FirmCategoryStats";
import { useNavigate } from "react-router-dom";
import StatCard2 from "../../../components/core/theme/StatCard2";
import { FaFileExport } from "react-icons/fa";
import CreateItemsModal from "./CreateItemsModal";
import { useAuth } from "../../../components/auth/useAuth";
import { hasPermission } from "../../../components/auth/permissions";

const ItemsPage = () => {
  // States
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [status, setStatus] = useState("all");
  const [categoryCode, setCategoryCode] = useState("");
  const { role } = useAuth();

  // Hooks
  const [searchValue] = useDebounce(searchText, 300);
  const navigate = useNavigate();

  // Queries
  const categoryQuery = useFetchCategories();
  const itemCategoryStatsQuery = useFetchItemCategoryStats();
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
          <Container maxW="100%" pl={10} pr={10}>
            <SimpleGrid minChildWidth="130px" spacing={4}>
              {itemCategoryStatsQuery?.data?.data.byCategory.map((c) => (
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
                value={itemCategoryStatsQuery?.data?.data.total}
                categoryCode={""}
              />
            </SimpleGrid>
          </Container>
        </Section>

        <Section>
          <Container minW="full">
            <Stack spacing={4}>
              {/* Filter */}
              <HStack justifyContent="space-between" spacing={2}>
                <HStack>
                  <CategoriesFilter
                    categoryCode={categoryCode}
                    setCategoryCode={setCategoryCode}
                    setPageNumber={setPageNumber}
                    query={categoryQuery}
                    stockType="S"
                  />
                </HStack>

                <HStack>
                  {hasPermission(role, "canAddItem") && (<Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={createItemDisclosure.onOpen}
                  >
                    Add New Item
                  </Button>)}
                  {/* <Button
                    variant="brand"
                    leftIcon={<MdOutlineAddCircleOutline />}
                    onClick={() => {
                      navigate("/sad/items/create");
                    }}
                  >
                    Add New Item
                  </Button> */}
                  {hasPermission(role, "canExportItems") && (<Button
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
              <ItemsTableWrapper
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

export default ItemsPage;
