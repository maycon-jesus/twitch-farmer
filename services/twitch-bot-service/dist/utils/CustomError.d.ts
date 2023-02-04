export declare class CustomError<ErrorCodes = any> extends Error {
    error: Error;
    code?: ErrorCodes;
    constructor(error: Error, extraData?: {
        code?: ErrorCodes;
    });
}
