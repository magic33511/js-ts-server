import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export function Validate(schema: Joi.ObjectSchema) {
    return function (target: any, propertyKey: string, desctioptor: PropertyDescriptor) {
        const originalMethod = desctioptor.value;

        desctioptor.value = async function (req: Request, res: Response, next: NextFunction) {
            try {
                await schema.validateAsync(req.body);
            }
            catch (error) {
                logging.error(error);
                return res.status(422).json(error);
            }

            return originalMethod.call(this, req, res, next);
        }


        return desctioptor;
    }
}