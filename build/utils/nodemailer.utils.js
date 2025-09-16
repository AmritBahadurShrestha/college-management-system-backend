"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const error_handler_middleware_1 = __importDefault(require("../middlewares/error-handler.middleware"));
// Creating Transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465 ? true : false,
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendEmail = (_a) => __awaiter(void 0, [_a], void 0, function* ({ to, subject, html, cc = null, bcc = null, attachments = null, }) {
    try {
        let message = {
            from: `College Management System-ADMIN <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        };
        if (cc) {
            message['cc'] = cc;
        }
        if (bcc) {
            message['bcc'] = bcc;
        }
        if (attachments) {
            message['attachments'] = attachments;
        }
        yield transporter.sendMail(message);
    }
    catch (error) {
        throw new error_handler_middleware_1.default('Sending email error', 500);
    }
});
exports.sendEmail = sendEmail;
