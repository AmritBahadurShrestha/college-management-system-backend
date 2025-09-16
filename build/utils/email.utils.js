"use strict";
// export const generate_student_account_email = (student: any, password: string) => {
//     const html = `
//         <html>
//             <head>
//                 <style>
//                     body {
//                         font-family: Arial, sans-serif;
//                         color: #333;
//                         background-color: #f9f9f9;
//                         margin: 0;
//                         padding: 0;
//                     }
//                     .container {
//                         max-width: 600px;
//                         margin: 20px auto;
//                         background-color: #fff;
//                         padding: 20px;
//                         border-radius: 8px;
//                         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
//                     }
//                     .header {
//                         text-align: center;
//                         margin-bottom: 20px;
//                     }
//                     .header h1 {
//                         color: #2c3e50;
//                     }
//                     .credentials {
//                         margin-top: 20px;
//                         padding: 15px;
//                         border: 1px solid #ddd;
//                         border-radius: 6px;
//                         background-color: #fdfdfd;
//                     }
//                     .credentials p {
//                         margin: 8px 0;
//                     }
//                     .footer {
//                         text-align: center;
//                         font-size: 14px;
//                         color: #777;
//                         margin-top: 30px;
//                     }
//                 </style>
//             </head>
//             <body>
//                 <div class="container">
//                     <div class="header">
//                         <h1>Welcome to Our Platform</h1>
//                         <p>Hello <strong>${ student.fullName }</strong>, your student account has been created successfully.</p>
//                     </div>    
//                     <div class="credentials">
//                         <h3>Your Login Credentials</h3>
//                         <p><strong>Email / Username:</strong> ${ student.email }</p>
//                         <p><strong>Password:</strong> ${ password }</p>
//                     </div>    
//                     <p style="margin-top: 20px;">
//                         Please use these credentials to log in for the first time. 
//                         For security, we recommend changing your password after logging in.
//                     </p>  
//                     <div class="footer">
//                         <p>If you face any issues, please contact our support team.</p>
//                     </div>
//                 </div>
//             </body>
//         </html>
//     `;
//     return html;
// };
