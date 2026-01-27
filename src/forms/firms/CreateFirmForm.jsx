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
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useCreateFirm } from "../../hooks/firmQueries";
import { useFetchCategories } from "../../hooks/masterQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CreateFirmForm = ({ onSuccess }) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const categoryQuery = useFetchCategories();

  const createFirm = useCreateFirm(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["firms"] });
      navigate("/sad/firms");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Firm added",
      });
      // 👉 close modal if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/sad/firms");
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
        description: error.response.data.detail || "Unable to add new firm.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    firmName: "",
    categories: [],
  };

  const validationSchema = yup.object({
    firmName: yup.string().required("Firm name is required"),
    // categories: yup
    //   .array()
    //   .min(1, "Select at least one category")
    //   .required("Select at least one category"),
  });

  const onSubmit = (values) => {
    const formData = { ...values };

    createFirm.mutate(formData);
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
            <SimpleGrid columns={{ base: 1, md: 1 }} gap={4}>
              <InputField
                name="firmName"
                label="Firm Name"
                placeholder="Enter the firm name"
                onChange={(e) => {
                  const firmName = e.target.value;

                  formik.setFieldValue("firmName", firmName);
                }}
              />
            </SimpleGrid>

            {/* <HStack spacing={4}>
              <Heading size="sm" flexShrink={0}>
                Category
              </Heading>
              <Divider />
            </HStack> */}

            {/* <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              
              <FieldArray
                name="categories"
                render={(arrayHelpers) => (
                  <Stack spacing={3}>
                    {categoryQuery?.data?.data?.map((row) => {
                      const isChecked = formik.values.categories.includes(
                        row.code
                      );

                      return (
                        <Checkbox
                          key={row.code}
                          isChecked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              arrayHelpers.push(row.code);
                            } else {
                              arrayHelpers.remove(
                                formik.values.categories.indexOf(row.code)
                              );
                            }
                          }}
                        >
                          {row.name}
                        </Checkbox>
                      );
                    })}
                  </Stack>
                )}
              />
            </SimpleGrid> */}

            <HStack justifyContent="end">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button
                type="submit"
                variant="brand"
                isLoading={createFirm.isPending}
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

export default CreateFirmForm;
