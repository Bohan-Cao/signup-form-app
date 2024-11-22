import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Typography,
    InputAdornment,
    IconButton,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignupForm = () => {
    // State to store the data for the sign-up form
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [users, setUsers] = useState([]); // Mock database to store signed-up users
    const [loginData, setLoginData] = useState({ email: '', password: '' }); // Login form data
    const [errors, setErrors] = useState({});
    const [isSignIn, setIsSignIn] = useState(false); // Toggle between Sign-Up and Sign-In
    const [currentUser, setCurrentUser] = useState(null); // Track logged-in user
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [isSignUpSuccess, setIsSignUpSuccess] = useState(false); // Track if sign-up was successful

    // Validate the Sign-up form
    const validateSignUp = () => {
        const newErrors = {};
        // Check if full name is provided, if not, throw a message
        if (!formData.fullName) newErrors.fullName = 'Full Name is required';
        // Check if email is valid
        if (!formData.email) newErrors.email = 'Email is required';
        // Check if the email already exists in the users array
        else if (users.some((user) => user.email === formData.email)) {
            newErrors.email = 'This email is already registered';
        }
        // Check if password is provided
        else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        // Check if confirm password matches the password
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required';
        else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        // Update the error state
        setErrors(newErrors);
        // Return true if no errors, otherwise false
        return Object.keys(newErrors).length === 0;
    };

    // Validate the Sign-in form
    const validateSignIn = () => {
        // Find the user with matching email and password
        const user = users.find(
            (user) => user.email === loginData.email && user.password === loginData.password
        );
        // If no user is found, show an error message
        if (!user) {
            setErrors({ login: 'Invalid email or password' });
            return false;
        }
        // Set the current user as the logged-in user
        setCurrentUser(user);
        return true;
    };

    // Handle the Sign-Up form submission
    const handleSignUp = (e) => {
        // Prevent the default form submission behavior
        e.preventDefault();
        if (validateSignUp()) {
            // Add the new user to the Mock database
            setUsers([...users, { ...formData }]);
            // Log submitted form data
            console.log('Form Submitted:', formData);
            // Set the sign-up success state to true to show a success message
            setIsSignUpSuccess(true);
            // Reset the form data to empty strings for all fields
            setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
            // Clear any validation errors from the error state
            setErrors({});
        }
    };

    // Handle the Sign-In form submission
    const handleSignIn = (e) => {
        e.preventDefault();
        // Validate the Sign-In form inputs
        if (validateSignIn()) {
            // Log the successful login data to the console for debugging or confirmation
            console.log('User Logged In:', loginData);
            // Reset the login form fields to empty strings
            setLoginData({ email: '', password: '' });
            setErrors({});
        }
    };

    // Toggle the visibility of the password
    const togglePasswordVisibility = () => {
        // If showPassword is true, it becomes false; if false, it becomes true
        setShowPassword((prev) => !prev);
    };

    // Validate the password
    const getPasswordValidation = (password) => {
        return {
            hasUppercase: /[A-Z]/.test(password),
            hasLowercase: /[a-z]/.test(password),
            hasNumber: /[0-9]/.test(password),
            hasSpecialChar: /[@$!%*?&]/.test(password),
            hasMinLength: password.length >= 8,
        };
    };

    const passwordCriteria = getPasswordValidation(formData.password);

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 5,
                p: 3,
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: 3,
            }}
        >
            {currentUser ? (
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                        Welcome, {currentUser.fullName}!
                    </Typography>
                    <Typography>Email: {currentUser.email}</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 2 }}
                        onClick={() => setCurrentUser(null)}
                    >
                        Logout
                    </Button>
                </Box>
            ) : isSignUpSuccess ? (
                // Show the sign-up success message
                <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main" gutterBottom>
                        Sign-Up Successful!
                    </Typography>
                    <Typography>
                        Thank you for signing up!
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={() => {
                            setIsSignIn(true); // Navigate to Sign-In form
                            setIsSignUpSuccess(false); // Reset success state
                        }}
                    >
                        Go to Sign In
                    </Button>
                </Box>
            ) : isSignIn ? (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Sign In
                    </Typography>
                    <form onSubmit={handleSignIn}>
                        <TextField
                            label="Email Address"
                            fullWidth
                            margin="normal"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {errors.login && (
                            <Typography color="error" sx={{ fontSize: 14, mt: 1 }}>
                                {errors.login}
                            </Typography>
                        )}
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Sign In
                        </Button>
                    </form>
                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => {
                            setIsSignIn(false);
                            setErrors({});
                        }}
                    >
                        Don't have an account? Sign Up
                    </Button>
                </>
            ) : (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Sign Up
                    </Typography>
                    <form onSubmit={handleSignUp}>
                        <TextField
                            label="Full Name"
                            fullWidth
                            margin="normal"
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Email Address"
                            fullWidth
                            margin="normal"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            error={!!errors.password}
                            helperText={errors.password}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box sx={{ mt: 1 }}>
                            <Typography
                                sx={{ color: passwordCriteria.hasUppercase ? 'green' : 'red', fontSize: 14 }}
                            >
                                - At least one uppercase letter
                            </Typography>
                            <Typography
                                sx={{ color: passwordCriteria.hasLowercase ? 'green' : 'red', fontSize: 14 }}
                            >
                                - At least one lowercase letter
                            </Typography>
                            <Typography
                                sx={{ color: passwordCriteria.hasNumber ? 'green' : 'red', fontSize: 14 }}
                            >
                                - At least one number
                            </Typography>
                            <Typography
                                sx={{ color: passwordCriteria.hasSpecialChar ? 'green' : 'red', fontSize: 14 }}
                            >
                                - At least one special character (@, $, !, %, *, ?, &)
                            </Typography>
                            <Typography
                                sx={{ color: passwordCriteria.hasMinLength ? 'green' : 'red', fontSize: 14 }}
                            >
                                - Minimum 8 characters
                            </Typography>
                        </Box>
                        <TextField
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="normal"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                            Sign Up
                        </Button>
                    </form>
                    <Button
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={() => {
                            setIsSignIn(true);
                            setErrors({});
                        }}
                    >
                        Already have an account? Sign In
                    </Button>
                </>
            )}
        </Box>
    );
};

export default SignupForm;
