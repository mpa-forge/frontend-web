FROM node:24-alpine AS build

WORKDIR /app

COPY public ./public

RUN mkdir -p /out \
	&& cp -R public/. /out/ \
	&& if [ ! -f /out/index.html ]; then \
		printf '%s\n' '<!doctype html><html><body><h1>frontend-web placeholder</h1></body></html>' > /out/index.html; \
	fi

FROM nginx:1.29-alpine AS runtime

COPY --from=build /out /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD wget -q -O /dev/null http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
