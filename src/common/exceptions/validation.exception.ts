import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
  constructor(fields) {
    if (typeof fields === 'string') {
      fields = [fields];
    }
    const error = {
      statusCode: HttpStatus.BAD_REQUEST,
      message: fields,
      error: 'Bad Request',
    };

    super(error, error.statusCode);
  }
}
