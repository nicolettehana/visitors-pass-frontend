import { Form, Formik, FieldArray } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import {
  Button,
  HStack,
  VStack,
  SimpleGrid,
  Stack,
  useToast,
  Box,
  FormLabel,
  Text,
  Flex,
  Spacer,
  Badge,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchItemsList } from "../../hooks/itemQueries";
import {
  useFetchCategories,
  useFetchUnits,
  useFetchUnitsRates,
  useFetchUnitsBalance,
} from "../../hooks/masterQueries";
import { useFetchFirmsList } from "../../hooks/firmQueries";
import { useCreateRate } from "../../hooks/ratesQueries";
import { useCreatePurchase } from "../../hooks/purchaseQueries";
import { useCreateIssue } from "../../hooks/issueQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";

const CreateIssueForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");
  const [issueDate, setIssueDate] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();
  const firmsListQuery = useFetchFirmsList(issueDate);
  const itemsQuery = useFetchItemsList(selectedCategoryCode);
  const items = itemsQuery?.data?.data || [];

  const allItemsQuery = useFetchItemsList("All");
  const allItems = allItemsQuery?.data?.data || [];

  const unitsRatesQuery = useFetchUnitsRates(issueDate || "2025-12-05");
  const unitsBalanceQuery = useFetchUnitsBalance();

  const createRate = useCreateRate(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
      //navigate("/sad/rates");
      navigate(-1);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Rate added",
      });
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to add rate.",
      });
    }
  );

  const createIssue = useCreateIssue(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["issue"] });
      //navigate("/sad/issue");
      navigate(-1);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Issue saved",
      });
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to save issue.",
      });
    }
  );

  const initialValues = {
    remarks: "",
    issueDate: "",
    issueTo: "",
    totalCost: "",
    items: [
      {
        categoryCode: "",
        itemId: "",
        subItemId: "",
        unitId: "",
        quantity: "",
        rate: "",
        amount: "",
        balance: 0,
      },
    ],
  };

  const validationSchema = yup.object({
    issueDate: yup.date().required("Please select issue date"),
    issueTo: yup.string().required("Please enter who item is issued to"),
    remarks: yup.string(),
    totalCost: yup.number(),
    items: yup
      .array()
      .of(
        yup.object({
          categoryCode: yup.string().required("Please  select category"),
          itemId: yup.number().required("Please select item"),
          subItemId: yup.number(),
          unitId: yup.number().required("Please select a unit"),
          quantity: yup
            .number()
            .required("Quantity is required")
            .min(1, "Quantity must be at least 1")
            .test(
              "does-not-exceed-balance",
              "Quantity cannot exceed available balance",
              function (value) {
                const { balance } = this.parent; // <-- get balance from row
                if (!value || balance == null) return true;
                return Number(value) <= Number(balance);
              }
            ),
        })
      )
      .test(
        "unique-item-subitem-unit",
        "Duplicate item + sub-item + unit is not allowed",
        function (rows) {
          if (!rows) return true;

          const seen = new Set();

          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const key = `${row.itemId || 0}-${row.subItemId || 0}-${
              row.unitId || 0
            }`;

            if (seen.has(key)) {
              return this.createError({
                path: `items[${i}].itemId`, // attach error to the row
                message: "This item  + unit selection is already added",
              });
            }

            seen.add(key);
          }

          return true;
        }
      ),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log(formData);
    createIssue.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        useEffect(() => {
          let total = 0;

          formik.values.items.forEach((row, index) => {
            const selectedItem = allItems.find(
              (item) => item.id === Number(row.itemId)
            );

            const unitsBalanceFilteredList =
              unitsBalanceQuery?.data?.data.filter((item) => {
                const hasSubItems = selectedItem?.subItems?.length > 0;
                const rowHasSubItem = !!row?.subItemId;
                if (hasSubItems && rowHasSubItem) {
                  return Number(item?.subItemId) === Number(row?.subItemId);
                }
                if (!hasSubItems) return item.itemId === row.itemId;
              });

            const selectedUnit = unitsBalanceFilteredList?.find(
              (item) => item?.unitId === row?.unitId
            );
            formik.setFieldValue(
              `items[${index}].balance`,
              selectedUnit?.balance || 0
            );

            if (selectedUnit && row.quantity) {
              total += selectedUnit.rate * Number(row.quantity);
            }
          });

          setTotalCost(total);
        }, [formik.values.items, unitsBalanceQuery.data]);

        return (
          <Stack as={Form} spacing={8}>
            {/* Top Form Fields */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <InputField
                type="date"
                name="issueDate"
                max={dayjs().format("YYYY-MM-DD")}
                label="Issue Date"
                onChange={(e) => {
                  formik.setFieldValue("issueDate", e.target.value);
                  setIssueDate(e.target.value);
                }}
              />
              <InputField
                name="issueTo"
                label="Issue To"
                placeholder="Enter to whom issued"
              />

              <InputField
                name="remarks"
                label="Remarks"
                placeholder="Enter remarks"
              />
            </SimpleGrid>

            <Text fontWeight="bold" fontSize="lg">
              Items List
            </Text>
            <Box border="1px solid #ddd" p={4} borderRadius="md">
              {/* Items Field Array */}
              <FieldArray name="items">
                {({ push, remove }) => (
                  <Stack spacing={8}>
                    {formik.values.items.map((row, index) => {
                      const filteredItems = allItems.filter(
                        (item) => item.category.code === row.categoryCode
                      );
                      const selectedItem = allItems.find(
                        (item) => item.id === Number(row.itemId)
                      );

                      const unitsBalanceFilteredList =
                        unitsBalanceQuery?.data?.data.filter((item) => {
                          const hasSubItems =
                            selectedItem?.subItems?.length > 0;
                          const rowHasSubItem = !!row?.subItemId;
                          if (hasSubItems && rowHasSubItem) {
                            return (
                              Number(item?.subItemId) === Number(row?.subItemId)
                            );
                          }
                          if (!hasSubItems) return item.itemId === row.itemId;
                        });

                      const selectedUnit = unitsBalanceFilteredList?.find(
                        (item) => item?.unitId === row?.unitId
                      );

                      return (
                        <Box
                          key={index}
                          p={4}
                          //border="1px solid #ddd"
                          borderRadius="md"
                        >
                          <SimpleGrid columns={{ base: 1, md: 6 }} gap={4}>
                            <Flex align="flex-end" justify="center" gap={2}>
                              <FormLabel m={0} w="35px" textAlign="center">
                                <b>
                                  {index + 1}
                                  {". "}
                                </b>
                              </FormLabel>
                              <SelectField
                                name={`items[${index}].categoryCode`}
                                label="Category"
                                placeholder="Select category"
                                onValueChange={(value) => {
                                  setSelectedCategoryCode(value);
                                  formik.setFieldValue(
                                    `items[${index}].itemId`,
                                    ""
                                  );
                                  formik.setFieldValue(
                                    `items[${index}].subItemId`,
                                    ""
                                  );
                                }}
                              >
                                {categoryQuery?.data?.data?.map(
                                  (row, index) => (
                                    row?.stockType === 'S' &&
                                    <option key={row.code} value={row.code}>
                                      {row.name}
                                    </option>
                                  )
                                )}
                              </SelectField>
                            </Flex>

                            <SelectFieldSearchable
                              name={`items[${index}].itemId`}
                              label="Item"
                              placeholder="Select Item"
                              disabled={!row.categoryCode}
                              onValueChange={(value) => {
                                formik.setFieldValue(
                                  `items[${index}].itemId`,
                                  value
                                );

                                // Reset subItem
                                formik.setFieldValue(
                                  `items[${index}].subItemId`,
                                  ""
                                );
                              }}
                              options={
                                filteredItems.map((row, index) => ({
                                  value: row.id,
                                  label: row.name,
                                })) || []
                              }
                            />

                            {selectedItem?.subItems?.length > 0 && (
                              <SelectField
                                name={`items[${index}].subItemId`}
                                label="Sub-Item"
                                placeholder="Select Sub-Item"
                              >
                                {selectedItem.subItems.map((sub, index) => (
                                  <option key={sub.id} value={sub.id}>
                                    {sub.name}
                                  </option>
                                ))}
                              </SelectField>
                            )}

                            <SelectFieldSearchable
                              name={`items[${index}].unitId`}
                              label="Unit"
                              placeholder="Search unit"
                              options={
                                unitsBalanceFilteredList?.map((row, index) => ({
                                  value: row.unitId,
                                  label: row.unit,
                                })) || []
                              }
                            />
                            <InputField
                              name={`items[${index}].quantity`}
                              label="Quantity"
                              placeholder="Enter quantity"
                            />

                            {selectedItem?.subItems?.length > 0 ? (
                              ""
                            ) : (
                              <Box /> // empty placeholder to keep grid column
                            )}

                            <HStack justifyContent="start" w="100%">
                              {/* Remove Button */}
                              <Button
                                mt={8}
                                colorScheme="red"
                                variant="outline"
                                onClick={() => remove(index)}
                              >
                                -
                              </Button>

                              <Spacer />

                              {/* Balance */}
                              <VStack align="flex-end" spacing={0} mt={4}>
                                <HStack spacing={2}>
                                  <Text fontWeight="bold">
                                    {selectedUnit?.balance ? (
                                      <Badge colorScheme="green" fontSize="sm">
                                        {"Balance: " + selectedUnit.balance}
                                      </Badge>
                                    ) : (
                                      <Badge colorScheme="red" fontSize="sm">
                                        {"Balance: " + 0}
                                      </Badge>
                                    )}
                                  </Text>
                                </HStack>
                              </VStack>
                            </HStack>
                          </SimpleGrid>
                        </Box>
                      );
                    })}

                    {/* Single Add Item Button */}
                    <HStack justifyContent="end">
                      <Button
                        mt={4}
                        variant="solid"
                        colorScheme="green"
                        onClick={() =>
                          push({
                            categoryCode: "",
                            itemId: "",
                            subItemId: "",
                            unitId: "",
                            quantity: "",
                            rate: "",
                            amount: "",
                            balance: 0,
                          })
                        }
                      >
                        + Add Item
                      </Button>
                    </HStack>
                  </Stack>
                )}
              </FieldArray>
            </Box>

            {/* Submit Buttons */}
            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={createRate.isPending}
                loadingText="Saving"
              >
                Add Issue
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreateIssueForm;
