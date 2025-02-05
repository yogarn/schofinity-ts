const errorManagement = {
  commonErrors: {
    InvalidInput: { message: 'invalid input', status: 400 },
    NotFound: { message: 'not found', status: 404 },
    Conflict: { message: 'conflict', status: 409 },
    InternalServerError: { message: 'internal server error', status: 500 },
  },
};

export default errorManagement;
