FROM node:18

WORKDIR /app

COPY ./api .

RUN npm ci

EXPOSE 8080
ENTRYPOINT ["npm", "start"]