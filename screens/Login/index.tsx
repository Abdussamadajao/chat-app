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
import { Formik, Field, FormikProps, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Input from "../../components/input";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import { StackNavigation } from "../../components/Layout";

interface FormValues {
  email: string;
  password: string;
}

const Login = () => {
  const navigation = useNavigation<StackNavigation>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const initialValues: FormValues = {
    password: "",
    email: "",
  };

  const getCharacterValidationError = (str: string) => {
    return `Your password must have at least 1 ${str} character`;
  };
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Email is invalid")
      .required("Please input your email"),
    password: Yup.string()
      .min(8)
      .required("Password is required")
      .matches(/[0-9]/, getCharacterValidationError("digit"))
      .matches(/[a-z]/, getCharacterValidationError("lowercase"))
      .matches(/[A-Z]/, getCharacterValidationError("uppercase")),
  });

  return (
    <SafeAreaView className='px-6 pt-5'>
      <KeyboardAvoidingView>
        <View className='flex-row justify-center  items-center h-[66px]'>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons
              name='chevron-left'
              size={44}
              color='black'
            />
          </TouchableOpacity>

          <Text className='flex-1 text-lg font-bold text-center text-primaryDark'>
            Login
          </Text>
        </View>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            const data = {
              email: values.email,

              password: values.password,
            };
            dispatch(loginUser({ ...data }));
          }}
          validationSchema={loginSchema}>
          {({
            values,
            errors,
            touched,
            isValid,
            handleSubmit,
            handleChange,
            setFieldTouched,
          }: FormikProps<FormValues>) => (
            <>
              <View className='relative mt-6 mb-14'>
                <Input
                  value={values.email}
                  error={errors?.email}
                  icon={"email-outline"}
                  onFocus={() => setFieldTouched("email")}
                  placeholder='Enter your email'
                  onChangeText={handleChange("email")}
                  touched={touched.email}
                />

                <Input
                  value={values.password}
                  icon={"lock-outline"}
                  onFocus={() => setFieldTouched("password")}
                  password
                  error={errors.password}
                  placeholder='Enter your password'
                  onChangeText={handleChange("password")}
                  touched={touched.password}
                />
                {/* <TouchableOpacity
                  onPress={() => navigation.navigate("ForgotPassword")}
                  className='absolute right-0 px-2 -bottom-2'>
                  <Text className='text-sm font-medium text-primary'>
                    Forgot Password?
                  </Text>
                </TouchableOpacity> */}
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    handleSubmit();
                  }}
                  disabled={!isValid}
                  style={{ backgroundColor: isValid ? "#199A8E" : "#A1A8B0" }}
                  className='items-center justify-center w-full h-12 rounded-full '>
                  <Text className='text-base font-semibold leading-6 text-white'>
                    Login
                  </Text>
                </TouchableOpacity>
                <Text className='mt-6 mx-auto tracking-[.5px] text-primaryGray text-[15px] leading-6'>
                  Don’t have an account?
                  <Text
                    className=' text-primary'
                    onPress={() => navigation.navigate("Register")}>
                    {" "}
                    Sign Up
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

export default Login;

const styles = StyleSheet.create({});
