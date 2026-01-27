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
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchItemsList } from "../../hooks/itemQueries";
import {
  useFetchCategories,
  useFetchUnits,
  useFetchUnitsRates,
} from "../../hooks/masterQueries";
import { useFetchFirmsList } from "../../hooks/firmQueries";
import { useCreatePurchase } from "../../hooks/purchaseQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";

const CreatePurchaseOrderForm = () => {
  const [totalCost, setTotalCost] = useState(0);
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");
  const [purchaseDate, setPurchaseDate] = useState("");

  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const categoryQuery = useFetchCategories();
  const unitQuery = useFetchUnits();
  const firmsListQuery = useFetchFirmsList(purchaseDate);
  const itemsQuery = useFetchItemsList(selectedCategoryCode);
  const items = itemsQuery?.data?.data || [];

  const allItemsQuery = useFetchItemsList("All");
  const allItems = allItemsQuery?.data?.data || [];

  const unitsRatesQuery = useFetchUnitsRates("2025-01-01");

  const createPurchase = useCreatePurchase(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["purchase"] });
      //navigate("/sad/purchase");
      navigate(-1);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "New Purchase added",
      });
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to add purchase.",
      });
    }
  );

  const initialValues = {
    fileNo:"",
    remarks: "",
    purchaseDate: "",
    firmId: "",
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
      },
    ],
  };

  const validationSchema = yup.object({
    firmId: yup.number().required("Firm is required"),
    remarks: yup.string(),
    fileNo: yup.string().required("File no. is required"),
    totalCost: yup.number(),
    items: yup.array().of(
      yup.object({
        categoryCode: yup.string().required("Please  select category"),
        itemId: yup.number().required("Please select item"),
        unitId: yup.number().required("Please select a unit"),
        quantity: yup.number().min(1).required("Quantity is required"),
        subItemId: yup.number(),
      })
    ),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log(formData);
    createPurchase.mutate(formData);
    //createRate.mutate(formData);
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
          if (!formik.values.firmId) return;

          // Reset items to a single empty row
          formik.setFieldValue("items", [
            {
              categoryCode: "",
              itemId: "",
              subItemId: "",
              unitId: "",
              quantity: "",
              rate: "",
              amount: "",
            },
          ]);

          // Reset your category filter (if applicable)
          setSelectedCategoryCode("All");
        }, [formik.values.firmId]);

        useEffect(() => {
          let total = 0;

          formik.values.items.forEach((row) => {
            const selectedItem = allItems.find(
              (item) => item.id === Number(row.itemId)
            );

            const unitsRatesFilteredList = unitsRatesQuery?.data?.data.filter(
              (item) => {
                const hasSubItems = selectedItem?.subItems?.length > 0;
                const rowHasSubItem = !!row?.subItemId;
                if (hasSubItems && rowHasSubItem) {
                  return Number(item?.subItemId) === Number(row?.subItemId);
                }
                if (!hasSubItems) return item.itemId === row.itemId;
              }
            );

            const selectedUnit = unitsRatesFilteredList?.find(
              (item) => item?.unitId === row?.unitId
            );

            if (selectedUnit && row.quantity) {
              total += selectedUnit.rate * Number(row.quantity);
            }
          });

          setTotalCost(total);
        }, [formik.values.items, unitsRatesQuery.data]);

        return (
          <Stack as={Form} spacing={8}>
            {/* Top Form Fields */}
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <InputField
                name="fileNo"
                label="File No."
                placeholder="Enter file no."
              />
              <InputField
                type="date"
                name="purchaseDate"
                max={dayjs().format("YYYY-MM-DD")}
                label="Date"
                onChange={(e) => {
                  formik.setFieldValue("purchaseDate", e.target.value);
                  setPurchaseDate(e.target.value);
                }}
              />

              <SelectFieldSearchable
                name="firmId"
                label="Firm"
                placeholder="Select Firm"
                disabled={!formik.values.purchaseDate}
                options={
                  firmsListQuery?.data?.data?.map((row, index) => ({
                    value: row.id,
                    label: row.firm,
                  })) || []
                }
              />
              {/* <InputField
                name="remarks"
                label="Remarks"
                placeholder="Enter remarks"
              /> */}
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

                      const unitsRatesFilteredList =
                        unitsRatesQuery?.data?.data.filter((item) => {
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

                      const selectedUnit = unitsRatesFilteredList?.find(
                        (item) => item?.unitId === row?.unitId
                      );

                      const filteredCategories =
                        categoryQuery?.data?.data.filter((item) => {
                          const matchingFirm = firmsListQuery?.data?.data.find(
                            (firm) =>
                              Number(formik.values?.firmId) === Number(firm.id)
                          );
                          if (!matchingFirm) return false;

                          // Check if ANY of the firm's categories matches item.code
                          return matchingFirm.categories?.some(
                            (cat) => cat.code === item.code
                          );
                        });

                      

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
                                disabled={!formik.values.firmId}
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
                                {/* {filteredCategories.map((row, index) => (
                                  <option key={row.code} value={row.code}>
                                    {row.name}
                                  </option>
                                ))} */}
                                {categoryQuery?.data?.data?.map((row) => (
                                  row?.stockType === 'S' &&
                                  <option key={row.code} value={row.code}>
                                    {row.name}
                                  </option>
                                ))}
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

                            <InputField
                              name={`items[${index}].quantity`}
                              label="Quantity"
                              placeholder="Enter quantity"
                            />

                            <SelectFieldSearchable
                              name={`items[${index}].unitId`}
                              label="Unit"
                              placeholder="Search unit"
                              options={
                                //unitsRatesFilteredListQuery?.data?.data?.map((row) => ({
                                unitsRatesFilteredList?.map((row, index) => ({
                                  value: row.unitId,
                                  label: row.unit,
                                })) || []
                              }
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

                              {/* <Spacer /> */}

                              {/* Rate + Amount Vertical Stack */}
                              {/* <VStack align="flex-end" spacing={0} mt={4}>
                                <HStack spacing={2}>
                                  <FormLabel m={0}>Rate:</FormLabel>
                                  <Text fontWeight="bold">
                                    {selectedUnit?.rate
                                      ? "₹" + selectedUnit.rate
                                      : "-"}
                                  </Text>
                                </HStack>

                                <HStack spacing={2}>
                                  <FormLabel m={0}>Amount:</FormLabel>
                                  <Text fontWeight="bold">
                                    {selectedUnit?.rate
                                      ? "₹" + selectedUnit.rate * row?.quantity
                                      : "-"}
                                  </Text>
                                </HStack>
                              </VStack> */}
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

            {/* Total Cost */}
            {/* <HStack spacing={2} justifyContent="end">
              <FormLabel m={0}>Total:</FormLabel>
              <Text fontWeight="bold">{"₹" + totalCost}</Text>
              <Text fontWeight="bold"></Text>
            </HStack> */}

            {/* Submit Buttons */}
            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={createPurchase.isPending}
                loadingText="Saving"
              >
                Submit
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreatePurchaseOrderForm;
