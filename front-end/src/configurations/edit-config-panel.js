import {
  FormLabel,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  TextField,
  Autocomplete,
} from '@mui/material';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const EditConfigPanel = ({
  setConfigType,
  configType,
  timezone,
  setTimezone,
  message,
  setMessage,
  name,
  setName,
  stock,
  setStock,
  enabled,
  setEnabled,
  targetAtLocal,
  setTargetAtLocal,
}) => {
  return (
    <>
      <FormControl>
        <FormLabel id="config-type-label">Configuration type</FormLabel>
        <RadioGroup
          aria-labelledby="config-type-label"
          value={configType}
          onChange={(event) => setConfigType(event.target.value)}
        >
          <FormControlLabel
            value={'reminder'}
            control={<Radio />}
            label="Reminder"
          />
          <FormControlLabel
            value={'countdown'}
            control={<Radio />}
            label="Countdown (days until event)"
          />
          <FormControlLabel
            value={'stockQuoteAlert'}
            control={<Radio />}
            label="Stock quote alert"
          />
        </RadioGroup>
      </FormControl>

      {configType === 'reminder' && (
        <TextField
          label="Message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Remember to clean the kitchen"
          required
          fullWidth
          multiline
          minRows={2}
        />
      )}

      {configType === 'stockQuoteAlert' && (
        <TextField
          label="Stock"
          value={stock}
          onChange={(event) => setStock(event.target.value.toUpperCase())}
          placeholder="AAPL"
          required
          fullWidth
          slotProps={{
            htmlInput: { maxLength: 10 },
          }}
        />
      )}

      {configType === 'countdown' && (
        <>
          <TextField
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            fullWidth
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Countdown date & time"
              value={targetAtLocal}
              onChange={setTargetAtLocal}
            />
          </LocalizationProvider>
          <Autocomplete
            options={Intl.supportedValuesOf('timeZone')}
            value={timezone}
            onChange={(_, value) => setTimezone(value)}
            renderInput={(params) => <TextField {...params} label="Timezone" />}
          />
        </>
      )}

      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(event) => setEnabled(event.target.checked)}
          />
        }
        label={enabled ? 'Enabled' : 'Disabled'}
      />
    </>
  );
};

export default EditConfigPanel;
