import * as Joi from 'joi';

export const joiAddHotelRoom = Joi.object().keys({
    title: Joi.string().min(1).required(),
    description : Joi.string().min(3).optional(),
    hotelId : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
//    images : Joi.string().required()
});

export const joiAddHotel = Joi.object().keys({
    title: Joi.string().min(1).required(),
    description : Joi.string().min(3).optional(),
});

export const joiGetHotelList = Joi.object().keys({
    limit: Joi.number().integer().min(0).optional(),
    offset: Joi.number().integer().min(0).optional(),
    title: Joi.string().optional(),    
});

export const joiUpdateHotel =Joi.object().keys({
    title: Joi.string().min(1).optional(),
    description : Joi.string().min(3).optional()
});

export const joiGetHotelRoomList = Joi.object().keys({
    limit: Joi.number().integer().min(0).optional(),
    offset: Joi.number().integer().min(0).optional(),
    hotel : Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional()
});

export const joiUpdateHotelRoom =Joi.object().keys({
    title: Joi.string().min(1).required(),
    description : Joi.string().min(3).required(),
    isEnabled : Joi.boolean().required(),
    hotelId : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    images : Joi.array().required(),
});
