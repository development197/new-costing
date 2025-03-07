/* eslint-disable @typescript-eslint/prefer-promise-reject-errors */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextFunction, Request, Response } from 'express'
import httpResponse from '../util/httpResponse'
// import responseMessage from '../constants/responseMessage'
import cloudinary from '../services/cloudinaryService'
import db from '../config/mysqlConnection'
import { Company } from '../types/types'
import responseMessage from '../constants/responseMessage'
import httpError from '../util/httpError'

export default {
    // createCompanies: async (req: Request, res: Response) => {
    //     const company: Company = req.body

    //     // Validate required fields
    //     if (!company.app_name) {
    //         return httpResponse(req, res, 400, 'App name is required!')
    //     }

    //     if (!company.company_name) {
    //         return httpResponse(req, res, 400, 'Company name is required!')
    //     }

    //     try {
    //         const [existingCompany]: any = await db.query('SELECT app_name FROM companies WHERE app_name = ?', [company.app_name])

    
    //         if (existingCompany && existingCompany.length > 0) {
    //             return httpResponse(req, res, 401, 'App name must be unique.')
    //         }

    //         const uploadPromise = new Promise((resolve, reject) => {
    //             cloudinary.uploader
    //                 .upload_stream({ folder: 'company_logos', resource_type: 'auto' }, (error, result) => {
    //                     // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    //                     if (error) reject(error)
    //                     else resolve(result)
    //                 })
    //                 .end(req.file?.buffer)
    //         })

    //         const imageResult: any = await uploadPromise
    //         const logoUrl = imageResult?.secure_url

    //         await db.query(
    //             `INSERT INTO companies 
    //             (company_name, app_name, email, phone, logo, banner,mail_service, smtp_host, smtp_port, smtp_user, smtp_pass, status, email_subject, email_signature, email_template, form_header, form_footer, url, bg_color, btn_color, penalty_msg, no_penalty) 
    //             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    //             [
    //                 company.company_name,
    //                 company.app_name,
    //                 company.email,
    //                 company.phone,
    //                 logoUrl || null,
    //                 company.banner,
    //                 'gmail',
    //                 company.smtp_host,
    //                 company.smtp_port,
    //                 company.smtp_user,
    //                 company.smtp_pass,
    //                 company.status || 'active',
    //                 company.email_subject || null,
    //                 company.email_signature || null,
    //                 company.email_template || null,
    //                 company.form_header || null,
    //                 company.form_footer || null,
    //                 company.url || null,
    //                 company.bg_color || null,
    //                 company.btn_color || null,
    //                 company.penalty_msg || null,
    //                 company.no_penalty || null
    //             ]
    //         )

    //         return httpResponse(req, res, 201, 'Company Created', { CompanyName: company.company_name })
    //     } catch (err) {
    //         // eslint-disable-next-line no-console
    //         console.error('Error creating company:', err)
    //         return httpResponse(req, res, 500, 'Server Error')
    //     }
    // },

    createCompanies: async (req: Request, res: Response) => {
        const company: Company = req.body;
    
        // Validate required fields
        if (!company.app_name) {
            return httpResponse(req, res, 400, 'App name is required!');
        }
    
        if (!company.company_name) {
            return httpResponse(req, res, 400, 'Company name is required!');
        }
    
        try {
            const [existingCompany]: any = await db.query('SELECT app_name FROM companies WHERE app_name = ?', [company.app_name]);
    
            if (existingCompany && existingCompany.length > 0) {
                return httpResponse(req, res, 401, 'App name must be unique.');
            }
    
            // Define a dummy file URL for the logo if no file is uploaded
            let logoUrl = 'https://dummyimage.com/200x200/cccccc/000000&text=Default+Logo';
    
            // Check if a file was uploaded
            if (req.file) {
                const uploadPromise = new Promise((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ folder: 'company_logos', resource_type: 'auto' }, (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        })
                        .end(req.file?.buffer);
                });
    
                const imageResult: any = await uploadPromise;
                logoUrl = imageResult?.secure_url || logoUrl; // Fallback to dummy URL if upload fails
            }
    
            // Insert into the database
            await db.query(
                `INSERT INTO companies 
                (company_name, app_name, email, phone, logo, banner, mail_service, smtp_host, smtp_port, smtp_user, smtp_pass, status, email_subject, email_signature, email_template, form_header, form_footer, url, bg_color, btn_color, penalty_msg, no_penalty) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    company.company_name,
                    company.app_name,
                    company.email,
                    company.phone,
                    logoUrl, // Use the logoUrl here
                    company.banner,
                    'gmail',
                    company.smtp_host,
                    company.smtp_port,
                    company.smtp_user,
                    company.smtp_pass,
                    company.status || 'active',
                    company.email_subject || null,
                    company.email_signature || null,
                    company.email_template || null,
                    company.form_header || null,
                    company.form_footer || null,
                    company.url || null,
                    company.bg_color || null,
                    company.btn_color || null,
                    company.penalty_msg || null,
                    company.no_penalty || null
                ]
            );
    
            return httpResponse(req, res, 201, 'Company Created', { CompanyName: company.company_name });
        } catch (err) {
            console.error('Error creating company:', err);
            return httpResponse(req, res, 500, 'Server Error');
        }
    },

    getAllCompanies: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const [rows] = await db.query('SELECT * FROM companies')
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    getCompanyById: async (req: Request, res: Response, nextFunc: NextFunction) => {
        try {
            const { companyId } = req.params

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [results]: any = await db.query('SELECT * FROM companies WHERE id = ?', [companyId])

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (results.length === 0) {
                return httpResponse(req, res, 404, 'Company not found.')
            }

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            httpResponse(req, res, 200, 'Company found', { company: results[0] })
        } catch (err) {
            httpError(nextFunc, err, req, 500)
        }
    },

    deleteCompanyById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { companyId } = req.params

            // Fetch the company to check if it exists
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [results]: any = await db.query('SELECT logo FROM companies WHERE id = ?', [companyId])

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (results.length === 0) {
                return httpResponse(req, res, 404, 'Company not found.')
            }

            // If the company has a logo, delete it from Cloudinary
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            const logoUrl = results[0].logo
            if (logoUrl) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                const publicId = logoUrl.split('/').pop()?.split('.')[0]
                if (publicId) {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
                    await cloudinary.uploader.destroy(publicId)
                }
            }

            // Delete the company from the database
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [deleteResult]: any = await db.query('DELETE FROM companies WHERE id = ?', [companyId])

            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (deleteResult.affectedRows === 0) {
                return httpResponse(req, res, 404, 'Company not found.')
            }

            // Return success response
            httpResponse(req, res, 200, 'Company deleted successfully.')
        } catch (err) {
            httpError(next, err, req, 500)
        }
    },

    // updateCompanyById: async (req: Request, res: Response, next: NextFunction) => {
    //     try {
    //         const { companyId } = req.params
    //         const company: Company = req.body

    //         // Validate required fields
    //         if (!company.company_name || !company.email) {
    //             return httpResponse(req, res, 400, 'All fields are required.')
    //         }

    //         // Get the existing company data before updating
    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         const [existingCompany]: any = await db.query('SELECT * FROM companies WHERE id = ?', [companyId])

    //         // If company doesn't exist, return 404
    //         if (!existingCompany) {
    //             return httpResponse(req, res, 404, 'Company not found.')
    //         }

    //         // Handle logo upload (only if new logo is provided)
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //         let logoUrl: string | null = existingCompany.logo // Keep the existing logo if not provided
    //         if (req.file) {
    //             const imageResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
    //                 cloudinary.uploader
    //                     .upload_stream({ folder: 'company_logos', resource_type: 'auto' }, (error, result) => {
    //                         if (error) {
    //                             // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    //                             reject(error)
    //                         }
    //                         if (result) {
    //                             resolve(result as { secure_url: string })
    //                         }
    //                     })
    //                     .end(req.file?.buffer)
    //             })

    //             logoUrl = imageResult.secure_url // Update with the new logo URL
    //         }

    //         // Update company details in MySQL (keeping the old logo if no new file)
    //         const query = `
    //           UPDATE companies
    //           SET company_name = ?, app_name = ?, email = ?, phone = ?, logo = ?, banner = ?, mail_service = ?, smtp_host = ?, smtp_port = ?, smtp_user = ?, smtp_pass = ?, status = ?, email_subject = ?, email_signature = ?, email_template = ?, form_header = ?, form_footer = ?, url = ?, bg_color = ?, btn_color = ?, penalty_msg = ?, no_penalty = ?
    //           WHERE id = ?
    //       `

    //         // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //         const [result]: any = await db.query(query, [
    //             company.company_name,
    //             company.app_name,
    //             company.email,
    //             company.phone,
    //             logoUrl, // Updated logo or existing one
    //             company.banner,
    //             company.mail_service,
    //             company.smtp_host,
    //             company.smtp_port,
    //             company.smtp_user,
    //             company.smtp_pass,
    //             company.status || 'active', // Default value for status if not provided
    //             company.email_subject || null,
    //             company.email_signature || null,
    //             company.email_template || null,
    //             company.form_header || null,
    //             company.form_footer || null,
    //             company.url || null,
    //             company.bg_color || null,
    //             company.btn_color || null,
    //             company.penalty_msg || null,
    //             company.no_penalty || null,
    //             companyId
    //         ])

    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    //         if (result.affectedRows === 0) {
    //             return httpResponse(req, res, 404, 'Company not found.')
    //         }

    //         // Return success response
    //         httpResponse(req, res, 200, 'Company updated successfully.')
    //     } catch (err) {
    //         httpError(next, err, req, 500)
    //     }
    // },


    updateCompanyById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { companyId } = req.params; // Extract company ID from params
            const company: Company = req.body; // Extract company details from request body

            console.log(company);
            
    
            // Validate required fields
            if (!company.company_name || !company.email) {
                return httpResponse(req, res, 400, 'All fields are required.');
            }
    
            // Get the existing company data before updating
            const [existingCompanies]: any = await db.query('SELECT * FROM companies WHERE id = ?', [companyId]);
    
            if (!existingCompanies || existingCompanies.length === 0) {
                return httpResponse(req, res, 404, 'Company not found.');
            }
    
            const existingCompany = existingCompanies[0]; // First company record
    
            // Handle logo upload (only if new logo is provided)
            let logoUrl: string | null = existingCompany.logo; // Keep the existing logo if no new one is provided
            if (req.file) {
                const imageResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream({ folder: 'company_logos', resource_type: 'auto' }, (error, result) => {
                            // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
                            if (error) reject(error);
                            if (result) resolve(result as { secure_url: string });
                        })
                        .end(req.file?.buffer);
                });
    
                logoUrl = imageResult.secure_url; // Update with the new logo URL
            }
    
            // Debugging incoming data
            // console.log('Incoming Data:', {
            //     bg_color: company.bg_color,
            //     btn_color: company.btn_color,
            // });
    
            // Update company details in MySQL
            const query = `
              UPDATE companies
              SET 
                  company_name = ?, 
                  app_name = ?, 
                  email = ?, 
                  phone = ?, 
                  logo = ?, 
                  banner = ?, 
                  mail_service = ?, 
                  smtp_host = ?, 
                  smtp_port = ?, 
                  smtp_user = ?, 
                  smtp_pass = ?, 
                  status = ?, 
                  email_subject = ?, 
                  email_signature = ?, 
                  email_template = ?, 
                  form_header = ?, 
                  form_footer = ?, 
                  url = ?, 
                  bg_color = ?, 
                  btn_color = ?, 
                  penalty_msg = ?, 
                  no_penalty = ?
              WHERE id = ?
            `;
    
            // Values for the query
            const queryValues = [
                company.company_name,
                company.app_name,
                company.email,
                company.phone,
                logoUrl, // Updated logo or existing one
                company.banner,
                'gmail',
                company.smtp_host,
                company.smtp_port,
                company.smtp_user,
                company.smtp_pass,
                company.status || 'active', // Default value for status if not provided
                company.email_subject || null,
                company.email_signature || null,
                company.email_template || null,
                company.form_header || null,
                company.form_footer || null,
                company.url || null,
                company.bg_color || null, // Use null if not provided
                company.btn_color || null, // Use null if not provided
                company.penalty_msg || null,
                company.no_penalty || null,
                companyId,
            ];
    // Debug query values
    
            // Execute the update query
            const [result]: any = await db.query(query, queryValues);
    
            if (result.affectedRows === 0) {
                return httpResponse(req, res, 404, 'Company not found.');
            }
    
            // Return success response
            httpResponse(req, res, 200, 'Company updated successfully.');
        } catch (err) {// Log the error
            httpError(next, err, req, 500); // Send error response
        }
    },    

    //   getCompanyByApp: async (req: Request, res: Response, nextFunc: NextFunction) => {
    //     const app_name = req.params.app_name;
    //     try {
    //         const [rows] = await db.query('SELECT * FROM companies WHERE LOWER(app_name) = LOWER(?)', [app_name])
    //         httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
    //     } catch (err) {
    //         httpError(nextFunc, err, req, 500)
    //     }
    // },

    getCompanyByApp: async (req: Request, res: Response, nextFunc: NextFunction) => {
        const app_name = req.params.app_name
        // eslint-disable-next-line no-console
        console.log('Received app_name:', app_name) // Check if the parameter is being captured correctly
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [rows]: any = await db.query('SELECT * FROM companies WHERE app_name = ?', [app_name])
            // Log the result from the database
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            if (rows.length === 0) {
                return httpResponse(req, res, 404, 'No companies found for this app_name')
            }
            httpResponse(req, res, 200, responseMessage.SUCCESS, rows)
        } catch (err) {
            // console.error('Database Error:', err);
            httpError(nextFunc, err, req, 500)
        }
    }
}
