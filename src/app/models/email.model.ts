export interface Email {
    to: string;
    cc?: string;
    attachments?: string[];
    subject: string;
    body?: string;
    isHtml?: boolean
}