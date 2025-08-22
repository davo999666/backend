const errorHandler = (err, req, res, next) => {
    console.log(err.stack);
    const messages = ['not found', 'Cast to ObjectId failed'];
    const contains = messages.some(msg => err.message.includes(msg));

    if (err.message && contains) {
        return res.status(404).json({
            status: 'Not Found',
            code: 404,
            message: err.message,
            path: req.path,
        })
    }

    if (err.message && err.message.includes('duplicate key error collection')) {
        return res.status(409).json({
            status: 'Conflict',
            code: 409,
            message: err.message,
            path: req.path,
        })
    }

    return res.status(500).json({
        status: 'Internal Server Error',
        code: 500,
        message: err.message,
        path: req.path,
    })
}

export default errorHandler;