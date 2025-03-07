/* eslint-disable prefer-const */
/* eslint-disable no-self-assign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
import db from '../config/mysqlConnection'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'
import { SentMessageInfo } from 'nodemailer'
import * as XLSX from 'xlsx'
import nodemailer from 'nodemailer'

import mysql from 'mysql2/promise'

interface QuoteRequest {
    name: string
    email: string
    estimate: string
}

export default {
    getAnshInr: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query('SELECT * FROM ansh_ind WHERE company_id = ? ORDER BY source ASC', [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAnshUsd: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows]: any = await db.query('SELECT * FROM ansh_usd WHERE company_id = ? ORDER BY source ASC', [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getCosting: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query('SELECT * FROM ansh_inr')
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getDomain: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query('SELECT * FROM domain_multiplier WHERE company_id = ? ORDER BY domain ASC', [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getDomainMultiplier: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query(`SELECT DISTINCT domain FROM domain_multiplier WHERE company_id = ? ORDER BY domain ASC`, [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getPenalty: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query('SELECT * FROM penalty WHERE company_id = ? ORDER BY service ASC', [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getQuality: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query('SELECT * FROM quality WHERE company_id = ? ORDER BY quality ASC', [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getFormQuality: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id, service } = req.query
        try {
            const [rows] = await db.query('SELECT DISTINCT * FROM quality WHERE company_id = ? AND service = ?', [company_id, service])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getCurrencyByCompany: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query(`SELECT * FROM currency where company_id = ? ORDER BY currency ASC`, [company_id])
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getCurrency: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query(`SELECT * FROM currency`)
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    // getServices: async (req: Request, res: Response, nextFunc: NextFunction) => {
    //     try {
    //         const { company_id } = req.query

    //         // Validate that company_id is provided
    //         if (!company_id) {
    //             return httpResponse(req, res, 400, 'Company ID is required')
    //         }

    //         // SQL query to fetch unique services for the given company_id
    //         const query = `
    //             SELECT DISTINCT service FROM ansh_ind WHERE company_id = ? UNION SELECT DISTINCT service FROM ansh_usd WHERE company_id = ? ORDER BY service
    //         `

    //         const [rows] = await db.query(query, [company_id, company_id])

    //         // Return the unique services
    //         httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
    //     } catch (err) {
    //         // Handle errors gracefully
    //         httpError(nextFunc, err, req, 500)
    //     }
    // },

    getServices: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { company_id } = req.query
    
            // Validate that company_id is provided
            if (!company_id) {
                return httpResponse(req, res, 400, 'Company ID is required')
            }
    
            // SQL query to fetch unique services for the given company_id without duplication
            const query = `
                SELECT service FROM ansh_ind WHERE company_id = ?
                UNION ALL
                SELECT service FROM ansh_usd WHERE company_id = ?`
    
            const [rows]: any = await db.query(query, [company_id, company_id])
    
            // Remove duplicates and trim whitespace to ensure uniqueness
            const uniqueServices = [...new Set(rows.map((row: { service: string }) => row.service.trim()))].sort()
    
            // Return the unique services
            httpResponse(req, res, 200, responseMessage.SUCCESS, uniqueServices)
        } catch (err) {
            // Handle errors gracefully
            httpError(nextFunc, err, req, 500)
        }
    },    

    getSourceLanguage: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { service, company_id, currency } = req.query

        console.log(currency)

        // Validate 'service' parameter
        if (typeof service !== 'string' || service.trim() === '') {
            return httpResponse(req, res, 400, 'Service parameter is required and must be a valid string.')
        }

        // Validate 'company_id' parameter
        if (typeof company_id !== 'string' || company_id.trim() === '' || isNaN(parseInt(company_id))) {
            return httpResponse(req, res, 400, 'Company ID parameter is required and must be a valid number.')
        }

        // Validate 'currency' parameter
        if (typeof currency !== 'string' || currency.trim() === '') {
            return httpResponse(req, res, 400, 'Currency parameter is required and must be a valid string.')
        }

        try {
            // Check if the currency is INR or not by querying the database
            const [currencyRows]: any = await db.query('SELECT currency FROM currency WHERE currency = ?', [currency.trim().toUpperCase()])

            if (currencyRows.length === 0) {
                return httpResponse(req, res, 400, `Invalid currency: ${currency}. Please provide a valid currency from the database.`)
            }

            // Determine the primary table based on currency
            const primaryTable = currency.trim().toUpperCase() === 'INR' ? 'ansh_ind' : 'ansh_usd'

            // Query the primary table for source languages
            let [rows]: any = await db.query(`SELECT DISTINCT source FROM ${primaryTable} WHERE service = ? AND company_id = ?`, [
                service,
                parseInt(company_id)
            ])

            // Fallback to 'ansh_inr' table if no data is found in the primary table
            if (rows.length === 0 && primaryTable !== 'ansh_ind') {
                ;[rows] = await db.query(`SELECT DISTINCT source FROM ansh_ind WHERE service = ? AND company_id = ?`, [service, parseInt(company_id)])
            }

            // Check if data exists after fallback
            if (rows.length === 0) {
                return httpResponse(
                    req,
                    res,
                    404,
                    `No source languages found for service: ${service}, company_id: ${company_id}, and currency: ${currency}`
                )
            }

            // Return the data
            return httpResponse(req, res, 200, 'Source languages fetched successfully.', rows)
        } catch (err) {
            // Handle errors
            return httpError(nextFunc, err, req, 500)
        }
    },

    getTargetLanguage: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { source, service, company_id, currency } = req.query

        // Validate 'source' parameter
        if (typeof source !== 'string' || source.trim() === '') {
            return httpResponse(req, res, 400, 'Source parameter is required and must be a valid string.')
        }

        // Validate 'service' parameter
        if (typeof service !== 'string' || service.trim() === '') {
            return httpResponse(req, res, 400, 'Service parameter is required and must be a valid string.')
        }

        // Validate 'company_id' parameter
        if (typeof company_id !== 'string' || company_id.trim() === '' || isNaN(parseInt(company_id))) {
            return httpResponse(req, res, 400, 'Company ID parameter is required and must be a valid number.')
        }

        // Validate 'currency' parameter
        if (typeof currency !== 'string' || currency.trim() === '') {
            return httpResponse(req, res, 400, 'Currency parameter is required and must be a valid string.')
        }

        try {
            // Check if the currency is valid by querying the database
            const [currencyRows]: any = await db.query('SELECT currency FROM currency WHERE currency = ?', [currency.trim().toUpperCase()])

            if (currencyRows.length === 0) {
                return httpResponse(req, res, 400, `Invalid currency: ${currency}. Please provide a valid currency from the database.`)
            }

            // Determine the primary table based on the currency
            const primaryTable = currency.trim().toUpperCase() === 'INR' ? 'ansh_ind' : 'ansh_usd'

            // Query the primary table for target languages
            let [rows]: any = await db.query(`SELECT DISTINCT target FROM ${primaryTable} WHERE source = ? AND service = ? AND company_id = ?`, [
                source,
                service,
                parseInt(company_id)
            ])

            // Fallback to 'ansh_inr' table if no data is found in the primary table
            if (rows.length === 0 && primaryTable !== 'ansh_ind') {
                ;[rows] = await db.query(`SELECT DISTINCT target FROM ansh_ind WHERE source = ? AND service = ? AND company_id = ?`, [
                    source,
                    service,
                    parseInt(company_id)
                ])
            }

            // Check if data exists after fallback
            if (rows.length === 0) {
                return httpResponse(
                    req,
                    res,
                    404,
                    `No target languages found for source: ${source}, service: ${service}, company_id: ${company_id}, and currency: ${currency}`
                )
            }

            // Return the data
            return httpResponse(req, res, 200, 'Target languages fetched successfully.', rows)
        } catch (err) {
            // Handle errors
            return httpError(nextFunc, err, req, 500)
        }
    },

    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body

    //     // Validate inputs
    //     if (
    //         !domain ||
    //         !currency ||
    //         !service ||
    //         !quantity ||
    //         !quantity_type ||
    //         !source_language ||
    //         !Array.isArray(target_language) ||
    //         !target_language.length ||
    //         !quality
    //     ) {
    //         return httpResponse(req, res, 400, 'All required fields must be provided.')
    //     }

    //     try {
    //         const estimates = []

    //         let pricingTable = 'ansh_usd'
    //         let currencyMultiplier = 1

    //         if (currency === 'INR') {
    //             pricingTable = 'ansh_ind'
    //             currencyMultiplier = 1
    //         } else if (currency !== 'USD') {
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ?`, [currency])
    //             if (currencyRows && currencyRows.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m // Get the multiplier for non-USD/INR currencies
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`)
    //             }
    //         }

    //         for (const target of target_language) {
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const [pricingRows]: any = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ?`,
    //                 [source_language, target, service]
    //             )

    //             if (!pricingRows || pricingRows.length === 0) {
    //                 return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`)
    //             }

    //             const pricing = pricingRows[0]

    //             if (!pricing.price_word || !pricing.price_page) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid or missing pricing data for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }

    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //             const priceWord = parseFloat(pricing.price_word)
    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //             const pricePage = parseFloat(pricing.price_page)
    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //             const minimum = parseFloat(pricing.minimum) || 0 // Get the minimum price from pricing
    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0

    //             if (isNaN(priceWord) || isNaN(pricePage)) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid pricing values for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }

    //             // Fetch domain-specific multiplier and additional days
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const [domainRows]: any = await db.query(`SELECT * FROM domain_multiplier WHERE domain = ? AND service = ?`, [domain, service])
    //             const domainData = domainRows.length ? domainRows[0] : { domain_multiplier: 1.0, add_days: 0 }

    //             // Fetch quality-related data (percentage cost and additional days)
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const [qualityRows]: any = await db.query(`SELECT * FROM quality WHERE quality = ? AND service = ?`, [quality, service])
    //             const qualityData = qualityRows.length ? qualityRows[0] : { add_percentage_cost: 0, add_days: 0 }

    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.')
    //             }

    //             // Ensure quantity_type is valid for the service
    //             if ((service === 'Subtitling' || service === 'Transcription') && quantity_type !== 'minutes' && quantity_type !== 'hours') {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type for subtitling/transcription. Must be "minutes" or "hours".')
    //             } else if (
    //                 service !== 'Subtitling' &&
    //                 service !== 'Transcription' &&
    //                 quantity_type !== 'words' &&
    //                 quantity_type !== 'pages' &&
    //                 quantity_type !== 'minutes' &&
    //                 quantity_type !== 'hours'
    //             ) {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type. Must be "words", "pages", "minutes", or "hours".')
    //             }

    //             let baseCost = 0
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'minutes') {
    //                     baseCost = priceWord * quantity
    //                 } else if (quantity_type === 'hours') {
    //                     baseCost = pricePage * quantity
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     baseCost = priceWord * quantity
    //                 } else if (quantity_type === 'pages') {
    //                     baseCost = pricePage * quantity
    //                 }
    //             }

    //             if (baseCost < minimum) {
    //                 baseCost = minimum
    //             }

    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    //             if (certificate_required.toLowerCase() === 'yes') {
    //                 baseCost += certificateCost
    //             }

    //             baseCost *= domainData.domain_multiplier || 1.0

    //             baseCost *= currencyMultiplier

    //             baseCost += (baseCost * (qualityData.add_percentage_cost || 0)) / 100

    //             let baseDays = 0
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'hours') {
    //                     baseDays = pricing.pages_per_day > 0 ? Math.ceil(quantity / pricing.pages_per_day) : 0
    //                 } else if (quantity_type === 'minutes') {
    //                     baseDays = pricing.words_per_day > 0 ? Math.ceil(quantity / pricing.words_per_day) : 0
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     baseDays = pricing.words_per_day > 0 ? Math.ceil(quantity / pricing.words_per_day) : 0
    //                 } else if (quantity_type === 'pages') {
    //                     baseDays = pricing.pages_per_day > 0 ? Math.ceil(quantity / pricing.pages_per_day) : 0
    //                 }
    //             }

    //             const totalDays = baseDays + domainData.add_days + qualityData.add_days

    //             // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    //             if (isNaN(baseCost) || isNaN(totalDays)) {
    //                 return httpResponse(req, res, 500, 'Error in cost or time calculation. Please verify pricing data.')
    //             }

    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const [penaltyRows]: any = await db.query(`SELECT * FROM penalty WHERE service = ? AND strength = ?`, [service, pricing.strength])
    //             const penaltyData = penaltyRows.length ? penaltyRows[0] : { penalty_percentage: 0 }
    //             const penaltyPercentage = penaltyData.penalty_percentage

    //             const penaltyMessage =
    //                 penaltyPercentage > 0
    //                     ? `Penalty payable if not delivered within the quoted time frame :: ${penaltyPercentage}%.`
    //                     : 'No Penalty :: This is a rare language combination and very few translators work with the given pair. We would send a final confirmation via email.'

    //             estimates.push({
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} And would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             })
    //         }

    //         const ipApiUrl = 'https://api.ipify.org?format=json'
    //         const ipResponse = await axios.get(ipApiUrl)
    //         const clientIp = ipResponse.data.ip

    //         const insertQuery = `
    //     INSERT INTO estimate_cost (
    //         service, currency, domain, quantity, quantity_type,
    //         source_language, target_language, certificate_required, quality,
    //         ip_address, total_cost, time_stamp
    //     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    // `

    //         for (const estimate of estimates) {
    //             const { target_language, estimatedCost } = estimate

    //             await db.query(insertQuery, [
    //                 service,
    //                 currency,
    //                 domain,
    //                 quantity,
    //                 quantity_type,
    //                 source_language,
    //                 target_language,
    //                 certificate_required,
    //                 quality,
    //                 clientIp,
    //                 estimatedCost
    //             ])
    //         }
    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates })
    //     } catch (error) {
    //         return httpError(next, error, req, 500)
    //     }
    // },

    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body

    //     const { company_id } = req.query

    //     if (
    //         !company_id ||
    //         !domain ||
    //         !currency ||
    //         !service ||
    //         !quantity ||
    //         !quantity_type ||
    //         !source_language ||
    //         !Array.isArray(target_language) ||
    //         !target_language.length ||
    //         !quality
    //     ) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.')
    //     }

    //     try {
    //         const estimates = []

    //         let pricingTable = 'ansh_usd'
    //         let currencyMultiplier = 1

    //         if (currency === 'INR') {
    //             pricingTable = 'ansh_ind'
    //             currencyMultiplier = 1
    //         } else if (currency !== 'USD') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [
    //                 currency,
    //                 company_id
    //             ])
    //             if (currencyRows && currencyRows.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`)
    //             }
    //         }

    //         for (const target of target_language) {
    //             let pricingRows: any

    //             // Attempt to fetch from the primary table (e.g., ansh_usd)
    //             ;[pricingRows] = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             )

    //             // Fallback to the ansh_inr table if no data is found in the primary table
    //             if (!pricingRows || pricingRows.length === 0) {
    //                 ;[pricingRows] = await db.query(
    //                     `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                     [source_language, target, service, company_id]
    //                 )
    //             }

    //             // If still no data is found, return an error
    //             if (!pricingRows || pricingRows.length === 0) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     404,
    //                     `Language pair (${source_language} -> ${target}) or service not found in pricing data for the given company.`
    //                 )
    //             }

    //             const pricing = pricingRows[0]

    //             if (!pricing.price_word || !pricing.price_page) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid or missing pricing data for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }

    //             const priceWord = parseFloat(pricing.price_word)
    //             const pricePage = parseFloat(pricing.price_page)
    //             const minimum = parseFloat(pricing.minimum) || 0
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0

    //             if (isNaN(priceWord) || isNaN(pricePage)) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid pricing values for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }

    //             const [domainRows]: any = await db.query(`SELECT * FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`, [
    //                 domain,
    //                 service,
    //                 company_id
    //             ])
    //             const domainData = domainRows.length ? domainRows[0] : { domain_multiplier: 1.0, add_days: 0 }

    //             const [qualityRows]: any = await db.query(`SELECT * FROM quality WHERE quality = ? AND service = ? AND company_id = ?`, [
    //                 quality,
    //                 service,
    //                 company_id
    //             ])
    //             const qualityData = qualityRows.length ? qualityRows[0] : { add_percentage_cost: 0, add_days: 0 }

    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.')
    //             }

    //             if ((service === 'Subtitling' || service === 'Transcription') && quantity_type !== 'minutes' && quantity_type !== 'hours') {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type for subtitling/transcription. Must be "minutes" or "hours".')
    //             } else if (
    //                 service !== 'Subtitling' &&
    //                 service !== 'Transcription' &&
    //                 quantity_type !== 'words' &&
    //                 quantity_type !== 'pages' &&
    //                 quantity_type !== 'minutes' &&
    //                 quantity_type !== 'hours'
    //             ) {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type. Must be "words", "pages", "minutes", or "hours".')
    //             }

    //             let baseCost = 0
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'minutes') {
    //                     baseCost = priceWord * quantity
    //                 } else if (quantity_type === 'hours') {
    //                     baseCost = pricePage * quantity
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     baseCost = priceWord * quantity
    //                 } else if (quantity_type === 'pages') {
    //                     baseCost = pricePage * quantity
    //                 }
    //             }

    //             if (baseCost < minimum) {
    //                 baseCost = minimum
    //             }

    //             if (certificate_required.toLowerCase() === 'yes') {
    //                 baseCost += certificateCost
    //             }

    //             baseCost *= domainData.domain_multiplier || 1.0
    //             baseCost *= currencyMultiplier
    //             baseCost += (baseCost * (qualityData.add_percentage_cost || 0)) / 100

    //             let baseDays = 0

    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'hours') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.')
    //                     }
    //                 } else if (quantity_type === 'minutes') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.')
    //                     }
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.')
    //                     }
    //                 } else if (quantity_type === 'pages') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.')
    //                     }
    //                 }
    //             }

    //             const totalDays = baseDays + domainData.add_days + qualityData.add_days

    //             if (isNaN(baseCost) || isNaN(totalDays)) {
    //                 return httpResponse(req, res, 500, 'Error in cost or time calculation. Please verify pricing data.')
    //             }

    //             const [penaltyRows]: any = await db.query(`SELECT * FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`, [
    //                 service,
    //                 pricing.strength,
    //                 company_id
    //             ])

    //             const [companyRows]: any = await db.query(`SELECT * FROM companies WHERE id = ?`, [company_id])

    //             const penaltyData = penaltyRows.length ? penaltyRows[0] : { penalty_percentage: 0 }
    //             const penaltyPercentage = penaltyData.penalty_percentage

    //             const penaltyMsg = companyRows[0].penalty_msg
    //             const noPenaltyMsg = companyRows[0].no_penalty

    //             const penaltyMessage = penaltyPercentage > 0 ? `${penaltyMsg} :: ${penaltyPercentage}%.` : `${noPenaltyMsg}`

    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} And would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             })
    //         }

    //         const ipApiUrl = 'https://api.ipify.org?format=json'
    //         const ipResponse = await axios.get(ipApiUrl)
    //         const clientIp = ipResponse.data.ip

    //         const insertQuery = `
    //             INSERT INTO estimate_cost (
    //                 company_id, service, currency, domain, quantity, quantity_type,
    //                 source_language, target_language, certificate_required, quality,
    //                 ip_address, total_cost, time_stamp
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    //         `

    //         const insertedIds = []

    //         for (const estimate of estimates) {
    //             const { target_language, estimatedCost } = estimate

    //             const result: any = await db.query(insertQuery, [
    //                 company_id,
    //                 service,
    //                 currency,
    //                 domain,
    //                 quantity,
    //                 quantity_type,
    //                 source_language,
    //                 target_language,
    //                 certificate_required,
    //                 quality,
    //                 clientIp,
    //                 estimatedCost
    //             ])

    //             if (result && result.insertId) {
    //                 insertedIds.push(result.insertId)
    //             } else {
    //                 console.log('Insert failed or no insertId returned', result)
    //             }
    //         }

    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates, insertedIds })
    //     } catch (error) {
    //         return httpError(next, error, req, 500)
    //     }
    // },

    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    //     const { company_id } = req.query;

    //     if (
    //         !company_id ||
    //         !domain ||
    //         !currency ||
    //         !service ||
    //         !quantity ||
    //         !quantity_type ||
    //         !source_language ||
    //         !Array.isArray(target_language) ||
    //         !target_language.length ||
    //         !quality
    //     ) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    //     }

    //     try {
    //         const estimates = [];

    //         // eslint-disable-next-line prefer-const
    //         let pricingTable = 'ansh_usd';
    //         let currencyMultiplier = 1;

    //         // Fetch the currency multiplier for currencies other than INR
    //         if (currency !== 'INR') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [
    //                 currency,
    //                 company_id,
    //             ]);
    //             if (currencyRows && currencyRows.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m;
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
    //             }
    //         }

    //         for (const target of target_language) {
    //             let pricingRows: any;

    //             // Fetch from `ansh_usd` table
    //             [pricingRows] = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );

    //             // Case 1: No data in `ansh_usd`, fetch from `ansh_ind`
    //             if (!pricingRows || pricingRows.length === 0) {
    //                 [pricingRows] = await db.query(
    //                     `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                     [source_language, target, service, company_id]
    //                 );

    //                 // If data exists in `ansh_ind`, handle currency multipliers
    //                 if (pricingRows && pricingRows.length > 0) {
    //                     if (currency !== 'INR') {
    //                         currencyMultiplier = currencyMultiplier; // For currencies other than INR, multiply
    //                     }
    //                     if (currency === 'USD') {
    //                         currencyMultiplier = currencyMultiplier; // USD also gets multiplied when table is ansh_ind
    //                     }
    //                 } else {
    //                     return httpResponse(
    //                         req,
    //                         res,
    //                         404,
    //                         `Language pair (${source_language} -> ${target}) or service not found in pricing data for the given company.`
    //                     );
    //                 }
    //             }

    //             // Case 2: Data is present in `ansh_usd`
    //             // If data exists in `ansh_usd`, no multiplication for USD currency, but multiply for other currencies
    //             if (pricingTable === 'ansh_usd' && currency !== 'USD' && currency !== 'INR') {
    //                 currencyMultiplier = currencyMultiplier; // Multiply for other currencies except INR
    //             }

    //             const pricing = pricingRows[0];

    //             if (!pricing.price_word || !pricing.price_page) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid or missing pricing data for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 );
    //             }

    //             const priceWord = parseFloat(pricing.price_word);
    //             const pricePage = parseFloat(pricing.price_page);
    //             const minimum = parseFloat(pricing.minimum) || 0;
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0;

    //             if (isNaN(priceWord) || isNaN(pricePage)) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid pricing values for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 );
    //             }

    //             const [domainRows]: any = await db.query(`SELECT * FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`, [
    //                 domain,
    //                 service,
    //                 company_id
    //             ]);
    //             const domainData = domainRows.length ? domainRows[0] : { domain_multiplier: 1.0, add_days: 0 };

    //             const [qualityRows]: any = await db.query(`SELECT * FROM quality WHERE quality = ? AND service = ? AND company_id = ?`, [
    //                 quality,
    //                 service,
    //                 company_id
    //             ]);
    //             const qualityData = qualityRows.length ? qualityRows[0] : { add_percentage_cost: 0, add_days: 0 };

    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.');
    //             }

    //             if ((service === 'Subtitling' || service === 'Transcription') && quantity_type !== 'minutes' && quantity_type !== 'hours') {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type for subtitling/transcription. Must be "minutes" or "hours".');
    //             } else if (
    //                 service !== 'Subtitling' &&
    //                 service !== 'Transcription' &&
    //                 quantity_type !== 'words' &&
    //                 quantity_type !== 'pages' &&
    //                 quantity_type !== 'minutes' &&
    //                 quantity_type !== 'hours'
    //             ) {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type. Must be "words", "pages", "minutes", or "hours".');
    //             }

    //             let baseCost = 0;
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'minutes') {
    //                     baseCost = priceWord * quantity;
    //                 } else if (quantity_type === 'hours') {
    //                     baseCost = pricePage * quantity;
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     baseCost = priceWord * quantity;
    //                 } else if (quantity_type === 'pages') {
    //                     baseCost = pricePage * quantity;
    //                 }
    //             }

    //             if (baseCost < minimum) {
    //                 baseCost = minimum;
    //             }

    //             if (certificate_required.toLowerCase() === 'yes') {
    //                 baseCost += certificateCost;
    //             }

    //             baseCost *= domainData.domain_multiplier || 1.0;
    //             baseCost *= currencyMultiplier;
    //             baseCost += (baseCost * (qualityData.add_percentage_cost || 0)) / 100;

    //             let baseDays = 0;

    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'hours') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.');
    //                     }
    //                 } else if (quantity_type === 'minutes') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.');
    //                     }
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.');
    //                     }
    //                 } else if (quantity_type === 'pages') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.');
    //                     }
    //                 }
    //             }

    //             const totalDays = baseDays + domainData.add_days + qualityData.add_days;

    //             if (isNaN(baseCost) || isNaN(totalDays)) {
    //                 return httpResponse(req, res, 500, 'Error in cost or time calculation. Please verify pricing data.');
    //             }

    //             const [penaltyRows]: any = await db.query(`SELECT * FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`, [
    //                 service,
    //                 pricing.strength,
    //                 company_id
    //             ]);

    //             const [companyRows]: any = await db.query(`SELECT * FROM companies WHERE id = ?`, [company_id]);

    //             const penaltyData = penaltyRows.length ? penaltyRows[0] : { penalty_percentage: 0 };
    //             const penaltyPercentage = penaltyData.penalty_percentage;

    //             const penaltyMsg = companyRows[0].penalty_msg;
    //             const noPenaltyMsg = companyRows[0].no_penalty;

    //             const penaltyMessage = penaltyPercentage > 0 ? `${penaltyMsg} :: ${penaltyPercentage}%.` : `${noPenaltyMsg}`;

    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} And would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             });
    //         }

    //         const ipApiUrl = 'https://api.ipify.org?format=json';
    //         const ipResponse = await axios.get(ipApiUrl);
    //         const clientIp = ipResponse.data.ip;

    //         const insertQuery = `
    //             INSERT INTO estimate_cost (
    //                 company_id, service, currency, domain, quantity, quantity_type,
    //                 source_language, target_language, certificate_required, quality,
    //                 ip_address, total_cost, time_stamp
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    //         `;

    //         const insertedIds = [];

    //         for (const estimate of estimates) {
    //             const { target_language, estimatedCost } = estimate;

    //             const result: any = await db.query(insertQuery, [
    //                 company_id,
    //                 service,
    //                 currency,
    //                 domain,
    //                 quantity,
    //                 quantity_type,
    //                 source_language,
    //                 target_language,
    //                 certificate_required,
    //                 quality,
    //                 clientIp,
    //                 estimatedCost
    //             ]);

    //             if (result && result.insertId) {
    //                 insertedIds.push(result.insertId);
    //             } else {
    //                 console.log('Insert failed or no insertId returned', result);
    //             }
    //         }

    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates, insertedIds });
    //     } catch (error) {
    //         return httpError(next, error, req, 500);
    //     }
    // },

    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    //     const { company_id } = req.query;

    //     if (
    //         !company_id ||
    //         !domain ||
    //         !currency ||
    //         !service ||
    //         !quantity ||
    //         !quantity_type ||
    //         !source_language ||
    //         !Array.isArray(target_language) ||
    //         !target_language.length ||
    //         !quality
    //     ) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    //     }

    //     try {
    //         const estimates = [];

    //         // eslint-disable-next-line prefer-const
    //         let pricingTable = 'ansh_usd';
    //         let currencyMultiplier = 1;

    //         // Fetch the currency multiplier for currencies other than INR and USD when using `ansh_usd`
    //         if (currency !== 'INR' && (pricingTable !== 'ansh_usd' || currency !== 'USD')) {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [
    //                 currency,
    //                 company_id,
    //             ]);
    //             if (currencyRows && currencyRows.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m;
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
    //             }
    //         }

    //         for (const target of target_language) {
    //             let pricingRows: any;

    //             // Fetch from `ansh_usd` table
    //             [pricingRows] = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );

    //             // Case 1: No data in `ansh_usd`, fetch from `ansh_ind`
    //             if (!pricingRows || pricingRows.length === 0) {
    //                 [pricingRows] = await db.query(
    //                     `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                     [source_language, target, service, company_id]
    //                 );

    //                 // If data exists in `ansh_ind`, handle currency multipliers
    //                 if (pricingRows && pricingRows.length > 0) {
    //                     if (currency !== 'INR') {
    //                         currencyMultiplier = currencyMultiplier; // For currencies other than INR, multiply
    //                     }
    //                     if (currency === 'USD') {
    //                         currencyMultiplier = currencyMultiplier; // USD also gets multiplied when table is ansh_ind
    //                     }
    //                 } else {
    //                     return httpResponse(
    //                         req,
    //                         res,
    //                         404,
    //                         `Language pair (${source_language} -> ${target}) or service not found in pricing data for the given company.`
    //                     );
    //                 }
    //             }

    //             // Case 2: Data is present in `ansh_usd`
    //             // If data exists in `ansh_usd`, no multiplication for USD currency, but multiply for other currencies
    //             if (pricingTable === 'ansh_usd' && currency !== 'USD' && currency !== 'INR') {
    //                 currencyMultiplier = currencyMultiplier; // Multiply for other currencies except INR
    //             }

    //             const pricing = pricingRows[0];

    //             if (!pricing.price_word || !pricing.price_page) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid or missing pricing data for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 );
    //             }

    //             const priceWord = parseFloat(pricing.price_word);
    //             const pricePage = parseFloat(pricing.price_page);
    //             const minimum = parseFloat(pricing.minimum) || 0;
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0;

    //             if (isNaN(priceWord) || isNaN(pricePage)) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid pricing values for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 );
    //             }

    //             const [domainRows]: any = await db.query(`SELECT * FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`, [
    //                 domain,
    //                 service,
    //                 company_id
    //             ]);
    //             const domainData = domainRows.length ? domainRows[0] : { domain_multiplier: 1.0, add_days: 0 };

    //             const [qualityRows]: any = await db.query(`SELECT * FROM quality WHERE quality = ? AND service = ? AND company_id = ?`, [
    //                 quality,
    //                 service,
    //                 company_id
    //             ]);
    //             const qualityData = qualityRows.length ? qualityRows[0] : { add_percentage_cost: 0, add_days: 0 };

    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.');
    //             }

    //             if ((service === 'Subtitling' || service === 'Transcription') && quantity_type !== 'minutes' && quantity_type !== 'hours') {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type for subtitling/transcription. Must be "minutes" or "hours".');
    //             } else if (
    //                 service !== 'Subtitling' &&
    //                 service !== 'Transcription' &&
    //                 quantity_type !== 'words' &&
    //                 quantity_type !== 'pages' &&
    //                 quantity_type !== 'minutes' &&
    //                 quantity_type !== 'hours'
    //             ) {
    //                 return httpResponse(req, res, 400, 'Invalid quantity type. Must be "words", "pages", "minutes", or "hours".');
    //             }

    //             let baseCost = 0;
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'minutes') {
    //                     baseCost = priceWord * quantity;
    //                 } else if (quantity_type === 'hours') {
    //                     baseCost = pricePage * quantity;
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     baseCost = priceWord * quantity;
    //                 } else if (quantity_type === 'pages') {
    //                     baseCost = pricePage * quantity;
    //                 }
    //             }

    //             if (baseCost < minimum) {
    //                 baseCost = minimum;
    //             }

    //             if (certificate_required.toLowerCase() === 'yes') {
    //                 baseCost += certificateCost;
    //             }

    //             baseCost *= domainData.domain_multiplier || 1.0;
    //             baseCost *= currencyMultiplier;
    //             baseCost += (baseCost * (qualityData.add_percentage_cost || 0)) / 100;

    //             let baseDays = 0;

    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'hours') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.');
    //                     }
    //                 } else if (quantity_type === 'minutes') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.');
    //                     }
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.');
    //                     }
    //                 } else if (quantity_type === 'pages') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day);
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.');
    //                     }
    //                 }
    //             }

    //             const totalDays = baseDays + domainData.add_days + qualityData.add_days;

    //             if (isNaN(baseCost) || isNaN(totalDays)) {
    //                 return httpResponse(req, res, 500, 'Error in cost or time calculation. Please verify pricing data.');
    //             }

    //             const [penaltyRows]: any = await db.query(`SELECT * FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`, [
    //                 service,
    //                 pricing.strength,
    //                 company_id
    //             ]);

    //             const [companyRows]: any = await db.query(`SELECT * FROM companies WHERE id = ?`, [company_id]);

    //             const penaltyData = penaltyRows.length ? penaltyRows[0] : { penalty_percentage: 0 };
    //             const penaltyPercentage = penaltyData.penalty_percentage;

    //             const penaltyMsg = companyRows[0].penalty_msg;
    //             const noPenaltyMsg = companyRows[0].no_penalty;

    //             const penaltyMessage = penaltyPercentage > 0 ? `${penaltyMsg} :: ${penaltyPercentage}%.` : `${noPenaltyMsg}`;

    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} And would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             });
    //         }

    //         const ipApiUrl = 'https://api.ipify.org?format=json';
    //         const ipResponse = await axios.get(ipApiUrl);
    //         const clientIp = ipResponse.data.ip;

    //         const insertQuery = `
    //             INSERT INTO estimate_cost (
    //                 company_id, service, currency, domain, quantity, quantity_type,
    //                 source_language, target_language, certificate_required, quality,
    //                 ip_address, total_cost, time_stamp
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    //         `;

    //         const insertedIds = [];

    //         for (const estimate of estimates) {
    //             const { target_language, estimatedCost } = estimate;

    //             const result: any = await db.query(insertQuery, [
    //                 company_id,
    //                 service,
    //                 currency,
    //                 domain,
    //                 quantity,
    //                 quantity_type,
    //                 source_language,
    //                 target_language,
    //                 certificate_required,
    //                 quality,
    //                 clientIp,
    //                 estimatedCost
    //             ]);

    //             if (result && result.insertId) {
    //                 insertedIds.push(result.insertId);
    //             } else {
    //                 console.log('Insert failed or no insertId returned', result);
    //             }
    //         }

    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates, insertedIds });
    //     } catch (error) {
    //         return httpError(next, error, req, 500);
    //     }
    // },

    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body
    //     const { company_id } = req.query

    //     if (
    //         !company_id ||
    //         !domain ||
    //         !currency ||
    //         !service ||
    //         !quantity ||
    //         !quantity_type ||
    //         !source_language ||
    //         !Array.isArray(target_language) ||
    //         !target_language.length ||
    //         !quality
    //     ) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.')
    //     }

    //     try {
    //         const estimates = []

    //         // eslint-disable-next-line prefer-const
    //         let pricingTable = 'ansh_usd'
    //         let currencyMultiplier = 1

    //         // Fetch the currency multiplier for currencies other than INR and USD when using `ansh_usd`
    //         if (currency !== 'INR' && (pricingTable !== 'ansh_usd' || currency !== 'USD')) {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [
    //                 currency,
    //                 company_id
    //             ])
    //             if (currencyRows && currencyRows.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`)
    //             }
    //         }

    //         for (const target of target_language) {
    //             let pricingRows: any

    //             // Fetch from `ansh_usd` table
    //             ;[pricingRows] = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             )

    //             // Case 1: No data in `ansh_usd`, fetch from `ansh_ind`
    //             if (!pricingRows || pricingRows.length === 0) {
    //                 ;[pricingRows] = await db.query(
    //                     `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                     [source_language, target, service, company_id]
    //                 )

    //                 // If data exists in `ansh_ind`, handle currency multipliers
    //                 if (pricingRows && pricingRows.length > 0) {
    //                     pricingTable = 'ansh_ind' // Update pricing table reference
    //                     if (currency !== 'INR') {
    //                         // Ensure currency multiplier works for USD when using `ansh_ind`
    //                         const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [
    //                             currency,
    //                             company_id
    //                         ])
    //                         if (currencyRows && currencyRows.length > 0) {
    //                             currencyMultiplier = currencyRows[0].currency_m
    //                         }
    //                     }
    //                 } else {
    //                     return httpResponse(
    //                         req,
    //                         res,
    //                         404,
    //                         `Language pair (${source_language} -> ${target}) or service not found in pricing data for the given company.`
    //                     )
    //                 }
    //             }

    //             const pricing = pricingRows[0]

    //             if (!pricing.price_word || !pricing.price_page) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid or missing pricing data for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }

    //             const priceWord = parseFloat(pricing.price_word)
    //             const pricePage = parseFloat(pricing.price_page)
    //             const minimum = parseFloat(pricing.minimum) || 0
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0

    //             if (isNaN(priceWord) || isNaN(pricePage)) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid pricing values for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }

    //             const [domainRows]: any = await db.query(`SELECT * FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`, [
    //                 domain,
    //                 service,
    //                 company_id
    //             ])
    //             const domainData = domainRows.length ? domainRows[0] : { domain_multiplier: 1.0, add_days: 0 }

    //             const [qualityRows]: any = await db.query(`SELECT * FROM quality WHERE quality = ? AND service = ? AND company_id = ?`, [
    //                 quality,
    //                 service,
    //                 company_id
    //             ])
    //             const qualityData = qualityRows.length ? qualityRows[0] : { add_percentage_cost: 0, add_days: 0 }

    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.')
    //             }

    //             let baseCost = 0
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'minutes') {
    //                     baseCost = priceWord * quantity
    //                 } else if (quantity_type === 'hours') {
    //                     baseCost = pricePage * quantity
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     baseCost = priceWord * quantity
    //                 } else if (quantity_type === 'pages') {
    //                     baseCost = pricePage * quantity
    //                 }
    //             }

    //             if (baseCost < minimum) {
    //                 baseCost = minimum
    //             }

    //             if (certificate_required.toLowerCase() === 'yes') {
    //                 baseCost += certificateCost
    //             }

    //             baseCost *= domainData.domain_multiplier || 1.0
    //             baseCost *= currencyMultiplier // Ensure currency multiplier is applied
    //             baseCost += (baseCost * (qualityData.add_percentage_cost || 0)) / 100

    //             let baseDays = 0

    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 if (quantity_type === 'hours') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.')
    //                     }
    //                 } else if (quantity_type === 'minutes') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.')
    //                     }
    //                 }
    //             } else {
    //                 if (quantity_type === 'words') {
    //                     if (pricing.words_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.words_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing words_per_day for this service.')
    //                     }
    //                 } else if (quantity_type === 'pages') {
    //                     if (pricing.pages_per_day > 0) {
    //                         baseDays = Math.ceil(quantity / pricing.pages_per_day)
    //                     } else {
    //                         return httpResponse(req, res, 400, 'Invalid or missing pages_per_day for this service.')
    //                     }
    //                 }
    //             }

    //             const totalDays = baseDays + domainData.add_days + qualityData.add_days

    //             if (isNaN(baseCost) || isNaN(totalDays)) {
    //                 return httpResponse(req, res, 500, 'Error in cost or time calculation. Please verify pricing data.')
    //             }

    //             const [penaltyRows]: any = await db.query(`SELECT * FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`, [
    //                 service,
    //                 pricing.strength,
    //                 company_id
    //             ])

    //             const [companyRows]: any = await db.query(`SELECT * FROM companies WHERE id = ?`, [company_id])

    //             const penaltyData = penaltyRows.length ? penaltyRows[0] : { penalty_percentage: 0 }
    //             const penaltyPercentage = penaltyData.penalty_percentage

    //             const penaltyMsg = companyRows[0].penalty_msg
    //             const noPenaltyMsg = companyRows[0].no_penalty

    //             const penaltyMessage = penaltyPercentage > 0 ? `${penaltyMsg} :: ${penaltyPercentage}%.` : `${noPenaltyMsg}`

    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} And would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             })
    //         }

    //         const ipApiUrl = 'https://api.ipify.org?format=json'
    //         const ipResponse = await axios.get(ipApiUrl)
    //         const clientIp = ipResponse.data.ip

    //         const insertQuery = `
    //             INSERT INTO estimate_cost (
    //                 company_id, service, currency, domain, quantity, quantity_type, 
    //                 source_language, target_language, certificate_required, quality, 
    //                 ip_address, total_cost, time_stamp
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    //         `

    //         const insertedIds = []

    //         for (const estimate of estimates) {
    //             const { target_language, estimatedCost } = estimate

    //             const result: any = await db.query(insertQuery, [
    //                 company_id,
    //                 service,
    //                 currency,
    //                 domain,
    //                 quantity,
    //                 quantity_type,
    //                 source_language,
    //                 target_language,
    //                 certificate_required,
    //                 quality,
    //                 clientIp,
    //                 estimatedCost
    //             ])

    //             if (result && result.insertId) {
    //                 insertedIds.push(result.insertId)
    //             } else {
    //                 console.log('Insert failed or no insertId returned', result)
    //             }
    //         }

    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates, insertedIds })
    //     } catch (error) {
    //         return httpError(next, error, req, 500)
    //     }
    // },


    // --------------------------------


    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    //     const { company_id } = req.query;
    
    //     if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    //     }
    
    //     try {
    //         const estimates = [];
    //         let pricingTable = 'ansh_usd';
    //         let currencyMultiplier = 1;
    
    //         if (currency !== 'INR' && currency !== 'USD') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
    //             if (currencyRows?.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m;
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
    //             }
    //         }
    
    //         for (const target of target_language) {
    //             let [pricingRows]: any = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             if (!pricingRows?.length) {
    //                 [pricingRows] = await db.query(
    //                     `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                     [source_language, target, service, company_id]
    //                 );
    
    //                 if (!pricingRows?.length) {
    //                     return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
    //                 }
    //             }
    
    //             const pricing = pricingRows[0];
    //             const priceWord = parseFloat(pricing.price_word);
    //             const pricePage = parseFloat(pricing.price_page);
    //             const minimum = parseFloat(pricing.minimum) || 0;
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0;
    
    //             const [domainRows]: any = await db.query(
    //                 `SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`,
    //                 [domain, service, company_id]
    //             );
    //             const domainMultiplier = domainRows?.length ? domainRows[0].domain_multiplier : 1.0;
    //             const domainDays = domainRows?.length ? domainRows[0].add_days : 0;
    
    //             const [qualityRows]: any = await db.query(
    //                 `SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`,
    //                 [quality, service, company_id]
    //             );
    //             const qualityMultiplier = 1 + ((qualityRows?.length ? qualityRows[0].add_percentage_cost : 0) / 100);
    //             const qualityDays = qualityRows?.length ? qualityRows[0].add_days : 0;
    
    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.');
    //             }
    
    //             let baseCost = 0;
    //             if (quantity_type === 'words') baseCost = priceWord * quantity;
    //             else if (quantity_type === 'pages') baseCost = pricePage * quantity;
    
    //             baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
    //             if (certificate_required.toLowerCase() === 'yes') baseCost += certificateCost;
    //             if (baseCost < minimum) baseCost = minimum;
    
    //             let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
    //             const totalDays = baseDays + domainDays + qualityDays;
    
    //             const [penaltyRows]: any = await db.query(
    //                 `SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`,
    //                 [service, pricing.strength, company_id]
    //             );
    //             const penaltyPercentage = penaltyRows?.length ? penaltyRows[0].penalty_percentage : 0;
    
    //             const [companyRows]: any = await db.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
    //             const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;
    
    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             });
    //         }
    
    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates });
    //     } catch (error) {
    //         return httpError(next, error, req, 500);
    //     }
    // },
    

    // -----------------------------------------------------


    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    //     const { company_id } = req.query;
    
    //     if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    //     }
    
    //     try {
    //         const estimates = [];
    //         let currencyMultiplier = 1;
    
    //         if (currency !== 'INR' && currency !== 'USD') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
    //             if (currencyRows?.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m;
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
    //             }
    //         }
    
    //         for (const target of target_language) {
    //             let [pricingUSD]: any = await db.query(
    //                 `SELECT * FROM ansh_usd WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             let [pricingINR]: any = await db.query(
    //                 `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             let pricing = null;
                
    //             if (pricingINR.length && !pricingUSD.length) {
    //                 pricing = pricingINR[0]; // Case 1
    //             } else if (!pricingINR.length && pricingUSD.length) {
    //                 pricing = pricingUSD[0]; // Case 2
    //             } else if (pricingINR.length && pricingUSD.length) {
    //                 pricing = currency === 'INR' ? pricingINR[0] : pricingUSD[0]; // Case 3
    //             } else {
    //                 return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
    //             }
    
    //             const priceWord = parseFloat(pricing.price_word);
    //             const pricePage = parseFloat(pricing.price_page);
    //             const minimum = parseFloat(pricing.minimum) || 0;
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0;
    
    //             const [domainRows]: any = await db.query(
    //                 `SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`,
    //                 [domain, service, company_id]
    //             );
    //             const domainMultiplier = domainRows?.length ? domainRows[0].domain_multiplier : 1.0;
    //             const domainDays = domainRows?.length ? domainRows[0].add_days : 0;
    
    //             const [qualityRows]: any = await db.query(
    //                 `SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`,
    //                 [quality, service, company_id]
    //             );
    //             const qualityMultiplier = 1 + ((qualityRows?.length ? qualityRows[0].add_percentage_cost : 0) / 100);
    //             const qualityDays = qualityRows?.length ? qualityRows[0].add_days : 0;
    
    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.');
    //             }
    
    //             let baseCost = 0;
    //             if (quantity_type === 'words') baseCost = priceWord * quantity;
    //             else if (quantity_type === 'pages') baseCost = pricePage * quantity;
    
    //             baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
    //             if (certificate_required.toLowerCase() === 'yes') baseCost += certificateCost;
    //             if (baseCost < minimum) baseCost = minimum;
    
    //             let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
    //             const totalDays = baseDays + domainDays + qualityDays;
    
    //             const [penaltyRows]: any = await db.query(
    //                 `SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`,
    //                 [service, pricing.strength, company_id]
    //             );
    //             const penaltyPercentage = penaltyRows?.length ? penaltyRows[0].penalty_percentage : 0;
    
    //             const [companyRows]: any = await db.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
    //             const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;
    
    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             });
    //         }
    
    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates });
    //     } catch (error) {
    //         return httpError(next, error, req, 500);
    //     }
    // },    




    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    //     const { company_id } = req.query;
    
    //     if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    //     }
    
    //     try {
    //         const estimates = [];
    //         let currencyMultiplier = 1;
    
    //         if (currency !== 'INR' && currency !== 'USD') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
    //             if (currencyRows?.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m;
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
    //             }
    //         }
    
    //         for (const target of target_language) {
    //             let [pricingUSD]: any = await db.query(
    //                 `SELECT * FROM ansh_usd WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             let [pricingINR]: any = await db.query(
    //                 `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             let pricing = pricingINR.length ? pricingINR[0] : pricingUSD.length ? pricingUSD[0] : null;
    //             if (!pricing) {
    //                 return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
    //             }
    
    //             const priceWord = parseFloat(pricing.price_word) || 0;
    //             const pricePage = parseFloat(pricing.price_page) || 0;
    //             const priceHour = parseFloat(pricing.price_page);
    //             const priceMinute = parseFloat(pricing.price_word);
    //             const minimum = parseFloat(pricing.minimum) || 0;
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0;
    
    //             if (isNaN(priceHour) || isNaN(priceMinute)) {
    //                 return httpResponse(req, res, 400, 'Pricing data for hours or minutes is missing or invalid.');
    //             }
    
    //             const [domainRows]: any = await db.query(
    //                 `SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`,
    //                 [domain, service, company_id]
    //             );
    //             const domainMultiplier = domainRows?.length ? domainRows[0].domain_multiplier : 1.0;
    //             const domainDays = domainRows?.length ? domainRows[0].add_days : 0;
    
    //             const [qualityRows]: any = await db.query(
    //                 `SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`,
    //                 [quality, service, company_id]
    //             );
    //             const qualityMultiplier = 1 + ((qualityRows?.length ? qualityRows[0].add_percentage_cost : 0) / 100);
    //             const qualityDays = qualityRows?.length ? qualityRows[0].add_days : 0;
    
    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.');
    //             }
    
    //             let baseCost = 0;
    //             let adjustedQuantity = quantity;
    //             if (quantity_type === 'words') baseCost = priceWord * quantity;
    //             else if (quantity_type === 'pages') baseCost = pricePage * quantity;
    //             else if (quantity_type === 'hours') {
    //                 adjustedQuantity = Math.max(quantity, 1);
    //                 baseCost = priceHour * adjustedQuantity;
    //             }
    //             else if (quantity_type === 'minutes') {
    //                 adjustedQuantity = Math.max(quantity, 10);
    //                 baseCost = priceMinute * adjustedQuantity;
    //             }
    
    //             baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
    //             if (certificate_required.toLowerCase() === 'yes') baseCost += certificateCost;
    //             if (baseCost < minimum && baseCost > 0) baseCost = minimum;
    
    //             let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
    //             const totalDays = baseDays + domainDays + qualityDays;
    
    //             const [penaltyRows]: any = await db.query(
    //                 `SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`,
    //                 [service, pricing.strength, company_id]
    //             );
    //             const penaltyPercentage = penaltyRows?.length ? penaltyRows[0].penalty_percentage : 0;
    
    //             const [companyRows]: any = await db.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
    //             const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;
    
    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity: adjustedQuantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             });
    //         }
    
    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates });
    //     } catch (error) {
    //         return httpError(next, error, req, 500);
    //     }
    // },


    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    //     const { company_id } = req.query;
    
    //     if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    //     }
    
    //     try {
    //         const estimates = [];
    //         let currencyMultiplier = 1;
    
    //         if (currency !== 'INR' && currency !== 'USD') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
    //             if (currencyRows?.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m;
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
    //             }
    //         }
    
    //         for (const target of target_language) {
    //             let [pricingUSD]: any = await db.query(
    //                 `SELECT * FROM ansh_usd WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             let [pricingINR]: any = await db.query(
    //                 `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             );
    
    //             let pricing = null;
    //             if (currency === 'INR' && pricingINR.length) {
    //                 pricing = pricingINR[0];
    //             } else if (pricingUSD.length) {
    //                 pricing = pricingUSD[0];
    //             } else if (pricingINR.length) {
    //                 pricing = pricingINR[0];
    //             }
    
    //             if (!pricing) {
    //                 return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
    //             }
    
    //             const priceWord = parseFloat(pricing.price_word) || 0;
    //             const pricePage = parseFloat(pricing.price_page) || 0;
    //             const priceHour = parseFloat(pricing.price_page) || 0;
    //             const priceMinute = parseFloat(pricing.price_word) || 0;
    //             const minimum = parseFloat(pricing.minimum) || 0;
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0;
    
    //             const [domainRows]: any = await db.query(
    //                 `SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`,
    //                 [domain, service, company_id]
    //             );
    //             const domainMultiplier = domainRows?.length ? domainRows[0].domain_multiplier : 1.0;
    //             const domainDays = domainRows?.length ? domainRows[0].add_days : 0;
    
    //             const [qualityRows]: any = await db.query(
    //                 `SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`,
    //                 [quality, service, company_id]
    //             );
    //             const qualityMultiplier = 1 + ((qualityRows?.length ? qualityRows[0].add_percentage_cost : 0) / 100);
    //             const qualityDays = qualityRows?.length ? qualityRows[0].add_days : 0;
    
    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.');
    //             }
    
    //             let baseCost = 0;
    //             let adjustedQuantity = quantity;
    //             if (quantity_type === 'words') baseCost = priceWord * quantity;
    //             else if (quantity_type === 'pages') baseCost = pricePage * quantity;
    //             else if (quantity_type === 'hours') {
    //                 adjustedQuantity = Math.max(quantity, 1);
    //                 baseCost = priceHour * adjustedQuantity;
    //             }
    //             else if (quantity_type === 'minutes') {
    //                 adjustedQuantity = Math.max(quantity, 10);
    //                 baseCost = priceMinute * adjustedQuantity;
    //             }
    
    //             baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
    //             if (certificate_required.toLowerCase() === 'yes') baseCost += certificateCost;
    //             if (baseCost < minimum && baseCost > 0) baseCost = minimum;
    
    //             let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
    //             const totalDays = baseDays + domainDays + qualityDays;
    
    //             const [penaltyRows]: any = await db.query(
    //                 `SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`,
    //                 [service, pricing.strength, company_id]
    //             );
    //             const penaltyPercentage = penaltyRows?.length ? penaltyRows[0].penalty_percentage : 0;
    
    //             const [companyRows]: any = await db.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
    //             const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;
    
    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity: adjustedQuantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             });
    //         }
    
    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates });
    //     } catch (error) {
    //         return httpError(next, error, req, 500);
    //     }
    // }, 
    
    
//     estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
//         const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
//         const { company_id } = req.query;
    
//         if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
//             return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
//         }
    
//         try {
//             const estimates = [];
//             let currencyMultiplier = 1;
    
//             if (currency !== 'INR' && currency !== 'USD') {
//                 const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
//                 if (currencyRows?.length > 0) {
//                     currencyMultiplier = currencyRows[0].currency_m;
//                 } else {
//                     return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
//                 }
//             }
    
//             for (const target of target_language) {
//                 let [pricingUSD]: any = await db.query(
//                     `SELECT * FROM ansh_usd WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
//                     [source_language, target, service, company_id]
//                 );
    
//                 let [pricingINR]: any = await db.query(
//                     `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
//                     [source_language, target, service, company_id]
//                 );
    
//                 let pricing = null;
//                 if ((currency === 'INR' || quantity_type === 'hours' || quantity_type === 'minutes') && pricingINR.length) {
//                     pricing = pricingINR[0];
//                 } else if (pricingUSD.length) {
//                     pricing = pricingUSD[0];
//                 } else if (pricingINR.length) {
//                     pricing = pricingINR[0];
//                 }
    
//                 if (!pricing) {
//                     return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
//                 }
    
//                 const priceWord = parseFloat(pricing.price_word) || 0;
//                 const pricePage = parseFloat(pricing.price_page) || 0;
//                 const priceHour = parseFloat(pricing.price_page) || 0;
//                 const priceMinute = parseFloat(pricing.price_word) || 0;
//                 const minimum = parseFloat(pricing.minimum) || 0;
//                 const certificateCost = parseFloat(pricing.certificate_cost) || 0;
    
//                 const [domainRows]: any = await db.query(
//                     `SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`,
//                     [domain, service, company_id]
//                 );
//                 const domainMultiplier = domainRows?.length ? domainRows[0].domain_multiplier : 1.0;
//                 const domainDays = domainRows?.length ? domainRows[0].add_days : 0;
    
//                 const [qualityRows]: any = await db.query(
//                     `SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`,
//                     [quality, service, company_id]
//                 );
//                 const qualityMultiplier = 1 + ((qualityRows?.length ? qualityRows[0].add_percentage_cost : 0) / 100);
//                 const qualityDays = qualityRows?.length ? qualityRows[0].add_days : 0;
    
//                 if (isNaN(quantity) || quantity <= 0) {
//                     return httpResponse(req, res, 400, 'Quantity must be a positive number.');
//                 }
    
//                 let baseCost = 0;
//                 let adjustedQuantity = quantity;
//                 if (quantity_type === 'words') baseCost = priceWord * quantity;
//                 else if (quantity_type === 'pages') baseCost = pricePage * quantity;
//                 else if (quantity_type === 'hours') {
//                     adjustedQuantity = Math.max(quantity, 1);
//                     baseCost = priceHour * adjustedQuantity;
//                 }
//                 else if (quantity_type === 'minutes') {
//                     adjustedQuantity = Math.max(quantity, 10);
//                     baseCost = priceMinute * adjustedQuantity;
//                 }
    
//                 baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
//                 if (certificate_required.toLowerCase() === 'yes') baseCost += certificateCost;
//                 if (baseCost < minimum && baseCost > 0) baseCost = minimum;
    
//                 let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
//                 const totalDays = baseDays + domainDays + qualityDays;
    
//                 const [penaltyRows]: any = await db.query(
//                     `SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`,
//                     [service, pricing.strength, company_id]
//                 );
//                 const penaltyPercentage = penaltyRows?.length ? penaltyRows[0].penalty_percentage : 0;
    
//                 const [companyRows]: any = await db.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
//                 const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;
    
//                 estimates.push({
//                     quality,
//                     currency,
//                     quantity: adjustedQuantity,
//                     quantity_type,
//                     service,
//                     source_language,
//                     target_language: target,
//                     estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
//                     penaltyClause: penaltyMessage,
//                     minimumCostApplied: baseCost === minimum,
//                     estimatedDays: totalDays,
//                     estimatedCost: `${currency} ${baseCost.toFixed(2)}`
//                 });
//             }
    
//             return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates });
//         } catch (error) {
//             return httpError(next, error, req, 500);
//         }
//     }
// ,    



estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body;
    const { company_id } = req.query;

    if (!company_id || !domain || !currency || !service || !quantity || !quantity_type || !source_language || !Array.isArray(target_language) || !target_language.length || !quality) {
        return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.');
    }

    try {
        const estimates = [];
        let currencyMultiplier = 1;

        if (currency !== 'INR' && currency !== 'USD') {
            const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [currency, company_id]);
            if (currencyRows?.length > 0) {
                currencyMultiplier = currencyRows[0].currency_m;
            } else {
                return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`);
            }
        }

        for (const target of target_language) {
            let [pricingUSD]: any = await db.query(
                `SELECT * FROM ansh_usd WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
                [source_language, target, service, company_id]
            );

            let [pricingINR]: any = await db.query(
                `SELECT * FROM ansh_ind WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
                [source_language, target, service, company_id]
            );

            let pricing = null;
            if ((currency === 'INR' || quantity_type === 'hours' || quantity_type === 'minutes') && pricingINR.length) {
                pricing = pricingINR[0];
            } else if (pricingUSD.length) {
                pricing = pricingUSD[0];
            } else if (pricingINR.length) {
                pricing = pricingINR[0];
            }

            if (!pricing) {
                return httpResponse(req, res, 404, `Language pair (${source_language} -> ${target}) or service not found in pricing data.`);
            }

            const priceWord = parseFloat(pricing.price_word) || 0;
            const pricePage = parseFloat(pricing.price_page) || 0;
            const priceHour = parseFloat(pricing.price_page) || 0;
            const priceMinute = parseFloat(pricing.price_word) || 0;
            let minimum = parseFloat(pricing.minimum) || 0;
            let certificateCost = parseFloat(pricing.certificate_cost) || 0;

            const [domainRows]: any = await db.query(
                `SELECT domain_multiplier, add_days FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`,
                [domain, service, company_id]
            );
            const domainMultiplier = domainRows?.length ? domainRows[0].domain_multiplier : 1.0;
            const domainDays = domainRows?.length ? domainRows[0].add_days : 0;

            const [qualityRows]: any = await db.query(
                `SELECT add_percentage_cost, add_days FROM quality WHERE quality = ? AND service = ? AND company_id = ?`,
                [quality, service, company_id]
            );
            const qualityMultiplier = 1 + ((qualityRows?.length ? qualityRows[0].add_percentage_cost : 0) / 100);
            const qualityDays = qualityRows?.length ? qualityRows[0].add_days : 0;

            if (isNaN(quantity) || quantity <= 0) {
                return httpResponse(req, res, 400, 'Quantity must be a positive number.');
            }

            let baseCost = 0;
            let adjustedQuantity = quantity;
            if (quantity_type === 'words') baseCost = priceWord * quantity;
            else if (quantity_type === 'pages') baseCost = pricePage * quantity;
            else if (quantity_type === 'hours') {
                adjustedQuantity = Math.max(quantity, 1);
                baseCost = priceHour * adjustedQuantity;
            }
            else if (quantity_type === 'minutes') {
                adjustedQuantity = Math.max(quantity, 10);
                baseCost = priceMinute * adjustedQuantity;
            }

            baseCost *= domainMultiplier * qualityMultiplier * currencyMultiplier;
            certificateCost *= currencyMultiplier;
            if (certificate_required.toLowerCase() === 'yes') baseCost += certificateCost;
            
            if (baseCost < minimum && baseCost > 0) {
                minimum *= currencyMultiplier;
                baseCost = minimum;
            }

            let baseDays = Math.ceil(quantity / (pricing.words_per_day || 1));
            const totalDays = baseDays + domainDays + qualityDays;

            const [penaltyRows]: any = await db.query(
                `SELECT penalty_percentage FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`,
                [service, pricing.strength, company_id]
            );
            const penaltyPercentage = penaltyRows?.length ? penaltyRows[0].penalty_percentage : 0;

            const [companyRows]: any = await db.query(`SELECT penalty_msg, no_penalty FROM companies WHERE id = ?`, [company_id]);
            const penaltyMessage = penaltyPercentage > 0 ? `${companyRows[0].penalty_msg} :: ${penaltyPercentage}%.` : companyRows[0].no_penalty;

            estimates.push({
                quality,
                currency,
                quantity: adjustedQuantity,
                quantity_type,
                service,
                source_language,
                target_language: target,
                estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} and would take around ${totalDays} Day(s).`,
                penaltyClause: penaltyMessage,
                minimumCostApplied: baseCost === minimum,
                estimatedDays: totalDays,
                estimatedCost: `${currency} ${baseCost.toFixed(2)}`
            });
        }

        return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates });
    } catch (error) {
        return httpError(next, error, req, 500);
    }
},



    // estimateCalculator: async (req: Request, res: Response, next: NextFunction) => {
    //     const { domain, currency, service, quantity, quantity_type, source_language, target_language, certificate_required, quality } = req.body
    //     const { company_id } = req.query
    
    //     if (
    //         !company_id ||
    //         !domain ||
    //         !currency ||
    //         !service ||
    //         !quantity ||
    //         !quantity_type ||
    //         !source_language ||
    //         !Array.isArray(target_language) ||
    //         !target_language.length ||
    //         !quality
    //     ) {
    //         return httpResponse(req, res, 400, 'All fields required, including company_id, must be provided.')
    //     }
    
    //     try {
    //         const estimates = []
    //         // eslint-disable-next-line prefer-const
    //         let pricingTable = currency === 'INR' ? 'ansh_ind' : 'ansh_usd' // FIXED: Set the correct pricing table
    //         let currencyMultiplier = 1
    
    //         if (currency !== 'INR' && currency !== 'USD') {
    //             const [currencyRows]: any = await db.query(`SELECT currency_m FROM currency WHERE currency = ? AND company_id = ?`, [
    //                 currency,
    //                 company_id
    //             ])
    //             if (currencyRows && currencyRows.length > 0) {
    //                 currencyMultiplier = currencyRows[0].currency_m
    //             } else {
    //                 return httpResponse(req, res, 400, `Currency multiplier for ${currency} not found.`)
    //             }
    //         }
    
    //         for (const target of target_language) {
    //             let pricingRows: any
    
    //             // Fetch from the correct pricing table based on currency
    //             // eslint-disable-next-line prefer-const
    //             ;[pricingRows] = await db.query(
    //                 `SELECT * FROM ${pricingTable} WHERE TRIM(source) = ? AND TRIM(target) = ? AND TRIM(service) = ? AND company_id = ?`,
    //                 [source_language, target, service, company_id]
    //             )
    
    //             if (!pricingRows || pricingRows.length === 0) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     404,
    //                     `Language pair (${source_language} -> ${target}) or service not found in pricing data for the given company.`
    //                 )
    //             }
    
    //             const pricing = pricingRows[0]
    
    //             if (!pricing.price_word || !pricing.price_page) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid or missing pricing data for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }
    
    //             const priceWord = parseFloat(pricing.price_word)
    //             const pricePage = parseFloat(pricing.price_page)
    //             const minimum = parseFloat(pricing.minimum) || 0
    //             const certificateCost = parseFloat(pricing.certificate_cost) || 0
    
    //             if (isNaN(priceWord) || isNaN(pricePage)) {
    //                 return httpResponse(
    //                     req,
    //                     res,
    //                     400,
    //                     `Invalid pricing values for source: ${source_language}, target: ${target}, service: ${service}.`
    //                 )
    //             }
    
    //             const [domainRows]: any = await db.query(`SELECT * FROM domain_multiplier WHERE domain = ? AND service = ? AND company_id = ?`, [
    //                 domain,
    //                 service,
    //                 company_id
    //             ])
    //             const domainData = domainRows.length ? domainRows[0] : { domain_multiplier: 1.0, add_days: 0 }
    
    //             const [qualityRows]: any = await db.query(`SELECT * FROM quality WHERE quality = ? AND service = ? AND company_id = ?`, [
    //                 quality,
    //                 service,
    //                 company_id
    //             ])
    //             const qualityData = qualityRows.length ? qualityRows[0] : { add_percentage_cost: 0, add_days: 0 }
    
    //             if (isNaN(quantity) || quantity <= 0) {
    //                 return httpResponse(req, res, 400, 'Quantity must be a positive number.')
    //             }
    
    //             let baseCost = 0
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 baseCost = quantity_type === 'minutes' ? priceWord * quantity : pricePage * quantity
    //             } else {
    //                 baseCost = quantity_type === 'words' ? priceWord * quantity : pricePage * quantity
    //             }
    
    //             if (baseCost < minimum) {
    //                 baseCost = minimum
    //             }
    
    //             if (certificate_required.toLowerCase() === 'yes') {
    //                 baseCost += certificateCost
    //             }
    
    //             baseCost *= domainData.domain_multiplier || 1.0
    //             baseCost *= currencyMultiplier // Apply currency multiplier
    //             baseCost += (baseCost * (qualityData.add_percentage_cost || 0)) / 100
    
    //             let baseDays = 0
    
    //             if (service === 'Subtitling' || service === 'Transcription') {
    //                 baseDays = quantity_type === 'hours' && pricing.pages_per_day > 0 
    //                     ? Math.ceil(quantity / pricing.pages_per_day)
    //                     : Math.ceil(quantity / pricing.words_per_day)
    //             } else {
    //                 baseDays = quantity_type === 'words' && pricing.words_per_day > 0
    //                     ? Math.ceil(quantity / pricing.words_per_day)
    //                     : Math.ceil(quantity / pricing.pages_per_day)
    //             }
    
    //             const totalDays = baseDays + domainData.add_days + qualityData.add_days
    
    //             if (isNaN(baseCost) || isNaN(totalDays)) {
    //                 return httpResponse(req, res, 500, 'Error in cost or time calculation. Please verify pricing data.')
    //             }
    
    //             const [penaltyRows]: any = await db.query(`SELECT * FROM penalty WHERE service = ? AND strength = ? AND company_id = ?`, [
    //                 service,
    //                 pricing.strength,
    //                 company_id
    //             ])
    
    //             const [companyRows]: any = await db.query(`SELECT * FROM companies WHERE id = ?`, [company_id])
    
    //             const penaltyData = penaltyRows.length ? penaltyRows[0] : { penalty_percentage: 0 }
    //             const penaltyMessage = penaltyData.penalty_percentage > 0
    //                 ? `${companyRows[0].penalty_msg} :: ${penaltyData.penalty_percentage}%.`
    //                 : `${companyRows[0].no_penalty}`
    
    //             estimates.push({
    //                 quality,
    //                 currency,
    //                 quantity,
    //                 quantity_type,
    //                 service,
    //                 source_language,
    //                 target_language: target,
    //                 estimatedQuote: `Estimated quote is :: ${currency} ${baseCost.toFixed(2)} And would take around ${totalDays} Day(s).`,
    //                 penaltyClause: penaltyMessage,
    //                 minimumCostApplied: baseCost === minimum,
    //                 estimatedDays: totalDays,
    //                 estimatedCost: `${currency} ${baseCost.toFixed(2)}`
    //             })
    //         }
    
    //         const ipApiUrl = 'https://api.ipify.org?format=json'
    //         const ipResponse = await axios.get(ipApiUrl)
    //         const clientIp = ipResponse.data.ip
    
    //         const insertQuery = `
    //             INSERT INTO estimate_cost (
    //                 company_id, service, currency, domain, quantity, quantity_type, 
    //                 source_language, target_language, certificate_required, quality, 
    //                 ip_address, total_cost, time_stamp
    //             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    //         `
    
    //         const insertedIds = []
    
    //         for (const estimate of estimates) {
    //             const { target_language, estimatedCost } = estimate
    
    //             const result: any = await db.query(insertQuery, [
    //                 company_id,
    //                 service,
    //                 currency,
    //                 domain,
    //                 quantity,
    //                 quantity_type,
    //                 source_language,
    //                 target_language,
    //                 certificate_required,
    //                 quality,
    //                 clientIp,
    //                 estimatedCost
    //             ])
    
    //             if (result && result.insertId) {
    //                 insertedIds.push(result.insertId)
    //             } else {
    //                 console.log('Insert failed or no insertId returned', result)
    //             }
    //         }
    
    //         return httpResponse(req, res, 200, 'Estimates calculated successfully.', { estimates, insertedIds })
    //     } catch (error) {
    //         return httpError(next, error, req, 500)
    //     }
    // },    

    sendEmail: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const quoteReq: QuoteRequest = req.body
        const companyId = req.params.company_id

        try {
            const [result]: any = await db.query('SELECT * FROM companies WHERE id = ?', [companyId])

            if (result.length === 0) {
                return httpError(nextFunc, new Error('Company not found'), req, 404)
            }

            const company = result[0]

            console.log(company.smtp_user, company.smtp_pass)

            const transporter = nodemailer.createTransport({
                host: company.smtp_host,
                port: 465,
                secure: true,
                auth: {
                    user: company.smtp_user,
                    pass: company.smtp_pass
                }
            })

            console.log(quoteReq.estimate, 'Hello Req Req')

            const emailHtml = `
            ${company.email_template}
            <p><strong>Name:</strong> ${quoteReq.name}</p>
            <p><strong>Email:</strong> ${quoteReq.email}</p>
            <h3>Quote Details:</h3>
            <p>${quoteReq.estimate}</p>
            </br>
            </br>
            Thanks & Regards<br />
            ${company.email_signature}
        `

            const mailOptions = {
                from: company.smtp_user,
                to: quoteReq.email,
                cc: company.smtp_user,
                subject: company.email_subject || 'Thanks for requesting a quote',
                html: emailHtml
            }

            // Step 6: Send the email using the transporter
            const info: SentMessageInfo = await transporter.sendMail(mailOptions)

            // Step 7: Respond with success
            httpResponse(req, res, 200, 'Quote email sent successfully', info)
        } catch (err) {
            // console.error('Error:', err); // Log the error for debugging purposes
            httpError(nextFunc, err, req, 500)
        }
    },

    importExcel: async (req: Request, res: Response) => {
        const { company_id } = req.params

        if (!company_id) {
            return httpResponse(req, res, 400, 'Company ID is required')
        }

        if (!req.file) {
            return httpResponse(req, res, 400, 'No file uploaded')
        }

        try {
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
            const sheetName = workbook.SheetNames[0]
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

            if (!sheetData || sheetData.length === 0) {
                return httpResponse(req, res, 400, 'The Excel file is empty')
            }

            const parseNumber = (value: string | number): number => {
                if (typeof value === 'number') {
                    return value // Return the number as is
                }

                if (typeof value === 'string') {
                    // Remove commas and extra spaces, then parse
                    const cleaned = value.replace(/,/g, '').trim()
                    const parsed = parseFloat(cleaned)
                    if (!isNaN(parsed)) {
                        return parsed // Return parsed float value
                    }
                    console.warn(`Invalid number format: "${value}"`)
                }

                return 0 // Default to 0 if parsing fails
            }

            const cleanedData = sheetData.map((row: any) => [
                row.source || '',
                row.target || '',
                parseNumber(row.price_word),
                parseNumber(row.price_page),
                row.service || '',
                parseNumber(row.minimum),
                parseNumber(row.certificate_cost),
                parseNumber(row.words_per_day),
                parseNumber(row.pages_per_day),
                parseNumber(row.strength),
                parseInt(company_id, 10)
            ])

            const connection = await mysql.createConnection({
                host: '173.231.200.72',
                user: 'anshin_costing',
                password: 'zEF5$,f(lQbm',
                database: 'anshin_costing'
            })

            try {
                await connection.beginTransaction()

                // Delete existing data for the company
                await connection.query(`DELETE FROM ansh_ind WHERE company_id = ?`, [parseInt(company_id, 10)])

                // Insert data in batches
                const batchSize = 100
                for (let i = 0; i < cleanedData.length; i += batchSize) {
                    const batch = cleanedData.slice(i, i + batchSize)
                    await connection.query(
                        `INSERT INTO ansh_ind (
                            source, target, price_word, price_page, service, 
                            minimum, certificate_cost, words_per_day, pages_per_day, strength, company_id
                        ) VALUES ?`,
                        [batch]
                    )
                }

                await connection.commit()
                return httpResponse(req, res, 200, 'Data imported successfully')
            } catch (err) {
                await connection.rollback()
                console.error('Error during transaction:', err)
                return httpResponse(req, res, 500, 'Failed to import data')
            } finally {
                await connection.end()
            }
        } catch (err) {
            console.error('Error:', err)
            return httpResponse(req, res, 500, 'Internal Server Error')
        }
    },

    importExcelUSD: async (req: Request, res: Response) => {
        const { company_id } = req.params

        if (!company_id) {
            return httpResponse(req, res, 400, 'Company ID is required')
        }

        if (!req.file) {
            return httpResponse(req, res, 400, 'No file uploaded')
        }

        try {
            // Read and parse the uploaded Excel file
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
            const sheetName = workbook.SheetNames[0]
            const sheetData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

            if (!sheetData || sheetData.length === 0) {
                return httpResponse(req, res, 400, 'The Excel file is empty')
            }

            const parseNumber = (value: string | number): number => {
                if (typeof value === 'number') {
                    return value // Return the number as is
                }

                if (typeof value === 'string') {
                    // Remove commas and extra spaces, then parse
                    const cleaned = value.replace(/,/g, '').trim()
                    const parsed = parseFloat(cleaned)
                    if (!isNaN(parsed)) {
                        return parsed // Return parsed float value
                    }
                    console.warn(`Invalid number format: "${value}"`)
                }

                return 0
            }

            const cleanedData = sheetData.map((row: any) => [
                row.source || '',
                row.target || '',
                parseNumber(row.price_word),
                parseNumber(row.price_page),
                row.service || '',
                parseNumber(row.minimum),
                parseNumber(row.certificate_cost),
                parseNumber(row.words_per_day),
                parseNumber(row.pages_per_day),
                parseNumber(row.strength),
                parseInt(company_id, 10)
            ])

            if (cleanedData.length !== sheetData.length) {
                console.error('Mismatch in data length: Cleaned data is incomplete.')
                return httpResponse(req, res, 400, 'Data cleaning error: Incomplete data.')
            }

            // MySQL connection setup
            const connection = await mysql.createConnection({
                host: '173.231.200.72',
                user: 'anshin_costing',
                password: 'zEF5$,f(lQbm',
                database: 'anshin_costing'
            })

            try {
                await connection.beginTransaction()

                // Delete existing data for the company
                await connection.query(`DELETE FROM ansh_usd WHERE company_id = ?`, [parseInt(company_id, 10)])

                // Insert data in batches
                const batchSize = 100
                for (let i = 0; i < cleanedData.length; i += batchSize) {
                    const batch = cleanedData.slice(i, i + batchSize)
                    await connection.query(
                        `INSERT INTO ansh_usd (
                        source, target, price_word, price_page, service, 
                        minimum, certificate_cost, words_per_day, pages_per_day, strength, company_id
                    ) VALUES ?`,
                        [batch]
                    )
                }

                await connection.commit()
                return httpResponse(req, res, 200, 'Data imported successfully')
            } catch (err) {
                await connection.rollback()
                console.error('Error during transaction:', err)
                return httpResponse(req, res, 500, 'Failed to import data')
            } finally {
                await connection.end()
            }
        } catch (err) {
            console.error('Error:', err)
            return httpResponse(req, res, 500, 'Internal Server Error')
        }
    },

    importExcelDomainMultiplier: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { company_id } = req.params

            // Validate inputs
            if (!company_id) {
                return httpResponse(req, res, 400, 'Company ID is required')
            }

            if (!req.file) {
                return httpResponse(req, res, 400, 'No file uploaded')
            }

            // Read the Excel file
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
            const sheetName = workbook.SheetNames[0]
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

            if (!sheetData || sheetData.length === 0) {
                return httpResponse(req, res, 400, 'The Excel file is empty')
            }

            try {
                // Remove existing records for the company
                await db.query(`DELETE FROM domain_multiplier WHERE company_id = ?`, [parseInt(company_id)])

                // Insert new records
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const insertPromises = sheetData.map(async (row: any) => {
                    const { domain = '', domain_multiplier = '0', add_days = '0', service = '' } = row

                    await db.query(
                        `INSERT INTO domain_multiplier (
                            domain, domain_multiplier, add_days, service, company_id
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [
                            domain.toString(), // Ensure domain is a string
                            domain_multiplier.toString(), // Ensure domain_multiplier is a string
                            add_days.toString(), // Ensure add_days is a string
                            service.toString(), // Ensure service is a string
                            parseInt(company_id) // Include company_id as an integer
                        ]
                    )
                })

                await Promise.all(insertPromises)

                // Return success response
                httpResponse(req, res, 200, 'Data imported successfully')
            } catch (err) {
                throw err // Propagate error to global handler
            }
        } catch (err) {
            // Handle global errors
            httpError(nextFunc, err, req, 500)
        }
    },

    importExcelPenalty: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { company_id } = req.params

            // Validate inputs
            if (!company_id) {
                return httpResponse(req, res, 400, 'Company ID is required')
            }

            if (!req.file) {
                return httpResponse(req, res, 400, 'No file uploaded')
            }

            // Read the Excel file
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
            const sheetName = workbook.SheetNames[0]
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

            if (!sheetData || sheetData.length === 0) {
                return httpResponse(req, res, 400, 'The Excel file is empty')
            }

            try {
                // Remove existing records for the company
                await db.query(`DELETE FROM penalty WHERE company_id = ?`, [parseInt(company_id)])

                // Insert new records
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const insertPromises = sheetData.map(async (row: any) => {
                    const { service = '', strength = '', penalty_percentage = '0' } = row

                    await db.query(
                        `INSERT INTO penalty (
                            service, strength, penalty_percentage, company_id
                        ) VALUES (?, ?, ?, ?)`,
                        [
                            service.toString(), // Ensure service is a string
                            strength.toString(), // Ensure strength is a string
                            penalty_percentage.toString(), // Ensure penalty_percentage is a string
                            parseInt(company_id) // Include company_id as an integer
                        ]
                    )
                })

                await Promise.all(insertPromises)

                // Return success response
                httpResponse(req, res, 200, 'Penalty data imported successfully')
            } catch (err) {
                throw err // Propagate error to global handler
            }
        } catch (err) {
            // Handle global errors
            httpError(nextFunc, err, req, 500)
        }
    },

    importExcelQuality: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { company_id } = req.params

            // Validate inputs
            if (!company_id) {
                return httpResponse(req, res, 400, 'Company ID is required')
            }

            if (!req.file) {
                return httpResponse(req, res, 400, 'No file uploaded')
            }

            // Read the Excel file
            const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
            const sheetName = workbook.SheetNames[0]
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

            if (!sheetData || sheetData.length === 0) {
                return httpResponse(req, res, 400, 'The Excel file is empty')
            }

            try {
                // Remove existing records for the company
                await db.query(`DELETE FROM quality WHERE company_id = ?`, [parseInt(company_id)])

                // Insert new records
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const insertPromises = sheetData.map(async (row: any) => {
                    const { quality = '', service = '', add_percentage_cost = '0', add_days = '0' } = row

                    await db.query(
                        `INSERT INTO quality (
                            quality, service, add_percentage_cost, add_days, company_id
                        ) VALUES (?, ?, ?, ?, ?)`,
                        [
                            quality.toString(), // Ensure quality is a string
                            service.toString(), // Ensure service is a string
                            add_percentage_cost.toString(), // Ensure add_percentage_cost is a string
                            add_days.toString(), // Ensure add_days is a string
                            parseInt(company_id) // Include company_id as an integer
                        ]
                    )
                })

                await Promise.all(insertPromises)

                // Return success response
                httpResponse(req, res, 200, 'Quality data imported successfully')
            } catch (err) {
                throw err // Propagate error to global handler
            }
        } catch (err) {
            // Handle global errors
            httpError(nextFunc, err, req, 500)
        }
    },

    // importExcelCurrency: async (req: Request, res: Response, nextFunc: NextFunction) => {
    //     try {
    //         const { company_id } = req.params

    //         // Validate inputs
    //         if (!company_id) {
    //             return httpResponse(req, res, 400, 'Company ID is required')
    //         }

    //         if (!req.file) {
    //             return httpResponse(req, res, 400, 'No file uploaded')
    //         }

    //         // Read the Excel file
    //         const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
    //         const sheetName = workbook.SheetNames[0]
    //         const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

    //         if (!sheetData || sheetData.length === 0) {
    //             return httpResponse(req, res, 400, 'The Excel file is empty')
    //         }

    //         try {
    //             // Remove existing records for the company
    //             await db.query(`DELETE FROM currency WHERE company_id = ?`, [parseInt(company_id)])

    //             // Insert new records
    //             // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //             const insertPromises = sheetData.map(async (row: any) => {
    //                 const {
    //                     id = '',
    //                     currency = '',
    //                     currency_m = '0' // Default value for currency_m
    //                 } = row

    //                 await db.query(
    //                     `INSERT INTO currency (
    //                         id, currency, currency_m, company_id
    //                     ) VALUES (?, ?, ?, ?)`,
    //                     [
    //                         id.toString(), // Ensure id is a string
    //                         currency.toString(), // Ensure currency is a string
    //                         currency_m.toString(), // Ensure currency_m is a string
    //                         parseInt(company_id) // company_id as an integer
    //                     ]
    //                 )
    //             })

    //             await Promise.all(insertPromises)

    //             // Return success response
    //             httpResponse(req, res, 200, 'Currency data imported successfully')
    //         } catch (err) {
    //             throw err
    //         }
    //     } catch (err) {
    //         httpError(nextFunc, err, req, 500)
    //     }
    // },

    importExcelCurrency: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { company_id } = req.params

            // Validate inputs
            if (!company_id) {
                return httpResponse(req, res, 400, 'Company ID is required')
            }

            if (!req.file) {
                return httpResponse(req, res, 400, 'No file uploaded')
            }

            try {
                // Read and parse the uploaded Excel file
                const workbook = XLSX.read(req.file.buffer, { type: 'buffer' })
                const sheetName = workbook.SheetNames[0]
                const sheetData: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName])

                if (!sheetData || sheetData.length === 0) {
                    return httpResponse(req, res, 400, 'The Excel file is empty')
                }

                // Helper to parse numeric values
                const parseNumber = (value: string | number): number => {
                    if (typeof value === 'string') {
                        const cleaned = value.replace(/,/g, '').trim() // Remove commas and trim spaces
                        const parsed = parseFloat(cleaned)
                        if (isNaN(parsed)) {
                            console.warn(`Invalid number format: "${value}"`)
                            return 0 // Return 0 if parsing fails
                        }
                        return parsed
                    }
                    return typeof value === 'number' ? value : 0 // Return the number or 0
                }

                // Clean data for database insertion
                const cleanedData = sheetData.map((row: any) => [
                    row.id || '',
                    row.currency || '',
                    parseNumber(row.currency_m || '0'), // Ensure numeric format for currency_m
                    parseInt(company_id, 10)
                ])

                // MySQL connection setup
                const connection = await mysql.createConnection({
                    host: '173.231.200.72',
                    user: 'anshin_costing',
                    password: 'zEF5$,f(lQbm',
                    database: 'anshin_costing'
                })

                try {
                    await connection.beginTransaction()

                    // Delete existing data for the company
                    await connection.query(`DELETE FROM currency WHERE company_id = ?`, [parseInt(company_id, 10)])

                    // Insert data in batches
                    const batchSize = 100
                    for (let i = 0; i < cleanedData.length; i += batchSize) {
                        const batch = cleanedData.slice(i, i + batchSize)
                        await connection.query(
                            `INSERT INTO currency (
                                id, currency, currency_m, company_id
                            ) VALUES ?`,
                            [batch]
                        )
                    }

                    await connection.commit()
                    return httpResponse(req, res, 200, 'Currency data imported successfully')
                } catch (err) {
                    await connection.rollback()
                    console.error('Error during transaction:', err)
                    return httpResponse(req, res, 500, 'Failed to import currency data')
                } finally {
                    await connection.end()
                }
            } catch (err) {
                console.error('Error:', err)
                return httpResponse(req, res, 500, 'Internal Server Error')
            }
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    deleteCompanyById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [deleteResult]: any = await db.query('DELETE FROM ansh_ind WHERE id = ?', [id])

            if (deleteResult.affectedRows === 0) {
                return httpResponse(req, res, 404, 'Company not found.')
            }
            httpResponse(req, res, 200, 'Row deleted successfully.')
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },

    getAllEstimates: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const { company_id } = req.query
        try {
            const [rows] = await db.query('SELECT * FROM estimate_cost WHERE company_id = ?', company_id)
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAllUsers: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [countResult]: any = await db.query('SELECT COUNT(*) AS total FROM users')

            const total = countResult[0].total

            httpResponse(req, res, 200, responseMessage.SUCCESS, { total })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAllCompanies: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [countResult]: any = await db.query('SELECT COUNT(*) AS total FROM companies')

            const total = countResult[0].total

            httpResponse(req, res, 200, responseMessage.SUCCESS, { total })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAllReports: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [countResult]: any = await db.query('SELECT COUNT(*) AS total FROM estimate_cost')

            const total = countResult[0].total

            httpResponse(req, res, 200, responseMessage.SUCCESS, { total })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getAllServices: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            // Query to count unique services
            const [rows]: any = await db.query('SELECT COUNT(*) AS totalServices FROM ansh_ind')

            const totalServices = rows[0]?.service || 0

            // Respond with the total number of unique services
            httpResponse(req, res, 200, 'Total unique services fetched successfully.', { totalServices })
        } catch (err) {
            // Handle any errors
            httpError(nextFunc, err, req, 500)
        }
    }
}
