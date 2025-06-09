FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

ARG API_URL
ARG COOLIFY_BRANCH

ENV API_URL=$API_URL

RUN if [ -n "$COOLIFY_BRANCH" ]; then \
        PR_ID=$(echo "$COOLIFY_BRANCH" | sed -n 's|^pull/\([0-9]*\)/head$|\1|p'); \
        if [ -n "$PR_ID" ] && [ "$PR_ID" != "" ]; then \
            PROTOCOL=$(echo "$API_URL" | sed -n 's|^\(https\?\)://.*|\1|p'); \
            DOMAIN=$(echo "$API_URL" | sed -n 's|^https\?://\([^/]*\).*|\1|p'); \
            if [ -n "$PROTOCOL" ] && [ -n "$DOMAIN" ]; then \
                FINAL_API_URL="${PROTOCOL}://${PR_ID}.${DOMAIN}"; \
            else \
                FINAL_API_URL="$API_URL"; \
            fi; \
        else \
            FINAL_API_URL="$API_URL"; \
        fi; \
    else \
        FINAL_API_URL="$API_URL"; \
    fi && \
    sed -i "s|PRODUCTION_API_URL|$FINAL_API_URL|g" src/app/environments/environment.prod.ts

RUN npm run build --omit=dev

FROM nginx:alpine

COPY --from=build /app/dist/fintrack-front/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
