import * as yup from 'yup';

export const RegisterSchema = yup.object({
  username: yup.string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters'),
  
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
  
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email')
});

export const LoginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required')
}); 