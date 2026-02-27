// import { BadRequestException, Logger } from '@nestjs/common';
// import axios from 'axios';
// import { config } from 'dotenv';

// config();

// const BasicAuth = Buffer.from(
//   `${process.env.MONIFY_API_KEY}:${process.env.MONIFY_API_SECRET}`,
// ).toString('base64');

// const monifyAPIRequest = axios.create({
//   baseURL: process.env.MONIFY_API_BASE_URL,
// });

// export class monifyAPI {
//   static async authenticate() {
//     const errorMessage =
//       'could not carry out transaction please try again later';
//     try {
//       const { data } = await monifyAPIRequest.post('/v1/auth/login', null, {
//         headers: {
//           Authorization: `Basic ${BasicAuth}`,
//         },
//       });
//       if (!data || !data.responseBody || !data.responseBody.accessToken) {
//         return Promise.reject(errorMessage);
//       }

//       return data.responseBody.accessToken;
//     } catch (e) {
//       return Promise.reject(errorMessage);
//     }
//   }

//   static async fetchBanks() {
//     const url = `${process.env.MONIFY_API_BASE_URL}/v1/banks`;
//     const headers = {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${await this.authenticate()}`,
//     };

//     try {
//       const response = await axios.get(url, { headers });
//       return response.data;
//     } catch (error) {
//       throw new BadRequestException(error);
//     }
//   }

//   /**
//    * checks if an account number is a valid NUBAN, get the account name if valid
//    * @param {Object} params
//    * @param {string} params.bankCode
//    * @param {string} params.accountNumber
//    * @returns
//    */
//   static async validateAccount({ bankCode, accountNumber }) {
//     const errorMessage = 'Could not verify account';

//     const url = `${process.env.MONIFY_API_BASE_URL}/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`;
//     const headers = {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${await this.authenticate()}`,
//     };

//     try {
//       const response = await axios.get(url, { headers });
//       return response.data;
//     } catch (error) {
//       console.log(error.data);
//       return errorMessage;
//     }
//   }
// }
