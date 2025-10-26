"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendPurchaseReceipt = exports.SendPurchaseReceiptDto = void 0;
const class_validator_1 = require("class-validator");
class SendPurchaseReceiptDto {
    email;
    name;
    productName;
    vendorName;
    quantity;
    unitNairaPrice;
    unitArianPrice;
    totalNairaPrice;
    totalArianPrice;
    trxFeeNaira;
    trxFeeArian;
    totalNaira;
    totalArian;
}
exports.SendPurchaseReceiptDto = SendPurchaseReceiptDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SendPurchaseReceiptDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendPurchaseReceiptDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendPurchaseReceiptDto.prototype, "productName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendPurchaseReceiptDto.prototype, "vendorName", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "unitNairaPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "unitArianPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "totalNairaPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "totalArianPrice", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "trxFeeNaira", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "trxFeeArian", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "totalNaira", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SendPurchaseReceiptDto.prototype, "totalArian", void 0);
class SendPurchaseReceipt {
    email;
    name;
    productName;
    format;
    productPrice;
    vendorName;
    quantity;
    unitNairaPrice;
    unitArianPrice;
    totalNairaPrice;
    totalArianPrice;
    trxFeeNaira;
    trxFeeArian;
    totalNaira;
    totalArian;
    totalProducts;
    totalSales;
}
exports.SendPurchaseReceipt = SendPurchaseReceipt;
//# sourceMappingURL=mail.types.js.map