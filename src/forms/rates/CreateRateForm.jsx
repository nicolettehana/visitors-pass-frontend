import { Form, Formik, FieldArray } from "formik";
import * as yup from "yup";
import {
  Button,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  useToast,
  Checkbox,
  Box,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useCreateItem, useFetchItemsList } from "../../hooks/itemQueries";
import {
  useFetchCategories,
  useFetchYearRange,
  useFetchUnits,
} from "../../hooks/masterQueries";
import { useCreateRate } from "../../hooks/ratesQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";

const CreateRateForm = ({ onSuccess }) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const categoryQuery = useFetchCategories();
  const yearRangeQuery = useFetchYearRange();
  const unitQuery = useFetchUnits();

  const createRate = useCreateRate(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["rates"] });
      navigate("/sad/rates");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Rate added",
      });
      // 👉 close modal if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/sad/rates");
      }
      return response;
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
      return error;
    }
  );

  // Formik
  const initialValues = {
    categoryCode: "",
    yearRangeId: "",
    unitId: "",
    rate: "",
    itemId: "",
    searchValue: "",
    subItemId: "",
  };

  const validationSchema = yup.object({
    categoryCode: yup.string().required("Category is required"),
    yearRangeId: yup.number().required("Year Range is required"),
    unitId: yup.number().required("Unit is required"),
    rate: yup
      .number()
      .typeError("Rate must be a number")
      .required("Rate is required"),
    subItemId: yup.number(),
  });

  const onSubmit = (values) => {
    //const formData = { ...values };
    const formData = {
      ...values,
      subItems: (values.subItems || []).map((item) => item.name),
    };
    console.log(formData);
    createRate.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        const itemsQuery = useFetchItemsList(
          formik.values.categoryCode || "All",
          formik.values.searchValue || ""
        );
        const items = itemsQuery?.data?.data || [];

        const selectedItem = items.find(
          (item) => item.id === Number(formik.values.itemId)
        );

        return (
          <Stack as={Form} spacing={8}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <SelectField
                name="yearRangeId"
                label="Year Range"
                placeholder="Select year range"
              >
                {yearRangeQuery?.data?.data?.map((row) => (
                  <option key={row?.id} value={row?.id}>
                    {row?.startYear}-{row?.endYear}
                  </option>
                ))}
              </SelectField>

              <SelectField
                name="categoryCode"
                label="Item Category"
                placeholder="Select category"
              >
                {categoryQuery?.data?.data?.map((row) => (
                  row?.stockType === 'S' &&
                  <option key={row?.code} value={row?.code}>
                    {row?.name}
                  </option>
                ))}
              </SelectField>
              <SelectField
                name="itemId"
                label="Item"
                placeholder="Select item"
                disabled={!formik.values.categoryCode}
              >
                {itemsQuery?.data?.data?.map((row) => (
                  <option key={row?.id} value={row?.id}>
                    {row?.name}
                  </option>
                ))}
              </SelectField>
              {/** Render only if selected item has subItems */}
              {selectedItem?.subItems?.length > 0 && (
                <SelectField
                  name="subItemId"
                  label="Sub-Item"
                  placeholder="Select Sub-Item"
                >
                  {selectedItem.subItems.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </SelectField>
              )}
              <SelectFieldSearchable
                name="unitId"
                label="Unit"
                placeholder="Search unit"
                options={
                  unitQuery?.data?.data?.map((row) => ({
                    value: row.id,
                    label: row.unit,
                  })) || []
                }
              />

              <InputField
                name="rate"
                label="Rate"
                placeholder="Enter the rate"
                onChange={(e) => {
                  const rate = e.target.value;

                  formik.setFieldValue("rate", rate);
                }}
              />
            </SimpleGrid>

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
                Add Rate
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreateRateForm;
