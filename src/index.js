const express = require('express');
const logger = require('./services/logger');
const config = require('./services/config');
const { getMyIpAddresses } = require('./services/get-my-ip-addresses');
const apiRoutes = require('./routes/api');
const clientRoutes = require('./routes/serve-client');

const app = express();

app.use('/api', apiRoutes);
app.use('/', clientRoutes);

if (config.trustProxy) {
    app.enable('trust proxy');
}

app.listen(config.port, (err) => {
    if (err) {
        logger.error(`RPNow failed to start: ${err}`);
    } else {
        logger.info('RPNow is running!');
        logger.info(`You may access it in your browser at http://localhost:${config.port}`);
        logger.info("Other devices should navigate to this computer's network IP, which is probably one of the following:")
        const addresses = getMyIpAddresses().map(ip => `http://${ip}:${config.port}`);
        logger.info(...addresses);
        logger.info('Have fun!');
    }
});
