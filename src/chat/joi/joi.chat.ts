import * as Joi from 'joi';

export const joiCreateChat = Joi.object().keys({
    text: Joi.string().min(1).required(),
});

export const joiListRequestChat = Joi.object().keys({
    limit: Joi.number().integer().min(0).optional(),
    offset: Joi.number().integer().min(0).optional(),
    isActive: Joi.boolean().optional(),    
});