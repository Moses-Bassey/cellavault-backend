"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailModule = void 0;
const common_1 = require("@nestjs/common");
const mailer_1 = require("@nestjs-modules/mailer");
const event_emitter_1 = require("@nestjs/event-emitter");
const mail_service_1 = require("./mail.service");
const email_event_service_1 = require("./email-event.service");
const email_listener_1 = require("./listeners/email.listener");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const path_1 = require("path");
const config_1 = require("@nestjs/config");
let MailModule = class MailModule {
};
exports.MailModule = MailModule;
exports.MailModule = MailModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [],
        providers: [mail_service_1.MailService, email_event_service_1.EmailEventService, email_listener_1.EmailEventListener],
        exports: [mail_service_1.MailService, email_event_service_1.EmailEventService],
        imports: [
            event_emitter_1.EventEmitterModule.forRoot(),
            mailer_1.MailerModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    transport: {
                        host: configService.get('app.emailHost'),
                        port: +(configService.get('app.emailPort') || 587),
                        secure: true,
                        ignoreTLS: false,
                        auth: {
                            user: configService.get('app.emailId'),
                            pass: configService.get('app.emailPass'),
                        },
                    },
                    defaults: {
                        from: configService.get('app.emailFrom'),
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, './templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: false,
                        },
                    },
                }),
            }),
        ],
    })
], MailModule);
//# sourceMappingURL=mail.module.js.map