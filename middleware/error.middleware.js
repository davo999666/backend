// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    const messages = ["not found", "Cast to ObjectId failed"];
    const contains = messages.some((msg) => err.message.includes(msg));

    if (contains) {
        return res.status(404).json({
            code: 404,
            status: "error",
            message: "Resource not found",
            path: req.path,
        });
    }

    return  res.status(err.status || 500).json({
        code: err.status || 500,
        status: "error",
        message: err.message || "Internal Server Error",
        path: req.path,
    });
};

export default errorHandler;
