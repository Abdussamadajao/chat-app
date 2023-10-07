import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type InputProps = {
  placeholder?: string;
  icon?: any;
  error?: any;
  password?: any;
  onFocus?: any;
  onChangeText?: any;
  value?: any;
  touched?: any;
  keyboardType?: string | any;
};

const Input = ({
  error,
  icon,
  onFocus,
  password,
  placeholder,
  onChangeText,
  value,
  touched,
  keyboardType,
  ...props
}: InputProps) => {
  const [hidePassword, setHidePassword] = useState(password);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View className='mb-5'>
      <View
        className='flex-row w-full px-4 border rounded-full h-14 bg-medicalGray border-secondary'
        style={{
          borderColor:
            error && touched ? "#FF5C5C" : isFocused ? "#199A8E" : "#A1A8B0",
          alignItems: "center",
        }}>
        <MaterialCommunityIcons
          name={icon}
          size={24}
          style={{ marginRight: 16 }}
          color={
            error && touched ? "#FF5C5C" : isFocused ? "#199A8E" : "#A1A8B0"
          }
        />
        <TextInput
          autoCorrect={false}
          autoCapitalize={"none"}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={hidePassword}
          className='flex-1 text-primary'
          placeholder={placeholder}
          placeholderTextColor={"#A1A8B0"}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
          {...props}
        />
        {password && (
          <MaterialCommunityIcons
            onPress={() => setHidePassword(!hidePassword)}
            style={{ marginLeft: 16 }}
            name={`${hidePassword ? "eye-off-outline" : "eye-outline"}`}
            color={"#E5E7EB"}
            size={24}
          />
        )}
      </View>

      <View>
        {touched && error && (
          <Text className='text-[#FF5C5C] text-sm mt-[7px]'>{error}</Text>
        )}
      </View>
    </View>
  );
};

export default Input;
