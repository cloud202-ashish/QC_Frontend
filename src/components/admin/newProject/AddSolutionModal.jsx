import { AddIcon, CloseIcon, DeleteIcon, RepeatIcon } from '@chakra-ui/icons'
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, FormControl, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'

const AddSolutionModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [formMode, setFormMode] = useState('add');
  const [actionCount,setActionCount] = useState(1);
  const [actionApiPairs, setActionApiPairs] = useState([{ action: '', api: '' }]);
  const [solname,setSolName] = useState("");
  const [solution,setSolution] = useState(null);
  const [solIdDelete,setSolIdDelete] = useState(null);
  const [solIdUpdate,setSolIdUpdate] = useState(null);

  const toast = useToast();
  const [isAlertOpen,setIsAlertOpen] = useState(false);
  const cancelRef = useRef();
  const onAlertClose = () => {
    setIsAlertOpen(false);
  };

  const handleActionApiChange = (index, field, value) => {
    const updatedPairs = [...actionApiPairs];
    updatedPairs[index][field] = value;
    setActionApiPairs(updatedPairs);
  };

  const addActionApiPair = () => {
    setActionCount(actionCount+1);
    setActionApiPairs([...actionApiPairs, { action: '', api: '' }]);
  };

  const removeActionApiPair = (ind)=>{
    setActionCount(actionCount-1);
    const updated = actionApiPairs.filter((_,i) => i!==ind);
    setActionApiPairs(updated);
  }

  const submitActionApiPair = async()=>{
    try {
      const solutionData={
        name: solname,
        allActions: actionApiPairs
      }
      const {data} = await axios.post("http://ec2-34-247-84-33.eu-west-1.compute.amazonaws.com:5000/api/admin/master/project_solution",solutionData);

      setSolution((prevData)=> [...prevData,data]);
      toast({
        title: "Solution Added",
        description: "The solution has been added successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setSolName('');
      setActionApiPairs([{ action: '', api: '' }])

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: 'Unable to add the solution.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const deleteHandler = async (solId) => {
    try {
      // Open the confirmation dialog
      setIsAlertOpen(true);
      setSolIdDelete(solId);
    } catch (error) {
      console.error("Error deleting solution:", error);
    }
  };

  const onConfirmDelete = async () => {
    try {
      setIsAlertOpen(false); // Close the confirmation dialog
      await axios.delete(`http://ec2-34-247-84-33.eu-west-1.compute.amazonaws.com:5000/api/admin/master/project_solution/${solIdDelete}`);

      const updatedSol = solution.filter(row => row._id !== solIdDelete);
      setSolution(updatedSol);
      setFormMode('add');
      toast({
        title: 'Solution deleted Successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
    } catch (error) {
      console.error("Error deleting Solution:", error);
      toast({
        title: 'Unable to delete the Solution.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateInitializer = async (rowData)=>{
    setFormMode('update'); 


    setSolName(rowData.name);
    setActionApiPairs(rowData.allActions.map(action => ({ action: action.action, api: action.api })));
  }

  const updateHandler = async()=>{
    try {
      const solutionData={
        name: solname,
        allActions: actionApiPairs
      }
      await axios.patch(`http://ec2-34-247-84-33.eu-west-1.compute.amazonaws.com:5000/api/admin/master/project_solution/${solIdUpdate}`, solutionData);
      
      setFormMode('add');
      setSolName('');
      setActionApiPairs([{ action: '', api: '' }])

      const updatedSol = solution.map(row => {
        if (row._id === solIdUpdate) {
          return { ...row, name: solname, allActions: actionApiPairs };
        }
        return row;
      });
  
      setSolution(updatedSol);

      toast({
        title: 'Solution updated Successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      console.error("Error updating solution:", error);
      toast({
        title: 'Unable to update the Solution',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }

  const fetchDataEffect = useCallback(async () => {
    try {
      const sol = await axios.get("http://ec2-34-247-84-33.eu-west-1.compute.amazonaws.com:5000/api/admin/master/project_solution");
      setSolution(sol.data);
    } catch (error) {
      console.error("Error fetching solution data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDataEffect();
  }, [fetchDataEffect]);

  
  return (
    <div>
      <Button rightIcon={<AddIcon />} size='sm' colorScheme='teal' variant='outline' onClick={onOpen}>Add Solution</Button>
      <Modal isOpen={isOpen} onClose={onClose} size='6xl'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Define Solution</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          <Box p={4}>
            <form>
                <FormControl isRequired spacing={0} mb='10px' w='50%'>
                <HStack align='start' >
                  <FormLabel>Name</FormLabel>
                  <Input type="text" name="name" w='55%' mr={{lg:'12px'}} value={solname} onChange={(e)=>setSolName(e.target.value)}/>
                      <Button size='sm'
                        rightIcon={formMode === 'add' ? <AddIcon /> : <RepeatIcon />}
                        colorScheme={formMode === 'add' ? 'blue' : 'orange'}
                        onClick={formMode === 'add' ? submitActionApiPair : updateHandler}
                      >
                        {formMode === 'add' ? 'Add' : 'Update'}
                      </Button>            
                    </HStack>
                </FormControl>

                {actionApiPairs.map((pair, index) => (
                  <Box key={index} display='flex' alignItems='center' mb='8px'>
                    <FormControl isRequired mr={6} w='35%'>
                      <HStack align='start' spacing={0}>
                        <FormLabel>Action</FormLabel>
                        <Input
                          type='text'
                          name={`action-${index}`}
                          value={pair.action}
                          onChange={(e) =>
                            handleActionApiChange(index, 'action', e.target.value)
                          }
                        />
                      </HStack>
                    </FormControl>

                    <FormControl isRequired mr={6} w='32%'>
                      <HStack align='start' spacing={0}>
                        <FormLabel>API</FormLabel>
                        <Input
                          type='text'
                          name={`api-${index}`}
                          value={pair.api}
                          onChange={(e) =>
                            handleActionApiChange(index, 'api', e.target.value)
                          }
                        />
                      </HStack>
                    </FormControl>

                    {index === actionApiPairs.length - 1 && (
                      <Button
                        size='sm'
                        rightIcon={<AddIcon />}
                        colorScheme='blue'
                        onClick={addActionApiPair}
                        mr='6px'
                        variant='outline'
                      >
                        Add More Action
                      </Button>
                    )}

                    {actionCount !== 1 && index===actionApiPairs.length -1 && (
                      <Button size='sm'
                      rightIcon={<CloseIcon/>}
                      variant='outline'
                      colorScheme='red'
                        onClick={()=>removeActionApiPair(index)}>
                        Remove Action
                      </Button>
                    )}
                  </Box>
                ))}

            </form>

            <Text mt='10px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '18px', md: '22px', lg: '30px' }} color="#445069">Available Solution</Text>
            <TableContainer mt='10px' >
            <Table colorScheme='purple' size='sm'>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Action</Th> 
                  <Th>API</Th> 
                  <Th>Operation</Th> 
                </Tr>
              </Thead>
              {solution &&
              solution.map((rowData, index) => (
                <Tbody key={rowData._id}>
                  {rowData.allActions.map((val, ind) => (
                    <Tr key={`${rowData._id}-${ind}`}>
                      {ind === 0 && (
                        <Td rowSpan={rowData.allActions.length}>
                          {rowData.name}
                        </Td>
                      )}
                      <Td>{val.action}</Td>
                      <Td>{val.api}</Td>
                      {ind === 0 && (
                        <Td rowSpan={rowData.allActions.length}>
                          <Button
                            isDisabled={formMode === 'update'}
                            rightIcon={<RepeatIcon />}
                            size='sm'
                            colorScheme='orange'
                            mr={4}
                            onClick={()=>{
                              setSolIdUpdate(rowData._id);
                              updateInitializer(rowData)}}
                          >
                            Update
                          </Button>
                          <Button rightIcon={<DeleteIcon />} size='sm' colorScheme='red' onClick={()=>deleteHandler(rowData._id)}>
                            Delete
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  ))}
    </Tbody>
  ))}
            </Table>
          </TableContainer> 
          </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='purple' variant='outline' mr={3} onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Solution
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this solution?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
                
    </div>
  )
}

export default AddSolutionModal;
