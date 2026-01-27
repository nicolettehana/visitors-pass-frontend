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
import { useCreateItem } from "../../hooks/itemQueries";
import { useFetchCategories } from "../../hooks/masterQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const CreateItemForm = ({ onSuccess }) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();
  const categoryQuery = useFetchCategories();

  const createItem = useCreateItem(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      navigate("/sad/items");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Item added",
      });

      // 👉 close modal if provided, otherwise navigate
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/sad/items");
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
        description: error.response.data.detail || "Unable to add new item.",
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    itemName: "",
    category: "",
    hasSubItems: false,
    subItems: [],
  };

  const validationSchema = yup.object({
    itemName: yup.string().required("Item name is required"),
    category: yup.string().required("Category is required"),
    // only validate sub-items if hasSubItems is true
    // subItems: yup.array().when("hasSubItems", (hasSubItems, schema) => {
    //   return hasSubItems
    //     ? schema.of(
    //         yup.object({
    //           name: yup.string().required("Sub-item name is required"),
    //         })
    //       )
    //     : schema.of(yup.object());
    // }),

    hasSubItems: yup.boolean(), // optional validation
  });

  const onSubmit = (values) => {
    //const formData = { ...values };
    const formData = {
      ...values,
      subItems: values.subItems.map((item) => item.name), // <-- convert to List<String>
    };

    createItem.mutate(formData);
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
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              
              <SelectField
                name="category"
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
              <InputField
                name="itemName"
                label="Item Name"
                placeholder="Enter the item name"
                onChange={(e) => {
                  const itemName = e.target.value;

                  formik.setFieldValue("itemName", itemName);
                }}
              />
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, md: 1 }} gap={4}>
              {/* Checkbox group */}

              <Checkbox
                isChecked={formik.values.hasSubItems}
                onChange={(e) => {
                  const checked = e.target.checked;
                  formik.setFieldValue("hasSubItems", checked);

                  if (checked && formik.values.subItems.length === 0) {
                    formik.setFieldValue("subItems", [{ name: "" }]); // <-- create first row
                  }

                  if (!checked) {
                    formik.setFieldValue("subItems", []); // <-- clear when unchecked
                  }
                }}
              >
                Does this item have sub-items?
              </Checkbox>
            </SimpleGrid>

            {formik.values.hasSubItems && (
              <FieldArray name="subItems">
                {(arrayHelpers) => (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 1 }} gap={2}>
                      {formik.values.subItems.map((subItem, index) => (
                        <Box
                          key={index}
                          display="flex"
                          alignItems="center"
                          gap={2}
                          
                        >
                          <HStack width="100%" align="flex-end">
                            <Box flex="1">
                              <InputField
                                name={`subItems.${index}.name`}
                                value={subItem.name}
                                placeholder="Sub-item Name"
                                label=" Sub-item Name"
                                onChange={(e) =>
                                  formik.setFieldValue(
                                    `subItems.${index}.name`,
                                    e.target.value
                                  )
                                }
                              />
                            </Box>

                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => arrayHelpers.remove(index)}
                            >
                              Remove
                            </Button>
                          </HStack>

                        </Box>
                      ))}
                    </SimpleGrid>
                    <SimpleGrid columns={{ base: 1, md: 6 }} gap={4}>
                      <Button
                        type="button"
                        variant="brand"
                        minW="fit-content"
                        mt={2}
                        onClick={() => arrayHelpers.push({ name: "" })}
                      >
                        + Add Sub-Item
                      </Button>
                    </SimpleGrid>
                  </>
                )}
              </FieldArray>
            )}

            <HStack justifyContent="end">
              {/* <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button> */}
              <Button
                type="submit"
                variant="brand"
                isLoading={createItem.isPending}
                loadingText="Saving"
              >
                Add Item
              </Button>
            </HStack>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default CreateItemForm;
