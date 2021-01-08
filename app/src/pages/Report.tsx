import React, { useState } from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useSoot } from '../context/Soot';
import { usePosition } from '../hooks/usePosition';
import { useWeb3 } from '../context/Web3';
import { useEvents } from '../context/Event';
import { BingMap } from '../components/Map/BingMap';

const harassmentTypes = [
  {
    label: 'Dating violence',
    value: 'dv',
  },
  {
    label: 'Stalking',
    value: 's',
  },
  {
    label: 'Offensive behavior',
    value: 'ob',
  },
  {
    label: 'Sexual harassment',
    value: 'sh',
  },
]

export const Report: React.FC = () => {
  const { sootRegistryFacade } = useSoot();
  const { account, getPublicKey } = useWeb3();
  const { addReportEvent } = useEvents();

  const { position } = usePosition();

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(true);


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
              value={type}
              onChange={(event): void => setType(event.target.value.toString())}
            >
              {harassmentTypes.map((item) =>
                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
              )}
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
                name: 'Drag Me!',
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
