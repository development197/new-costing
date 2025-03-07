export type THTTPResponse = {
    success: boolean
    status: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THTTPError = {
    success: boolean
    status: number
    request: {
        ip?: string | null
        method: string
        url: string
    }
    message: string
    data: unknown
    trace?: object | null
}


// ------------------


export interface LanguageData {
    price_word: number;
    price_page: number;
    minimum: number;
    certificate_cost: number;
    words_per_day: number;
    pages_per_day: number;
    strength: number;
}

export interface DomainData {
    domain_multiplier: number;
    add_days: number;
}

export interface QualityData {
    add_percentage_cost: number;
    add_days: number;
}

export interface PenaltyData {
    penalty_percentage: number;
}

export interface EstimateRequest {
    domain: string;
    currency: string;
    service: string;
    quantity: number;
    quantity_type: 'words' | 'pages';
    source_language: string;
    target_language: string[];
    certificate_required: 'yes' | 'no';
    quality: string;
    name: string;
    email: string;
}



export interface Company {
    company_name: string;
    email: string;
    phone?: string; // Optional field
    logo: string;   // URL to the logo uploaded to Cloudinary
    banner: string; // String field for banner
    mail_service: string;
    smtp_host: string;
    smtp_port: number;
    smtp_user: string;
    smtp_pass: string;
    status?: string;            // Optional: Status (e.g., active, inactive)
    email_subject?: string;     // Optional: Subject for emails
    email_signature?: string;   // Optional: Text or HTML email signature
    email_template: string;     // Template string
    form_header?: string;       // Optional: Form header text
    form_footer?: string; 
    app_name: string;
    url: string;
    bg_color: string;
    btn_color: string;
    penalty_msg: string;
    no_penalty: string;
}


export interface User {
    name: string;
    email: string;
    password: string;
    role: string;
}