FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY wellness-ca.crt ./wellness-ca.crt

EXPOSE 3100

CMD ["node", "src/server.js"]
