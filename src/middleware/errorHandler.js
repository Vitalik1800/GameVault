const errorHandler = (err, req, res, next) => {
    console.error(err);

    if (err instanceof SyntaxError && err.status == 400 && 'body' in err) {
        return res.status(400).json({
            error: {
                message: 'Invalid JSON'
            }
        });
    }

    res.status(500).json({
        error: {
            message: 'Internal server error'
        }
    });
};

module.exports = errorHandler;