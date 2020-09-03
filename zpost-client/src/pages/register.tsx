import React from 'react'
import { Formik, Form } from 'formik'
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/core';
import { Wrappper } from '../components/Wrappper';
import { InputField } from '../components/InputField';

interface registerProps {

}

export const Register: React.FC<registerProps> = ({}) => {
    return (
        <Wrappper variant='small'>
            <Formik initialValues={{username: "", password: ""}} onSubmit={values => {
                console.log(values)
            }}>
                {({isSubmitting}) => (                    
                    <Form>
                        <InputField name='username' placeholder='username' label='Username'></InputField>
                        <Box mt={4}>
                            <InputField name='password' placeholder='password' label='Password' type='password'></InputField>
                        </Box>                        
                        <Button isLoading={isSubmitting} mt={4} type='submit' variantColor='teal'>Register</Button>                    
                    </Form>
                )}
            </Formik>
        </Wrappper>
    );
};

export default Register;