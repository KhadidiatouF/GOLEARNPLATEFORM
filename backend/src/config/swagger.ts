import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Formation',
            version: '1.0.0',
            description: 'API pour la plateforme de formation en ligne',
        },
        servers: [
            {
                url: 'http://localhost:4004',
                description: 'Serveur local',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const specs = swaggerJsdoc(swaggerOptions);

export { swaggerUi, specs };


