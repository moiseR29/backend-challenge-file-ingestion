FROM node:20.19.0 as builder

WORKDIR /app

COPY package.json yarn.lock tsconfig* ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build



FROM node:20.19.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./

COPY config ./config

COPY --from=builder /app/dist ./dist

RUN yarn install --frozen-lockfile

CMD ["node", "dist/worker.js"]
