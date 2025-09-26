const formatMessage = (level, message) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] ${message}`;
};

const logger = {
    info: (message, meta) => {
        if (meta) {
            console.info(formatMessage("INFO", message), meta);
        } else {
            console.info(formatMessage("INFO", message));
        }
    },
    warn: (message, meta) => {
        if (meta) {
            console.warn(formatMessage("WARN", message), meta);
        } else {
            console.warn(formatMessage("WARN", message));
        }
    },
    error: (message, meta) => {
        if (meta) {
            console.error(formatMessage("ERROR", message), meta);
        } else {
            console.error(formatMessage("ERROR", message));
        }
    },
};

export default logger;
