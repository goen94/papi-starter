/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseError, IError, IHttpStatus, find } from "@point-hub/express-error-handler";
import { MongoServerError } from "mongodb";

export default class MongoError extends BaseError {
  constructor(err: MongoServerError) {
    const error: IError = find(400) as IHttpStatus;
    if (err.code === 121) {
      // handle schema validation error
      error.errors = {} as any;
      const errorMessage = err.errInfo?.details.schemaRulesNotSatisfied[0].propertiesNotSatisfied;
      errorMessage.forEach((element: any) => {
        const obj: any = {};
        obj[element.propertyName] = [element.details[0].reason];
        error.errors = obj;
      });
    } else if (err.code === 11000) {
      // handle unique validation
      if (Object.keys(err.keyPattern).length === 1) {
        error.errors = {
          [Object.keys(err.keyPattern)[0]]: `The ${Object.keys(err.keyPattern)[0]} is exists`,
        };
      } else {
        // get keys
        const keys = Object.keys(err.keyPattern).reduce((keys: string, key, index) => {
          if (index === 0) {
            keys += `'`;
          }
          keys += `${key.toString()}`;
          if (index === Object.keys(err.keyPattern).length - 1) {
            keys += `'`;
          } else {
            keys += `, `;
          }
          return keys;
        }, "");

        // generate error object
        const obj = Object.keys(err.keyPattern).reduce((obj: any, key) => {
          obj[key] = [`The combination of ${keys.toString()} is exists`];
          return obj;
        }, {});
        error.errors = obj;
      }
    }
    super(error);
  }
  get isOperational() {
    return true;
  }
}
