import { Form, Formik, FieldArray, Field } from "formik";
import { useEffect, useState } from "react";
import * as yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  FormControl,
  Input,
  FormErrorMessage,
} from "@chakra-ui/react";
import InputField from "../../components/core/formik/InputField";
import { useFetchItemsList } from "../../hooks/itemQueries";
import {
  useFetchCategories,
  useFetchUnits,
  useFetchUnitsRates,
} from "../../hooks/masterQueries";
import { useFetchFirmsList } from "../../hooks/firmQueries";
import { useCreateRegistration } from "../../hooks/registrationQueries";
import SelectField from "../../components/core/formik/SelectField";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import SelectFieldSearchable from "../../components/core/formik/SelectFieldSearchable";
import dayjs from "dayjs";
import { MdHorizontalRule } from "react-icons/md";
import PhotoInput from "./PhotoInput";

const getCameras = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((d) => d.kind === "videoinput");
};

const RegistrationForm = () => {
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("All");
  const [purchaseDate, setPurchaseDate] = useState("");

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ].sort();

  const moodOptions = [
    "To meet Minister",
    "To meet Chief Secretary",
    "To attend meeting/function",
    "To meet officers",
    "To visit Department",
  ];

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

  const createRegistration = useCreateRegistration(
    (response) => {
      queryClient.invalidateQueries({ queryKey: ["visitors"] });
      //navigate("/sad/purchase");
      navigate(-1);
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.detail || "Registered",
      });
    },
    (error) => {
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "error",
        title: "Error",
        description: error.response.data.detail || "Unable to register.",
      });
    },
  );

  const initialValues = {
    name: "",
    noOfVisitors: "",
    state: "",
    address: "",
    purpose: "",
    purposeDetails: "",
    mobileNo: "",
    email: "",
    dateTime: null,
    photo: null,
  };

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    noOfVisitors: yup.number().required("No. of visitors is required"),
    state: yup.string().required("State is required"),
    address: yup.string().required("Address is required"),
    purpose: yup.string().required("Purpose is required"),
    purposeDetails: yup.string("Purpose Details/Name is required"),
    mobileNo: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Invalid mobile number")
      .required("Mobile no. is required"),
    email: yup.string().email("Invalid email address"),
    dateTime: yup
      .date()
      .typeError("Invalid date & time")
      .required("Date & time is required"),
    photo: yup
      .mixed()
      .required("Photo is required")
      .test(
        "fileType",
        "Only JPG or PNG allowed",
        (v) => v && ["image/jpeg", "image/png"].includes(v.type),
      ),
  });

  const onSubmit = (values) => {
    const formData = new FormData();

    // build visitor JSON (NO photo here)
    const visitor = {
      name: values.name,
      noOfVisitors: values.noOfVisitors,
      state: values.state,
      address: values.address,
      purpose: values.purpose,
      purposeDetails: values.purposeDetails,
      mobileNo: values.mobileNo,
      email: values.email,
      visitDateTime: dayjs(values.dateTime).format("YYYY-MM-DDTHH:mm:ss"),
    };

    // must be STRING
    formData.append(
      "visitor",
      new Blob([JSON.stringify(visitor)], {
        type: "application/json",
      }),
    );

    // file part
    formData.append("photo", values.photo);

    createRegistration.mutate(formData);
  };

  // const onSubmit = (values) => {
  //   const formData = { ...values };
  //   console.log(formData);
  //   createPurchase.mutate(formData);
  //   //createRate.mutate(formData);
  // };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => {
        return (
          <Stack as={Form} spacing={8}>
            {/* Top Form Fields */}
            {/* <Text fontWeight="bold" fontSize="lg">Applicant Details:</Text> */}
            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <InputField
                name="name"
                label="Applicant's Name"
                placeholder="Enter name"
              />
              <InputField
                name="noOfVisitors"
                label="No. of visitors"
                placeholder="Enter no. of visitors"
              />
              <SelectFieldSearchable
                name="state"
                label="State"
                placeholder="Select State"
                options={indianStates.map((state) => ({
                  value: state,
                  label: state,
                }))}
              />
              <InputField
                name="address"
                label="Address"
                placeholder="Enter address"
              />
              <SelectFieldSearchable
                name="purpose"
                label="Purpose"
                placeholder="Select Purpose"
                options={moodOptions.map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
              <InputField
                name="purposeDetails"
                label="Purpose Details/Name"
                placeholder="Enter purpose details/name"
              />
              <InputField
                name="mobileNo"
                label="Mobile No."
                placeholder="Enter Mobile no."
              />
              <InputField
                name="email"
                label="E-mail"
                placeholder="Enter E-mail"
                isRequired={false}
              />

              <InputField
                name="dateTime"
                label="Date & Time of visit"
                type="datetime-local"
                fontSize="sm"
              />
              <Field name="photo">
                {({ field, form }) => (
                  <PhotoInput
                    value={field.value}
                    onChange={(file) => form.setFieldValue("photo", file)}
                  />
                )}
              </Field>

              {/* <Field name="photo">
                {({ form }) => (
                  <PhotoInput
                    onChange={(file) => form.setFieldValue("photo", file)}
                  />
                )}
              </Field> */}

              {/* <Field name="photo">
                {({ form, meta }) => (
                  <FormControl isInvalid={meta.touched && meta.error}>
                    <FormLabel fontSize="sm">Upload Photo</FormLabel>

                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={(event) => {
                        form.setFieldValue(
                          "photo",
                          event.currentTarget.files[0],
                        );
                      }}
                    />

                    <FormErrorMessage>{meta.error}</FormErrorMessage>
                  </FormControl>
                )}
              </Field> */}

              {/* <DatePicker
                selected={formik.values.dateTime}
                onChange={(date) => formik.setFieldValue("dateTime", date)}
                showTimeSelect
                timeFormat="hh:mm aa"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
              /> */}
            </SimpleGrid>

            {/* Submit Buttons */}
            <HStack justifyContent="end">
              {/* <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button> */}
              <Button
                type="submit"
                variant="brand"
                isLoading={createRegistration.isPending}
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

export default RegistrationForm;
