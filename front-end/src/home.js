import { cardStyle } from './styles';

const Home = () => (
    <>
        <h1>Notifications</h1>

        <p style={{ color: '#6c757d', marginBottom: '2rem' }}>
            Set up reminders and stock alerts, then choose where each one is delivered.
        </p>

        <div style={cardStyle}>
            <h2>About</h2>

            <p>
                Notifications is a platform for configuring and delivering alerts through the
                channels you already use. You can create two types of notifications:
            </p>

            <ul>
                <li>
                    <strong>Reminders</strong>: simple text messages you define, such as
                    "Remember to clean the kitchen."
                </li>
                <li>
                    <strong>Stock alerts</strong>: alerts when a stock moves outside a price
                    range you set, such as notifying you "AAPL is currently at $440" when
                    Apple trades outside $300–$400.
                </li>
            </ul>

            <p>
                Each notification can be sent to WhatsApp, SMS, or Slack. Notifications are
                checked once per day at 8:00 AM EST and delivered when your conditions are met.
                You are opted out by default and choose which alerts to enable in the app.
            </p>
        </div>

        <div style={cardStyle}>
            <h2>How It Works</h2>

            <ol>
                <li>Log in to your account.</li>
                <li>Add as many reminders or stock alerts as you need.</li>
                <li>Configure the message, trigger conditions, and delivery channels for each one.</li>
                <li>Opt in to the notifications you want to receive.</li>
                <li>Receive alerts on WhatsApp, SMS, or Slack when your conditions are met. Notifications are evaluated once per day at 8:00 AM EST.</li>
            </ol>
        </div>

        <div style={cardStyle}>
            <h2>Opting Out</h2>

            <p>
                You are opted out of notifications by default. To start receiving alerts,
                opt in to each notification in the app. You can also opt out of a delivery
                channel at any time by replying <strong>STOP</strong> on that channel.
            </p>
        </div>

        <div style={cardStyle}>
            <h2>Contact</h2>

            <p>
                For questions regarding the service, please contact:
            </p>

            <p>
                support@notifications.benjaminreincke.click
            </p>
        </div>
    </>
);

export default Home;
