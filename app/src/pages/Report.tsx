import React, { useState } from 'react';
import { useSoot } from '../context/Soot';
import { usePosition } from '../hooks/usePosition';
import { Box, TextField, Button, Checkbox, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useWeb3 } from '../context/Web3';
import { useEvents } from '../context/Event';
import { BingMap } from '../components/BingMap';

export const Report: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState(true);
  const { position } = usePosition();

  const { sootRegistryFacade } = useSoot();
  const { account, getPublicKey } = useWeb3();
  const { addReportEvent } = useEvents();

  const submit = async (): Promise<void> => {
    if (position) {
      sootRegistryFacade?.report(
        {
          name,
          description,
          isEncrypted,
          lat: position?.latitude,
          lon: position?.longitude,
        },
        account,
        getPublicKey,
      );
      addReportEvent(name);
      setName('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={submit}>
      <Box p={3} display="flex" flexDirection="column">
        <Box mb={2} display="flex" width={1}>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              onChange={(event): void => setName(event.target.value)}
              value={name}
              placeholder="Name of the harasser"
            />
          </FormControl>
        </Box>
        <Box mb={2} display="flex" width={1}>
          <FormControl fullWidth>
            <TextField
              variant="outlined"
              multiline
              rows={4}
              onChange={(event): void => setDescription(event.target.value)}
              value={description}
              placeholder="Describe the event"
            />
          </FormControl>
        </Box>
        <Box mb={2} display="flex" width={1}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="type">Type of misconduct</InputLabel>
            <Select
              labelId="type"
              label="Type of misconduct"
            >
              <MenuItem value="">
                <em>Dating violence</em>
              </MenuItem>
              <MenuItem value={20}>Stalking</MenuItem>
              <MenuItem value={30}>Offensive behavior</MenuItem>
              <MenuItem value={10}>Sexual harassment</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box mb={2} display="flex" width={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isEncrypted}
                onChange={(): void => setIsEncrypted(!isEncrypted)}
                name="Encrypt the description"
                color="primary"
              />
            }
            label="encrypt the description?"
          />
        </Box>
        <Box mb={2} display="flex" width={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isCurrentLocation}
                onChange={(): void => setIsCurrentLocation(!isCurrentLocation)}
                name="Use current location"
                color="primary"
              />
            }
            label="Use current location"
          />
        </Box>
        {!isCurrentLocation ?
          <Box>
            <BingMap
              height='30vh'
              mapOptions={{
                center: [position?.latitude, position?.longitude],
              }}
              marks={[{
                id: '0',
                location: { lat: position?.latitude, lng: position?.longitude },
                name: 'new',
                draggable: true,
              }]} />
          </Box> :
          null
        }

        <Box mb={2} display="flex" width={1}>
          <Button variant="contained" color="primary" title="Report" onClick={submit}>
            Save the report
          </Button>
        </Box>
      </Box>
    </form>
  );
};
