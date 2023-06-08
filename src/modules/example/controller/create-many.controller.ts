import { NextFunction, Request, Response } from "express";
import { CreateManyExampleUseCase } from "../use-case/create-many.use-case.js";
import { db } from "@src/database/database.js";

interface ResponseInterface {
  insertedCount: number;
  insertedIds: string[];
}

export const createManyController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = db.startSession();

    db.startTransaction();

    const createManyExampleUseCase = new CreateManyExampleUseCase(db);
    const result = await createManyExampleUseCase.handle(req.body, { session });

    await db.commitTransaction();

    const responseValue: ResponseInterface = {
      insertedCount: result.insertedCount,
      insertedIds: result.insertedIds,
    };

    res.status(201).json(responseValue);
  } catch (error) {
    await db.abortTransaction();
    next(error);
  } finally {
    await db.endSession();
  }
};
