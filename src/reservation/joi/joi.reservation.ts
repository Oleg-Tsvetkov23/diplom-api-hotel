import { generatePrime } from "crypto";

const Joi = require('joi')
    .extend(require('@joi/date'));

export const joiAddReservationRoom = Joi.object().keys({
    hotelRoom : Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    startDate : Joi.date().format('YYYY-MM-DD').utc().min('now').required(),
    endDate :  Joi.date().format('YYYY-MM-DD').utc().greater(Joi.ref('startDate')).required()
});

export const joiGetReservationRoomList = Joi.object().keys({
    startDate : Joi.date().format('YYYY-MM-DD').utc()/*.min('now')*/.optional(),
    endDate :  Joi.date().format('YYYY-MM-DD').utc()/*.min('now')*/.optional(),
//    endDate: Joi.when(Joi.ref('startDate'), { is: Joi.date().format('YYYY_MM_DD').utc(), then: Joi.date().greater(Joi.ref('startDate')).optional()}),
//    endTime: Joi.when(Joi.ref('startTime'), { is: Joi.date().required(), then: Joi.date().max('1-1-2100') })
});