
import type {
  ErrorRequestHandler,
} from "express";

export const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  _next
) => {
  console.error("API Error:", err.message);

  const statusCode =
    typeof err.status === "number" &&
    err.status >= 400 &&
    err.status < 600
      ? err.status
      : 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error. Please try again later."
        : err.message || "Request failed",
  });
};
