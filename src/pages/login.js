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
import { signIn, sleep } from "../utils";
import { useAuth } from "../contexts/authContext";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  await sleep(3000);

  if (email.length === 0 || password.length === 0) {
    return "Fields cannot be empty";
  }

  if (password.length < 6) {
    return "Password greater than 6 characters";
  }

  const user = await signIn(email, password);

  if (
    user?.code === "auth/invalid-credential" ||
    user?.code === "auth/user-not-found"
  ) {
    return "This account does not exist";
  }

  if ("auth/wrong-password" === user?.code) {
    return "Incorrect password";
  }

  return redirect("/");
};

export const FormLogin = () => {
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
      <Link
        to="/register"
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
            Login
          </Button>
        )}
      </Box>
    </Form>
  );
};

export default function LoginPage() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (user) return <Navigate to="/" />;
  return (
    <Flex justifyContent="center" alignItems="center" h="100vh">
      <Box borderWidth={1} borderRadius={5} p={2} w={500}>
        <Text as="h2" fontSize={40} my={5}>
          Login Form
        </Text>
        <FormLogin />
      </Box>
    </Flex>
  );
}
