FROM node:20-slim

# create work directory in app folder
WORKDIR /app

# copy over package.json files
COPY . .

RUN npm install && npm cache clean --force

RUN npm run build

ENV HOST 0.0.0.0
EXPOSE 3000

# run the build project with node
ENTRYPOINT ["node", ".output/server/index.mjs"]
