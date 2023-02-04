export class CustomError<ErrorCodes = any> extends Error {
  error: Error;
  code?: ErrorCodes;

  constructor(
    error: Error,
    extraData?: {
      code?: ErrorCodes;
    },
  ) {
    super(error.message);
    this.error = error;

    this.code = extraData.code;
  }
}
