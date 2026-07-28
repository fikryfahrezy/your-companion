FROM oven/bun:1.3.14-debian AS development-dependencies-env
COPY . /app
WORKDIR /app
RUN bun ci --verbose --no-cache

FROM oven/bun:1.3.14-debian AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules
WORKDIR /app
RUN bun run build

# 3. Production image, copy all the files and run next
FROM nginx:1.29.7-trixie AS runner
WORKDIR /app

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/dist /var/www/out