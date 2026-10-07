import { cardStyle } from './styles';
import addConsentImg from '../assets/icons/add-consent-3.png';
import addDontConsentImg from '../assets/icons/add-dont-consent-2.png';
import { Box, Stack } from '@mui/material';

const Home = () => (
  <>
    <h1>Notifications</h1>

    <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
      Set up reminders and countdowns, then choose where each one is delivered.
    </p>

    <div style={cardStyle}>
      <h2>About</h2>

      <p>
        Notifications is a platform for configuring and delivering alerts
        through the channels you already use. You can create two types of
        configurations:
      </p>

      <ul>
        <li>
          <strong>Reminders</strong>: simple text messages you define, such as
          "Remember to clean the kitchen."
        </li>
        <li>
          <strong>Countdowns</strong>: a named event with a date, time, and
          timezone of your choosing, such as "Vacation" on June 1 at 9:00 AM in
          America/New_York. Each day, we tell you how many days are left until
          that date.
        </li>
      </ul>

      <p>
        Each configuration can be sent to WhatsApp, SMS, or Slack. Every day at
        8:00 AM EST, we send you the reminder text, or the number of days left
        until your countdown date, to each channel, as long as the configuration
        is enabled and that channel is turned on for that configuration. For SMS
        and WhatsApp, your number must also be consented and verified. You are
        opted out by default and choose which channels to enable in the app.
      </p>
    </div>

    <div style={cardStyle}>
      <h2>How It Works</h2>

      <p>Set up where messages go and what they say separately:</p>

      <h3>Destinations</h3>
      <ol>
        <li>Log in to your account.</li>
        <li>
          <strong>Slack</strong>: add your Slack channel and grant permissions
          during the Slack authorization flow.
        </li>
        <li>
          <strong>SMS / WhatsApp</strong>: enter your number and consent to
          receive messages while adding it, then verify the number afterward.
        </li>
      </ol>

      <h3>Configurations</h3>
      <ol>
        <li>
          Add as many reminders or countdowns as you need. Enter the reminder
          message, or the countdown name, date and time, and timezone.
        </li>
        <li>
          Enable the configuration and turn on the channels (WhatsApp, SMS,
          Slack) you want it sent to.
        </li>
        <li>
          Every day at 8:00 AM EST, your reminder or countdown is sent to each
          channel if the configuration is enabled and that channel is turned on
          for that configuration. For SMS and WhatsApp, the destination must
          also be consented and verified.
        </li>
      </ol>
    </div>

    <div style={cardStyle}>
      <h2>Opting Out</h2>

      <p>
        You are opted out of notifications by default. To start receiving
        messages, consent when adding an SMS or WhatsApp destination. You can
        also opt out of a delivery channel at any time by replying{' '}
        <strong>STOP</strong> on that channel.
      </p>
    </div>

    <div style={cardStyle}>
      <h2>Opting In</h2>

      <p>You can opt-in while adding the SMS/WhatsApp destination like so...</p>
      <Stack spacing={2}>
        <Box component="img" src={addDontConsentImg} alt={'dont consent'} />
        <Box component="img" src={addConsentImg} alt={'consent'} />
      </Stack>
    </div>

    <div style={cardStyle}>
      <h2>Contact</h2>

      <p>For questions regarding the service, please contact:</p>

      <p>support@notifications.benjaminreinecke.click</p>
    </div>
  </>
);

export default Home;
