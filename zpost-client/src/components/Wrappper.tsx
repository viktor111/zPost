import React from 'react'
import { Box } from '@chakra-ui/core'

interface WrappperProps {
    variant?: 'small' | 'regular'
}

export const Wrappper: React.FC<WrappperProps> = ({children, variant='regular'}) => {
return (<Box
    maxW={variant === 'regular' ? "800px" : '400px'} 
    w="100%" 
    mt={8} 
    mx="auto">{children}</Box>);
}