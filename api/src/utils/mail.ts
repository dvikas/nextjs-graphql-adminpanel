// // Load the AWS SDK for Node.js
// import AWS from 'aws-sdk';
// import { credentials } from './fileUpload';

// const ses = new AWS.SES({ apiVersion: '2010-12-01', credentials, region: 'us-east-1' });

// export const sendEmail = async ({
//     toAddress,
//     subject,
//     text,
// }: {
//     toAddress: string[];
//     subject: string;
//     text: string;
// }): Promise<void> => {
//     const params = {
//         Destination: {
//             CcAddresses: [],
//             ToAddresses: toAddress,
//         },
//         Message: {
//             Body: {
//                 Html: {
//                     Charset: 'UTF-8',
//                     Data: `
//                     <div className="email" style="
//                       border: 1px solid black;
//                       padding: 20px;
//                       font-family: sans-serif;
//                       line-height: 2;
//                       font-size: 20px;
//                     ">
//                       <h2>Hello There!</h2>
//                       <p>${text}</p>

//                       <p>Admin</p>
//                     </div>
//                   `,
//                 },
//             },
//             Subject: {
//                 Charset: 'UTF-8',
//                 Data: subject,
//             },
//         },
//         Source: 'info@nextgraphqladmin.com',
//         ReplyToAddresses: ['info@nextgraphqladmin.com'],
//     };

//     try {
//         await ses.sendEmail(params).promise();
//     } catch (e) {
//         throw e;
//     }
// };
