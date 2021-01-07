import React, { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@material-ui/core';

interface IImportWalletFormProps {
    onSubmittableChanged: (password: string, privateKey: string) => void;
}
export const ImportWalletForm: React.FC<IImportWalletFormProps> = (props: IImportWalletFormProps) => {
    const { onSubmittableChanged } = props;
    const [password, setPassword] = useState('');
    const [privateKey, setprivateKey] = useState('');

    useEffect((): void => {
        const submittable = password !== '' && privateKey !== "";
        submittable ? onSubmittableChanged(password, privateKey) : onSubmittableChanged('', '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [password, privateKey]);

    return (
        <React.Fragment>
            <Typography variant="subtitle1" align="center">Fill the form to import your wallet</Typography>

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
                    placeholder="Private key"
                    type="password"
                    onChange={(event) => setprivateKey(event.target.value)}
                    value={privateKey}
                />
            </Box>
        </React.Fragment>
    );
};
