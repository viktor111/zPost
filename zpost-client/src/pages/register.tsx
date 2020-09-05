import React from 'react'
import { Formik, Form } from 'formik'
import { FormControl, FormLabel, Input, FormErrorMessage, Box, Button } from '@chakra-ui/core';
import { Wrappper } from '../components/Wrappper';
import { InputField } from '../components/InputField';
import { useMutation } from 'urql';
import { useRegisterMutation } from '../generated/graphql';

interface registerProps {

}

export const Register: React.FC<registerProps> = ({}) => {
    const [, register] = useRegisterMutation() 
    return (
        <Wrappper variant='small'>
            <Formik initialValues={{username: "", password: ""}} 
            onSubmit={async (values) => {
                console.log(values)
                const resposne = await register(values)
                if (resposne.data.register.errors)

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