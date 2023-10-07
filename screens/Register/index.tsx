import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Formik, FormikProps } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Input from "../../components/input";
import { useAppDispatch } from "../../redux/hooks";
import { registerUser } from "../../redux/slices/authSlice";
import { FormValues } from "../../utils/types";
import { useDispatch } from "react-redux";
import { StackNavigation } from "../../components/Layout";

const Register = () => {
  const navigation = useNavigation<StackNavigation>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const initialValues: FormValues = {
    email: "",
    name: "",
    password: "",
    isCheck: false,
    image: "",
  };

  const onSubmit = (values: FormValues) => {};

  const getCharacterValidationError = (str: string) => {
    return `Your password must have at least 1 ${str} character`;
  };
  const registerSchema = Yup.object().shape({
    name: Yup.string()
      .label("Name")
      .required()
      .min(2, "Must have at least 2 characters"),
    email: Yup.string()
      .email("Email is invalid")
      .required("Please input your email"),
    password: Yup.string()
      .min(8)
      .required("Password is required")
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
    isCheck: Yup.boolean().oneOf([true], "Please check the agreement"),
    image: Yup.string().required("image is required"),
  });

  return (
    <SafeAreaView className='px-6 pt-5'>
      <KeyboardAvoidingView>
        <View className='flex-row justify-center  items-center h-[66px]'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name='chevron-back' size={44} color='black' />
          </TouchableOpacity>

          <Text className='flex-1 text-lg font-bold text-center text-primaryDark'>
            Sign Up
          </Text>
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={async (values) => {
            const data = {
              email: values.email,
              name: values.name,
              password: values.password,
              image: values.image,
            };
            dispatch(registerUser({ ...data }));
          }}
          validationSchema={registerSchema}>
          {({
            values,
            errors,
            touched,
            isValid,
            handleChange,
            handleSubmit,
            setFieldTouched,
            setFieldValue,
          }: FormikProps<FormValues>) => (
            <>
              <View className='relative mt-6 mb-14'>
                <Input
                  error={errors?.name}
                  icon={"account-outline"}
                  onFocus={() => setFieldTouched("name")}
                  placeholder='Enter your name'
                  onChangeText={handleChange("name")}
                  touched={touched.name}
                  value={values.name}
                />
                <Input
                  error={errors?.email}
                  icon={"email-outline"}
                  onFocus={() => setFieldTouched("email")}
                  placeholder='Enter your email'
                  onChangeText={handleChange("email")}
                  touched={touched.email}
                  value={values.email}
                />
                <Input
                  icon={"image-outline"}
                  onFocus={() => setFieldTouched("image")}
                  error={errors.image}
                  placeholder='Set image'
                  onChangeText={handleChange("image")}
                  touched={touched.image}
                  value={values.image}
                />
                <Input
                  password
                  icon={"lock-outline"}
                  onFocus={() => setFieldTouched("password")}
                  error={errors.password}
                  placeholder='Enter your password'
                  onChangeText={handleChange("password")}
                  touched={touched.password}
                  value={values.password}
                />

                <View className='flex-row items-center gap-4 pl-3'>
                  <Checkbox
                    className='w-[30px] h-[30px] bg-transparent rounded-[8px]'
                    value={values.isCheck}
                    onValueChange={() =>
                      setFieldValue("isCheck", !values.isCheck)
                    }
                    color={
                      errors.isCheck
                        ? "#FF5C5C"
                        : values.isCheck
                        ? "#199A8E"
                        : "#A1A8B0"
                    }
                  />

                  <Text className='text-sm font-medium w-[290px] text-medicalBlack '>
                    I agree to the medidoc{" "}
                    <Text className='text-primary'>Terms of Service </Text>and
                    <Text className='text-primary'> Privacy Policy</Text>
                  </Text>
                </View>
                {errors.isCheck && (
                  <Text className='text-[#FF5C5C] ml-4 mt-2 text-sm'>
                    {errors.isCheck}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  handleSubmit();
                }}
                disabled={!isValid}
                className={`items-center justify-center w-full h-12 rounded-full ${
                  isValid ? "bg-primary" : "bg-medical"
                }`}>
                <Text className='text-base font-semibold leading-6 text-white'>
                  Sign Up
                </Text>
              </TouchableOpacity>

              <View className='mx-auto mt-6'>
                <Text className='text-primaryGray text-base tracking-[0.5px]'>
                  Already have account?{" "}
                  <Text
                    onPress={() => navigation.navigate("Login")}
                    className='text-primary'>
                    Sign In
                  </Text>
                </Text>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({});
