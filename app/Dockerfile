FROM public.ecr.aws/docker/library/node:18-alpine AS source

RUN yarn global add pm2@4.5.6

RUN apk update && apk upgrade && \
    apk add build-base \
    gcc \
    autoconf \
    automake \
    zlib-dev \
    libpng-dev \
    nasm \
    bash \
    curl \
    git \
    ffmpeg \
    libwebp \
    libwebp-tools \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev

WORKDIR /app
ADD package.json package-lock.json ./
RUN npm i

ADD . .

FROM source AS builder
RUN npm run build

FROM scratch
COPY --from=builder /app/out /app/out
