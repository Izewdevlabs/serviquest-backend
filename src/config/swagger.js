import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ServiQuest API Docs",
      version: "1.0.0",
      description: "API documentation for ServiQuest — Service Booking Platform",
      contact: {
        name: "Izew Dev Labs",
        email: "support@serviquest.app",
      },
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Dev Server",
      },
    ],
  },
  // Point to your route files for auto-generation
  apis: ["./src/routes/*.js"],
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;
