Currency Converter API
A Node.js RESTful API serving as back-end for https://github.com/a-star711/CurrencyConverter-UI.

- Deployed on Vercel: https://currency-converter-api-sigma.vercel.app/
- Access the Swagger documentation for testing and exploring endpoints.

  **Tech Stack**  
- **Back-End:** Node.js, Express.js  
- **Database:** MongoDB (Atlas)  
- **Security:** JWT, helmet, CORS, rate-limiting  
- **Documentation:** Swagger UI  


| **Endpoint**              | **Method** | **Description**               
|---------------------------|------------|-------------------------------
| `/api/v1/rates/`          | GET        | Fetch latest currency rates           
| `/api/v1/rates/sort`      | GET        | Sort rates       
| `/api/v1/rates/convert`   | POST       | Convert rates        



This project is open-source and available under the MIT License.
