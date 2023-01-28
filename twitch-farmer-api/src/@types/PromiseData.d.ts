export interface PromiseDataError<errorCodesType = any> {
  success: false;
  error: Error;
  errorCode: errorCodesType;
}

export interface PromiseDataSuccess<DataType = any> {
  success: true;
  data: DataType;
}

export type PromiseData<DataType = any, errorCodesType = any> =
  | PromiseDataSuccess<DataType>
  | PromiseDataError<errorCodesType>;
