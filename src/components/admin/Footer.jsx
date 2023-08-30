import { Box, Button, Flex, Heading, Image, Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList, Spacer, Text } from '@chakra-ui/react'
import React, { useState } from 'react';
import '../../css/admin/Footer.css'
import { ChevronDownIcon, EmailIcon } from '@chakra-ui/icons';
import { Link } from 'react-router-dom';

export const Footer = () => {

  return (
    <Flex  className='footer' color='#000000' as="nav" p="10px" alignItems="center" gap="8px" h="35px" position="sticky" top="0" zIndex={3}>
        {/* <Box h="45px" w="120px" borderRadius="5px">
          <Image objectFit='cover' src={qcLogo}/>
          <Heading size='md'className='project-icon'>Qubitz</Heading>
        </Box> */}
        <Link to='/admin'>
          <Heading ml={{base: '22px',lg: '10px'}} size='lg' as='h2' color='f7f7f7'>© 2023 Copyright Cloud202 Ltd </Heading> 
        </Link>
        <Spacer/>
     
    </Flex>
  )
}
