interface SendProfessorCredentialsEmailParams {
    recipientEmail: string;
    recipientName: string;
    login: string;
    temporaryPassword: string;
    resetLink: string;
}
export declare class MailService {
    static sendProfessorCredentialsEmail({ recipientEmail, recipientName, login, temporaryPassword, resetLink, }: SendProfessorCredentialsEmailParams): Promise<void>;
}
export {};
//# sourceMappingURL=MailService.d.ts.map