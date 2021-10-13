import * as Joi from 'joi';

export const dataBookSchema = Joi.object().keys({
    title: Joi.string().min(5).max(50).required(),
    description : Joi.string().min(5).max(50).required(),
    authors : Joi.string().min(5).max(50).required(),
    favorite : Joi.string().min(3).max(50).required(),
    fileCover : Joi.string().min(3).max(50).required(),
})

