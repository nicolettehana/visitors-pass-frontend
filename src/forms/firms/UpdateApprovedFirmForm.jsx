import { Form, Formik, FieldArray } from "formik";
import * as yup from "yup";
import {
  Button,
  Divider,
  Heading,
  HStack,
  VStack,
  SimpleGrid,
  Stack,
  useToast,
  Checkbox,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useCreateQuarter } from "../../hooks/quartersQueries";
import {
  useCreateFirm,
  useFetchFirmsListt,
  useCreateFirmYear,
} from "../../hooks/firmQueries";
import {
  useFetchCategories,
  useFetchYearRange,
} from "../../hooks/masterQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateQuarterAndAddOccupants } from "../../hooks/occpantsQueries";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";

const UpdateApprovedFirmForm = ({firmName, firmId}) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const categoryQuery = useFetchCategories();
  const yearRangeQuery = useFetchYearRange();
  const firmsListQuery = useFetchFirmsListt();

  const createFirmYear = useCreateFirmYear(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["firms"] });
      navigate("/sad/firms");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Approved Firm added",
      });
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail || "Unable to add approved firm.",
      });
      return error;
    }
  );

  const createQuery = useCreateQuarter(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-quarters-by-type"] });
      navigate("/est/quarters");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Quarter created successfully",
      });
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! Something went wrong. Couldn't create quarter.",
      });
      return error;
    }
  );

  const createAndAddOccupantQuery = useCreateQuarterAndAddOccupants(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["fetch-quarters-by-type"] });
      navigate("/est/quarters");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description:
          response.data.detail || "Quarter and occupants added successfully",
      });
      return response;
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description:
          error.response.data.detail ||
          "Oops! Something went wrong. Couldn't add quarter and occupants.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    categories: [],
    yearRangeId: "",

  };

  const validationSchema = yup.object({
    firmId: yup.number().required("Firm name is required"),
    yearRangeId: yup.number().required("Year Range is required"),
    categories: yup
      .array()
      .min(1, "Select at least one category")
      .required("Select at least one category"),
  });

  const onSubmit = (values) => {
    const formData = { ...values };
    console.log(formData);
    createFirmYear.mutate(formData);
    //createFirm.mutate(formData);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Stack as={Form} spacing={8}>
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
               <InputField
                name="firmId"
                label="Firm"
                placeholder={firmName}
                readOnly="true"
                value={firmName}
              />
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
             
              <VStack spacing={4} align="start">
                <Heading size="sm" flexShrink={0}>
                  Category
                </Heading>

                <FieldArray
                  name="categories"
                  render={(arrayHelpers) => {
                    // Get the selected firm object
                    const selectedFirm = firmsListQuery?.data?.data?.find(
                      (f) => f.id === formik.values.firmId
                    );

                    // If no firm selected, show nothing
                    if (!selectedFirm) return null;

                    return (
                      <Stack spacing={3}>
                        {selectedFirm.categories.map((cat) => {
                          const isChecked = formik.values.categories.includes(
                            cat.code
                          );

                          return (
                            <Checkbox
                              key={cat.code}
                              isChecked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  arrayHelpers.push(cat.code);
                                } else {
                                  const idx = formik.values.categories.indexOf(
                                    cat.code
                                  );
                                  if (idx >= 0) arrayHelpers.remove(idx);
                                }
                              }}
                            >
                              {cat.name}
                            </Checkbox>
                          );
                        })}
                      </Stack>
                    );
                  }}
                />

              </VStack>
            </SimpleGrid>

            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={
                  createQuery.isPending || createAndAddOccupantQuery.isPending
                }
                loadingText="Saving"
              >
                Add Firm
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default UpdateApprovedFirmForm;
