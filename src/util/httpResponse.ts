import { Request, Response } from 'express'
import { THTTPResponse } from '../types/types'
import config from '../config/config'
import { EApplicationEnvironment } from '../constants/application'
import logger from './logger'

export default (req: Request, res: Response, responseStatusCode: number, responseMessage: string, data: unknown = null): void => {
    const response: THTTPResponse = {
        success: true,
        status: responseStatusCode,
        request: {
            ip: req.ip || null,
            method: req.method,
            url: req.originalUrl
        },
        message: responseMessage,
        data: data
    }
    // Log
    logger.info('Controller_Response', {
        meta: response
    })

    if (config.ENV === EApplicationEnvironment.PRODUCTION) {
        delete response.request.ip
    }
    res.status(responseStatusCode).json(response)
}
