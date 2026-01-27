import { Button, Heading, Stack, Text, useToast } from "@chakra-ui/react";
import {
  useGetPublicKey,
  useResetPassword,
  useSendForgotPasswordOTP,
  useVerifyOTPSignUp,
} from "../../hooks/authQueries";
import { encryptRSA } from "../../components/utils/security";
import * as yup from "yup";
import { Form, Formik } from "formik";
import InputField from "../../components/core/formik/InputField";
import { useTimer } from "react-timer-hook";
import dayjs from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordField from "../../components/core/formik/PasswordField";

const VerifyOtpForm = ({ formData, otpToken }) => {
  // Hooks
  const toast = useToast();
  const navigate = useNavigate();

  // States
  const [reOtpToken, setReOtpToken] = useState("");

  // Timer
  const expiryTimestamp = dayjs().add(3, "s").toDate();
  const timer = useTimer({
    expiryTimestamp,
    onExpire: () => {
      return;
    },
  });

  // Queries
  const publicKeyQuery = useGetPublicKey();
  const fpOtpQuery = useSendForgotPasswordOTP(
    (response) => {
      setReOtpToken(response.data.otpToken);
      timer.restart(dayjs().add(3, "s").toDate());
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.message || "OTP Sent",
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
        description: error.response.data.detail,
      });

      return error;
    }
  );
  const resetPasswordQuery = useResetPassword(
    (response) => {
      navigate("/");
      toast({
        isClosable: true,
        duration: 3000,
        position: "top-right",
        status: "success",
        title: "Success",
        description: response.data.message || "Password reset successfully",
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
        description: error.response.data.detail,
      });
      return error;
    }
  );

  // Formik
  const initialValues = {
    otp: "",
    // UNCOMMENT:
    captcha: formData.captcha,
    uuid: formData.captchaToken,
    mobileno: formData.mobileno,
    password: "",
    confirmPassword: "",
  };

  const validationSchema = yup.object({
    otp: yup
      .number()
      .typeError("OTP should contain only numbers")
      .required("OTP is required"),
    // UNCOMMENT:
    captcha: yup.string().required("Captcha is required"),
    uuid: yup.string().required("Captcha token is required"),
    mobileno: yup
      .string()
      .matches(/^\d{10}$/, "Please enter a valid mobile number")
      .required("Mobile number is required"),
    password: yup
      .string()
      .matches(/(?=.*[a-z])/, "At least 1 lowercase letter")
      .matches(/(?=.*[A-Z])/, "At least 1 uppercase letter")
      .matches(/(?=.*\d)/, "At least 1 number")
      .matches(/(?=.*[#^@$!%*?&])/, "At least 1 special character")
      .min(8, "Password must be between 8 to 255 characters")
      .max(255, "Password must be between 8 to 255 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .matches(/(?=.*[a-z])/, "At least 1 lowercase letter")
      .matches(/(?=.*[A-Z])/, "At least 1 uppercase letter")
      .matches(/(?=.*\d)/, "At least 1 number")
      .matches(/(?=.*[#^@$!%*?&])/, "At least 1 special character")
      .min(8, "Password must be between 8 to 255 characters")
      .max(255, "Password must be between 8 to 255 characters")
      .oneOf([yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });

  const onSubmit = (values) => {
    const publicKey = publicKeyQuery?.data?.data?.publicKey;

    const verifyFormData = {
      ...formData,
      otp: values.otp,
      otpToken: reOtpToken ? reOtpToken : otpToken,
    };

    verifyFormData.mobileNo = encryptRSA(formData.mobileno, publicKey);
    verifyFormData.password = encryptRSA(values.password, publicKey);
    delete verifyFormData.mobileno;
    delete verifyFormData.confirmPassword;

    resetPasswordQuery.mutate(verifyFormData);
  };

  // Handlers
  const handleResendOtp = () => {
    const publicKey = publicKeyQuery?.data?.data?.publicKey;

    if (timer.totalSeconds !== 0) return;
    fpOtpQuery.mutate({
      captcha: formData.captcha,
      uuid: formData.captchaToken,
      isSignUp: 0,
      mobileno: encryptRSA(formData.mobileno, publicKey),
    });
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
          <Stack as={Form} spacing={4}>
            <Stack>
              <Heading size="md">Verify OTP</Heading>
              <Text color="body">
                Enter the otp sent to {formData.mobileno}
              </Text>
            </Stack>

            <InputField name="otp" label="OTP" placeholder="Enter the OTP" />

            <PasswordField
              name="password"
              label="New Password"
              placeholder="Minimum 8 characters"
            />

            <PasswordField
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Retype the password above"
            />

            <Button
              type="submit"
              variant="brand"
              isLoading={resetPasswordQuery.isPending}
              loadingText="Verifying"
            >
              Verify
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOtp}
              disabled={timer.totalSeconds !== 0}
              isLoading={fpOtpQuery.isPending}
              loadingText="Sending OTP"
            >
              {timer.totalSeconds > 0
                ? `You can resend OTP in: ${timer.totalSeconds} sec`
                : "Resend OTP"}
            </Button>
          </Stack>
        );
      }}
    </Formik>
  );
};

export default VerifyOtpForm;
