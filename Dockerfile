FROM node:24-alpine AS build

WORKDIR /app

ARG VITE_APP_ENV=local
ARG VITE_API_BASE_URL=http://localhost:8080
ARG VITE_CLERK_PUBLISHABLE_KEY=pk_test_replace_me
ARG VITE_CLERK_SIGN_IN_URL=/sign-in
ARG VITE_CLERK_SIGN_UP_URL=/sign-up

ENV VITE_APP_ENV=$VITE_APP_ENV
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_SIGN_IN_URL=$VITE_CLERK_SIGN_IN_URL
ENV VITE_CLERK_SIGN_UP_URL=$VITE_CLERK_SIGN_UP_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY public ./public
COPY src ./src
COPY index.html vite.config.ts tsconfig.json eslint.config.mjs prettier.config.mjs ./

RUN npm run build

FROM nginx:1.29-alpine AS runtime

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
