import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Box,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  useToast,
} from "@chakra-ui/react";
import { COLLECTION, logout, readData, regxEmail, updateUser } from "../utils";
import { useAuth } from "../contexts/authContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const DialogEdit = ({ isOpen, onClose, editingUserId, dataUser }) => {
  const [onloading, setOnloading] = useState(false);
  const [error, setError] = useState("");
  const mailRef = useRef();
  const passRef = useRef();
  const toast = useToast();

  const person = dataUser?.find((user) => user?.id === editingUserId);

  const handleUpdateEmail = () => {
    const email = mailRef.current.value;
    const password = passRef.current.value;

    if (!regxEmail(email)) {
      setError("Email invalid");
    }

    if (password.length < 6) {
      setError("password is greater than 6 characters");
    }

    if (regxEmail(email) || password.length > 6) {
      setError("");
      setOnloading(true);
      updateUser(person, email, password).then((res) => {
        if (res.code) {
          setOnloading(false);
          onClose();
          toast({
            title: `${res.code}`,
            status: "error",
            isClosable: true,
            position: "top-right",
            duration: 3000,
          });
        }

        if (res.ok) {
          setOnloading(false);
          onClose();
          toast({
            title: `Update successful`,
            status: "success",
            isClosable: true,
            position: "top-right",
            duration: 3000,
          });
        }
      });
    }
  };

  return (
    <AlertDialog isOpen={isOpen}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Edit User
          </AlertDialogHeader>

          <AlertDialogBody>
            {error && (
              <Text color="red.500" mb={2}>
                {error}
              </Text>
            )}
            <FormControl mb={5}>
              <FormLabel> Email Address </FormLabel>
              <Input
                ref={mailRef}
                type="email"
                name="email"
                autoComplete="off"
                defaultValue={person?.email}
              />
            </FormControl>
            <FormControl mb={5}>
              <FormLabel> Password </FormLabel>
              <Input
                ref={passRef}
                type="text"
                name="password"
                defaultValue={person?.password}
              />
            </FormControl>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button
              onClick={() => {
                setOnloading(false);
                onClose();
              }}
            >
              Cancel
            </Button>
            {onloading ? (
              <Button
                colorScheme="red"
                ml={3}
                isLoading
                loadingText="Loading"
              />
            ) : (
              <Button colorScheme="red" ml={3} onClick={handleUpdateEmail}>
                Update
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingUserId, setEditingUserId] = useState(null);
  const handleOut = () => {
    logout();
    return navigate("login");
  };

  async function userData() {
    const users = await readData(COLLECTION.USERS);
    setUsers(users);
  }

  useEffect(() => {
    userData();
  }, []);

  const handleEdit = (id) => {
    onOpen();
    setEditingUserId(id);
  };

  const handleRemove = (id) => {
    return null;
  };

  const tableUsers = users?.map((user, index) => {
    return (
      <Tr key={user.id}>
        <Td>{index + 1}</Td>
        <Td>{user.email}</Td>
        <Td>{user.password}</Td>
        <Td>
          <Button me={2} colorScheme="teal" onClick={() => handleEdit(user.id)}>
            Edit
          </Button>
          <Button colorScheme="red" onClick={() => handleRemove(user.id)}>
            Remove
          </Button>
        </Td>
      </Tr>
    );
  });

  return (
    <Box>
      {user ? (
        <Button onClick={handleOut}> Logout </Button>
      ) : (
        <Link to="login">
          <Text color="blue.500"> Login </Text>
        </Link>
      )}
      <TableContainer>
        <Table variant="simple" size={{ base: "sm", md: "md", lg: "lg" }}>
          <Thead>
            <Tr>
              <Th> Id </Th>
              <Th> Email </Th>
              <Th> Password </Th>
              <Th> Function </Th>
            </Tr>
          </Thead>
          <Tbody>{tableUsers}</Tbody>
        </Table>
      </TableContainer>
      <DialogEdit
        isOpen={isOpen}
        onClose={onClose}
        editingUserId={editingUserId}
        dataUser={users}
      />
    </Box>
  );
}
