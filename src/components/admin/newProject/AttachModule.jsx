import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import {Box,Button,Checkbox,Flex,FormLabel,HStack,Menu,MenuButton,MenuList,MenuItem,Table,TableContainer,Tbody,Td,Text,Th,Thead,Tr,Divider,
} from '@chakra-ui/react';
import { ChevronDownIcon, SmallCloseIcon } from '@chakra-ui/icons';
import AddModuleModal from './AddModuleModal';

export const AttachModule = ({ formData,setFormData,tableData,attachedModules, setAttachedModules }) => {
  const [module, setModule] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState(null);
  const [checkedModules, setCheckedModules] = useState([]);

  const [moduleFormData, setModuleFormData] = useState({
    name: "",
    description: "",
    scope: "",
    supportive_id: "temporary",
    status: true,
  });

  const handleModuleSelect = (moduleId,name) => {
    if (checkedModules.includes(moduleId)) {
      setCheckedModules(checkedModules.filter(id => id !== moduleId));
    } else {
      setCheckedModules([...checkedModules, moduleId]);
    }

    setAttachedModules((prevAttachedModules) => ({
      ...prevAttachedModules,
      [selectedPhase]: checkedModules.includes(moduleId)
        ? prevAttachedModules[selectedPhase].filter(id => id !== moduleId)
        : [...(prevAttachedModules[selectedPhase] || []), moduleId],
    }));

    setFormData((prevFormData) => {
      const moduleExists = prevFormData.modules.find((module) => module.id === moduleId);
    
      if (!moduleExists) {
        const updatedModules = [...prevFormData.modules, { id: moduleId, name: name }];
        return {
          ...prevFormData,
          modules: updatedModules,
        };
      }
    
      return prevFormData;
    });
    
    console.log(formData.modules);
  };

   const handlePhaseSelect = (phaseId) => {
    setSelectedPhase(phaseId);
    setCheckedModules(attachedModules[phaseId] || []);
  };

  const handleRemoveModule = (phaseId, moduleId) => {
    const updatedAttachedModules = { ...attachedModules };
    updatedAttachedModules[phaseId] = updatedAttachedModules[phaseId].filter(
      (id) => id !== moduleId
    );
    setAttachedModules(updatedAttachedModules);

    setCheckedModules((prevCheckedModules) =>
      prevCheckedModules.filter((id) => id !== moduleId)
    );

  };

  const handleRemoveButton = (moduleId) => {
    try {
      const updatedAttachedModules = {};
      for (const phaseId in attachedModules) {
        updatedAttachedModules[phaseId] = attachedModules[phaseId].filter(id => id !== moduleId);
      }
      setAttachedModules(updatedAttachedModules);

    } catch (error) {
      console.error("Error deleting Module:", error);
    }
  };


  const fetchDataEffect = useCallback(async () => {
    try {
      const modules = await axios.get("http://ec2-34-247-84-33.eu-west-1.compute.amazonaws.com:5000/api/admin/master/project_module");
      setModule(modules.data);
    } catch (error) {
      console.error("Error fetching phase data:", error);
    }
  }, []);

  useEffect(() => {
    fetchDataEffect();
  }, [fetchDataEffect]);

 

  return (
    <Flex direction="column" maxW="680px">
      <Text mb='10px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '15px', sm: '26px',md: '30px', lg: '30px' }} color="#445069">Attach Modules with selected phases</Text>

      <Flex align="center" mb="20px">
        <FormLabel flex="1">Attach To:</FormLabel>
        <Menu>
          <MenuButton w="80%" as={Button} variant="outline" colorscheme="gray" rightIcon={<ChevronDownIcon />}>
            {selectedPhase ? tableData.find(phase => phase.id === selectedPhase).name : "Select a phase"}
          </MenuButton>
          <MenuList p='20px'>
            {tableData.map(phase => (
              <HStack p='2px' key={phase.id}>
                <MenuItem
                  spacing={2}
                  size='md'
                  colorscheme='green'
                  onClick={() => handlePhaseSelect(phase.id)}
                >
                  {phase.name}
                </MenuItem>
              </HStack>
            ))}
          </MenuList>
        </Menu>
      </Flex>

      <Flex align="center" mb="20px">
        <FormLabel flex="1">Select Modules:</FormLabel>
        <Menu >
          <MenuButton w="80%" as={Button} variant="outline" colorscheme="gray" rightIcon={<ChevronDownIcon />}>
            Select an option
          </MenuButton>
          <MenuList p='20px'>
            {module.map((val, ind) => (
              <HStack p='2px' key={val._id}>
                <Checkbox
                  spacing={2}
                  size='md'
                  colorScheme='green'
                  isChecked={checkedModules.includes(val._id)}
                  onChange={() => handleModuleSelect(val._id,val.name)}
                >
                  {val.name}
                </Checkbox>
              </HStack>
            ))}
          </MenuList>
        </Menu>
      </Flex>
        <AddModuleModal module={module} setModule={setModule} moduleFormData={moduleFormData} setModuleFormData={setModuleFormData} handleRemoveButton={handleRemoveButton}/>

      <Box mt='20px' p='5px' bg='gray.50' borderRadius='5px' fontSize={{ base: '18px', md: '22px', lg: '30px' }} color="#445069">
        Attached Modules
      </Box>
      <TableContainer mt="10px">
  <Table colorscheme="purple">
    <Thead>
      <Tr>
        <Th>Phase</Th>
        <Th>Attached Modules</Th>
        <Th>Action</Th>
      </Tr>
    </Thead>
    <Tbody>
      {tableData.map((phase) => (
        attachedModules[phase.id] && attachedModules[phase.id].length > 0 ? (
          <Tr key={phase.id}>
            <Td>{phase.name}</Td>
            <Td mb="3px">
              {attachedModules[phase.id].map((moduleId) => {
                const selectedModule = module.find((mod) => mod._id === moduleId);
                return (
                  <div key={moduleId}>
                    {selectedModule ? selectedModule.name : null}
                    <Divider my={1} />
                  </div>
                );
              })}
            </Td>
            <Td>
              {attachedModules[phase.id].map((moduleId) => (
                <div key={moduleId}>
                  <Button
                    rightIcon={<SmallCloseIcon />}
                    colorScheme="red"
                    variant="outline"
                    size="xs"
                    onClick={() => handleRemoveModule(phase.id, moduleId)}
                  >
                    Remove
                  </Button>
                  <Divider my={1} />
                </div>
              ))}
            </Td>
          </Tr>
        ) : null // Skip rendering the row if there are no attached modules
      ))}
    </Tbody>
  </Table>
</TableContainer>
    </Flex>
  );
};

export default AttachModule;
