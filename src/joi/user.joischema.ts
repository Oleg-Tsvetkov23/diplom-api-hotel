import * as Joi from 'joi';

export const joiUserSchema = Joi.object().keys({
    email: Joi.string().email().required(),
    passwordHash : Joi.string().min(8).max(20).required(),
    name : Joi.string().min(3).max(50).required(),
    contactPhone : Joi.string().min(6).max(20),
})

export const joiAddUser = Joi.object().keys({
    email: Joi.string().email().required(),
    passwordHash : Joi.string().min(8).max(20).required(),
    name : Joi.string().min(3).max(50).required().required(),
    contactPhone : Joi.string().min(6).max(20).allow('').optional(),
    role : Joi.string().valid('admin','manager','client').default('client')
})

export const joiCheckListUsers = Joi.object().keys({
    limit: Joi.number().integer().min(0).optional(),
    offset: Joi.number().integer().min(0).optional(),
    email: Joi.string().optional(),
    name: Joi.string().optional(),
    contactPhone: Joi.string().optional(),
})