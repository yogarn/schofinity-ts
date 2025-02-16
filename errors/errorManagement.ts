const errorManagement = {
  commonErrors: {
    InvalidInput: { message: 'invalid input', status: 400 },
    Unauthorized: { message: 'unauthorized', status: 401 },
    NotFound: { message: 'not found', status: 404 },
    Conflict: { message: 'conflict', status: 409 },
    InternalServerError: { message: 'internal server error', status: 500 },
  },
  jwtErrors: {
    InvalidJwtFormat: { message: 'invalid jwt format', status: 403 },
    InvalidJwt: { message: 'invalid jwt', status: 403 },
  },
};

export default errorManagement;
