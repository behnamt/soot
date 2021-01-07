import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';

interface ICreateWalletFormProps {
    onSubmittableChanged: (password: string) => void;
}
export const CreateWalletForm: React.FC<ICreateWalletFormProps> = (props: ICreateWalletFormProps) => {
    const { onSubmittableChanged } = props;
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect((): void => {
        const submittable = password !== '' && password === confirmPassword;
        onSubmittableChanged(submittable ? password : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, confirmPassword]);

    return (
        <React.Fragment>
            <Typography variant="subtitle1" align="center">To start using the app, create your own wallet</Typography>

            <Box mb={2} display="flex" justifyContent="center" width={1} mt={2}>
                <TextField
                    variant="outlined"
                    placeholder="Password"
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                />
            </Box>
            <Box mb={2} display="flex" justifyContent="center" width={1}>
                <TextField
                    variant="outlined"
                    placeholder="Confirm password"
                    type="password"
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    value={confirmPassword}
                />
            </Box>
        </React.Fragment>
    );
};
