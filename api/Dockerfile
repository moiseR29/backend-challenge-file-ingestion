FROM node:20.19.0 as builder

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

COPY tsconfig* ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build



FROM node:20.19.0-alpine

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY config ./config

COPY --from=builder /app/dist ./dist

CMD ["yarn", "start"]
