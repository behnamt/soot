import React, { useState } from 'react';
import { useAsync } from 'react-async';
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@material-ui/core';
import { ILocation } from '@soot/core/dist/@types/IPosition';
import { useEvents } from '@contexts/Event';
import { useSoot } from '@contexts/Soot';
import { useToast } from '@contexts/Toast';
import { useWeb3 } from '@contexts/Web3';
import { usePosition } from '@hooks/usePosition';
import { EToastTypes } from '@interfaces/IToast.types';
import { BingMap } from '../../BingMap';
import { LoadingButton } from '../../LoadingButton';

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
];

export const Report: React.FC = () => {
  const { sootRegistryFacade } = useSoot();
  const { account, encryptionPublicKey } = useWeb3();
  const { addReportEvent } = useEvents();
  const { add } = useToast();

  const { position } = usePosition();

  const [name, setName] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isEncrypted, setIsEncrypted] = useState<boolean>(false);
  const [isCurrentLocation, setIsCurrentLocation] = useState<boolean>(true);
  const [customPosition, setCustomPosition] = useState<ILocation>(null);

  const { run: storeReport, isPending } = useAsync({
    deferFn: async ([reportPosition]) =>
      sootRegistryFacade.report(
        {
          name,
          description,
          isEncrypted,
          latitude: reportPosition?.latitude,
          longitude: reportPosition?.longitude,
        },
        account,
        encryptionPublicKey,
      ),
    onResolve: () => {
      addReportEvent(name);
      setName('');
      setDescription('');
      add('Report added sucessfully', true, EToastTypes.SUCCESS);
    },
  });

  const submit = async (): Promise<void> => {
    const reportPosition = isCurrentLocation ? position : customPosition;
    if (reportPosition) {
      storeReport(reportPosition);
    } else {
      add('Please select a location on map or enable your location sharing');
    }
  };

  const onMarksChanged = (id: string, location: ILocation): void => {
    setCustomPosition(location);
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
              {harassmentTypes.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
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
        {!isCurrentLocation ? (
          <Box>
            <BingMap
              height="30vh"
              mapOptions={{
                center: [position?.latitude || 0, position?.longitude || 0],
              }}
              marks={[
                {
                  id: '0',
                  location: { latitude: position?.latitude || 0, longitude: position?.longitude || 0 },
                  name: 'Drag Me!',
                  draggable: true,
                },
              ]}
              onMarksChanged={onMarksChanged}
            />
          </Box>
        ) : null}
        <Box mb={2} display="flex" width={1}>
          <LoadingButton
            variant="contained"
            color="primary"
            title="Report"
            disabled={isPending}
            loading={isPending}
            onClick={submit}
          >
            Save the report
          </LoadingButton>
        </Box>
      </Box>
    </form>
  );
};
