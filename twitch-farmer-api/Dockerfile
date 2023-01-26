FROM node:lts-alpine

WORKDIR /home/app

COPY . .

RUN ["npm", "ci"]
RUN ["npm", "run", "build"]

EXPOSE 3000

ENTRYPOINT [ "npm", "run", "start:prod" ]