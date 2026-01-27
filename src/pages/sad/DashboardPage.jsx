import Main from "../../components/core/semantics/Main";
import Section from "../../components/core/semantics/Section";
import { AiFillWarning } from "react-icons/ai";
import { FaExclamationTriangle } from "react-icons/fa";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { MdWarningAmber } from "react-icons/md";
import InventoryCard from "../../components/stats/InventoryCard";
import ExpensePieChart from "../../components/charts/ExpensePieChart";

import {
  Box,
  Container,
  Grid,
  Heading,
  SimpleGrid,
  VStack,
  Flex,
  Icon,
} from "@chakra-ui/react";

import StatCard from "../../components/core/theme/StatCard";
import StockList from "../../components/core/theme/StockList";
import { useFetchYearRange, useFetchItemInStockCategoryStats } from "../../hooks/masterQueries";
import {
  useFetchCategoryStats,
  useFetchItemCategoryStats,
  useFetchCategories
} from "../../hooks/masterQueries";
import { useFetchItemsLevelList } from "../../hooks/balanceQueries";
import { useFetchAmount } from "../../hooks/purchaseQueries";
import StatSummaryCard from "../../components/core/theme/StatSummaryCard";
import { useState } from "react";
import SelectField from "../../components/core/formik/SelectField";
import { Form, Formik } from "formik";
//import { MdWarningAmber } from "react-icons/md";

const YearRangePage = () => {
  const today = new Date();
  const currentYear = today.getFullYear();

  const isBeforeApril = today.getMonth() < 3;
  const [year, setYear] = useState(
    isBeforeApril ? currentYear - 1 : currentYear
  );

  // Queries
  const itemsStatsQuery = useFetchItemCategoryStats();
  const firmsStatsQuery = useFetchCategoryStats('');
  const itemsInStockStatsQuery = useFetchItemInStockCategoryStats();
  const outOfStockQuery = useFetchItemsLevelList(0);
  const lowStockQuery = useFetchItemsLevelList(10);
  const amountQuery = useFetchAmount(year);
  const categoriesQuery = useFetchCategories();

  const finalStartYear = isBeforeApril ? currentYear - 1 : currentYear;
  const finalEndYear = finalStartYear + 1;
  const baseStartYear = 2024;

  const yearOptions = [];
  for (let y = baseStartYear; y <= finalStartYear; y++) {
    yearOptions.push(`${y}-${y + 1}`);
  }

  return (
    <Main>
      <Container maxW="100%" py={2}>
        <Grid templateColumns={{ base: "1fr", lg: "4fr 400px" }} gap={6}>
          {/* LEFT SECTION */}
          <VStack align="stretch" spacing={6}>
            {/* TOP KPI CARDS */}
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {/* <StatSummaryCard
                bg="#F3F5F8"
                fcolor="brand.900"
                title="Items In Stock"
                total={itemsInStockStatsQuery?.data?.data.total}
                //categories={categoriesQuery?.data?.data?.length<5? (itemsInStockStatsQuery?.data?.data.byCategory):null}
              /> */}
              <StatSummaryCard
                bg="#F3F5F8"//"#E9EDF1"
                fcolor="brand.900"
                title="Total Firms"
                total={firmsStatsQuery?.data?.data.total}
                //categories={firmsStatsQuery?.data?.data.byCategory}
              />
              <StatSummaryCard
                //bg="#E9EDF1"
                bg="#E9EDF1"//"#D8E0E7"
                fcolor="brand.800"
                title="Total Items"
                total={itemsStatsQuery?.data?.data.total}
                categories={categoriesQuery?.data?.data?.length<5? (itemsStatsQuery?.data?.data.byCategory):null}
              />
            </SimpleGrid>

            {/* STOCK LIST SECTION */}
            {/* <Box bg="gray.50" p={6} borderRadius="lg" boxShadow="md"> */}
            <Box pt={6} borderRadius="lg" minW="0" w="full">
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Box w="100%">
                  <InventoryCard
                    title="Out of Stock"
                    data={outOfStockQuery?.data?.data}
                    iconColor="red"
                  />
                </Box>

                <Box w="100%">
                  <InventoryCard
                    title="Low Stock"
                    data={lowStockQuery?.data?.data}
                    iconColor="orange"
                  />
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>

          {/* RIGHT SIDEBAR */}
          <Formik
            enableReinitialize={true}
            initialValues={{ year: year + "-" + (year + 1) }} // <-- Add your initial values here
            onSubmit={(values) => {
              console.log("Form Submitted:", values);
            }}
          >
            {(formik) => (
              <Form>
                <Box
                  bg="white"
                  p={6}
                  borderRadius="lg"
                  boxShadow="2xl"
                  h="100%"
                  border="1px solid"
                  borderColor="gray.300"
                >
                  <Heading size="md" mb={4}>
                    <SelectField
                      name="year"
                      label="Financial Year"
                      placeholder="Select financial year"
                      onValueChange={(value) => {
                        const startYear = value.split("-")[0];
                        setYear(Number(startYear));
                      }}
                    >
                      {yearOptions?.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </SelectField>
                  </Heading>

                  {/* Example: Use formik.values.year to drive your chart */}
                  <ExpensePieChart data={amountQuery?.data?.data} />
                </Box>
              </Form>
            )}
          </Formik>
        </Grid>
      </Container>
    </Main>
  );
};

export default YearRangePage;
