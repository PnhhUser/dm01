import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Text,
} from "@chakra-ui/react";
import {
  Form,
  Link,
  Navigate,
  redirect,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { SignUp, sleep } from "../utils";
import { useAuth } from "../contexts/authContext";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const rePassword = formData.get("repassword");

  await sleep(3000);

  if (password.length < 6 || rePassword.length < 6)
    return "password is greater than 6 characters";

  if (password !== rePassword) return "password incorrect";

  const user = await SignUp(email, password);

  if (user?.code === "auth/invalid-email") return "email incorrect";

  if (user) {
    return redirect("/");
  }

  return null;
};

export const FormRegister = () => {
  const messageError = useActionData();
  const navigation = useNavigation();

  return (
    <Form method="post">
      <Text color="red.500" pb={4}>
        {messageError}
      </Text>
      <FormControl mb={5}>
        <FormLabel> Email Address </FormLabel>
        <Input type="email" name="email" autoComplete="off" />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel> Password </FormLabel>
        <Input type="password" name="password" />
      </FormControl>
      <FormControl mb={5}>
        <FormLabel> Re-Password </FormLabel>
        <Input type="password" name="repassword" />
      </FormControl>
      <Link
        to="/login"
        style={{
          fontSize: 12,
          color: "#3289e1",
          paddingInlineStart: 10,
        }}
      >
        sign up here
      </Link>
      <Box>
        {navigation.state === "submitting" ? (
          <Button
            mt={4}
            mb={10}
            color="#fff"
            bg="#273036"
            type="submit"
            _hover={{ bg: "#273036" }}
            isLoading
            loadingText="Loading"
          />
        ) : (
          <Button
            mt={4}
            mb={10}
            color="#fff"
            bg="#273036"
            type="submit"
            _hover={{ bg: "#273036" }}
          >
            Register
          </Button>
        )}
      </Box>
    </Form>
  );
};

export default function RegisterPage() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (user) return <Navigate to="/" />;
  return (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      <Box borderWidth={1} borderRadius={5} p={2} w={500}>
        <Text as="h2" fontSize={40} my={5}>
          Register Form
        </Text>
        <FormRegister />
      </Box>
    </Flex>
  );
}
