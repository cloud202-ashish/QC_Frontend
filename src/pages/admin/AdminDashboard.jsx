import React from 'react'
import {Box, Card, CardBody, CardHeader, Divider, Grid, GridItem, Heading, Image, SimpleGrid, Stack, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react'
import { Navbar } from '../../components/admin/Navbar'
import { Footer } from '../../components/admin/Footer'
import Sidebar from '../../components/admin/Sidebar'
import '../../css/admin/adminDashboard.css'
import step_one from '../../img/admin_steps/1.png'

const AdminDashboard = () => {
  
  return (
    <>
    <Navbar/>
    <Grid templateColumns="repeat(6,1fr)">
      <GridItem colSpan={{lg: '1' }}>
        <Box w={{ base: 'none',sm: 'none', md: 'none', lg: '230px' }}>
          <Sidebar/>
        </Box>
      </GridItem>

      <GridItem colSpan={{base: '6', sm: '6', md: '6',lg: '5' }} className= "project-background" >
        <Box className='dashboard-shadow' display='flex' flexDirection='column' alignItems='center' justifyContent='center' textAlign='center' mt={{base: '32px',lg: '6px'}} mb={{base: '22px'}}>
        <Text className='sub-title' fontSize={{ base: '14px',sm: '20px', md: '24px', lg: '28px' }} fontWeight={400} >Welcome to Qubitz! Define migration and modernization journey for customer</Text>
          <Image 
                src={step_one}
                w={{ base: '100%', lg: '80%' }}
              />
        </Box>

        <Box className='dashboard-shadow' p={{ base: '6px',sm: '6px', md: '6px', lg: '2px' }} m='14px' >
          <Text className='sub-title' fontSize={{ base: '16px', md: '20px', lg: '22px' }}  mt={{ base: '6px',sm: '6px', md: '6px', lg: '12px' }} >Available Project Templates</Text>
          <TableContainer>
            <Table variant='simple' size={{ base: 'sm', md: 'sm', lg: 'md' }} mt='6px'>
              {/* <TableCaption>"Seamlessly utilize pre-existing templates without any inconvenience."</TableCaption> */}
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Name</Th>
                  <Th>Type</Th> 
                  <Th>Segment</Th> 
                  <Th>Industry</Th> 
                </Tr>
              </Thead>

              <Tbody>
                <Tr>
                  <Td>Qc-34</Td>
                  <Td>Google workload</Td>
                  <Td>Migrate</Td>
                  <Td>Startup</Td>
                  <Td>FSI</Td>
                </Tr>

                <Tr>
                  <Td>Qc-34</Td>
                  <Td>Microsoft workload</Td>
                  <Td>Mordernize</Td>
                  <Td>Startup</Td>
                  <Td>FSI</Td>
                </Tr>
                <Tr>
                  <Td>Qc-34</Td>
                  <Td>Microsoft workload</Td>
                  <Td>Mordernize</Td>
                  <Td>Startup</Td>
                  <Td>FSI</Td>
                </Tr>
                <Tr>
                  <Td>Qc-34</Td>
                  <Td>Microsoft workload</Td>
                  <Td>Mordernize</Td>
                  <Td>Startup</Td>
                  <Td>FSI</Td>
                </Tr>
                
                
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

      </GridItem>
    </Grid>
    <Footer/>
    
    </>
    
  )
}

export default AdminDashboard