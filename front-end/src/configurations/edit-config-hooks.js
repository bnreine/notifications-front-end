import { useState } from 'react';
import dayjs from 'dayjs';

const editConfigHooks = ({ run }) => {
  const [configType, setConfigType] = useState('reminder');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [targetAtLocal, setTargetAtLocal] = useState(null);
  const [timezone, setTimezone] = useState('');
  const [enabled, setEnabled] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (configType === 'countdown') {
      if (targetAtLocal && timezone) {
        const localDateTime = targetAtLocal.format('YYYY-MM-DD HH:mm');

        const utcTimestamp = dayjs
          .tz(localDateTime, timezone)
          .utc()
          .toISOString();

        run({
          enabled,
          config: {
            type: 'countdown',
            name,
            targetAt: utcTimestamp,
            timezone,
          },
        });
      }
      return;
    }

    run({ enabled, config: { type: 'reminder', message: message } });
  };

  return {
    handleSubmit,
    setConfigType,
    configType,
    timezone,
    setTimezone,
    message,
    setMessage,
    name,
    setName,
    enabled,
    setEnabled,
    targetAtLocal,
    setTargetAtLocal,
  };
};

export default editConfigHooks;
