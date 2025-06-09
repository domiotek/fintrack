FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

ARG API_URL
ARG IS_COOLIFY=false
ARG BRANCH_NAME

ENV API_URL=$API_URL

RUN echo "DEBUG: IS_COOLIFY='$IS_COOLIFY', BRANCH_NAME='$BRANCH_NAME', API_URL='$API_URL'" && \
    if [ "$IS_COOLIFY" = "true" ] || [ "$IS_COOLIFY" = "TRUE" ] || [ "$IS_COOLIFY" = "1" ]; then \
        if [ -n "$BRANCH_NAME" ]; then \
            echo "DEBUG: Processing Coolify deployment with BRANCH_NAME: $BRANCH_NAME"; \
            PR_ID=$(echo "$BRANCH_NAME" | sed -n 's|^pull/\([0-9]*\)/head$|\1|p'); \
            echo "DEBUG: Extracted PR_ID: '$PR_ID'"; \
            if [ -n "$PR_ID" ] && [ "$PR_ID" != "" ]; then \
                PROTOCOL=$(echo "$API_URL" | sed -n 's|^\(https\?\)://.*|\1|p'); \
                DOMAIN=$(echo "$API_URL" | sed -n 's|^https\?://\([^/]*\).*|\1|p'); \
                echo "DEBUG: PROTOCOL='$PROTOCOL', DOMAIN='$DOMAIN'"; \
                if [ -n "$PROTOCOL" ] && [ -n "$DOMAIN" ]; then \
                    FINAL_API_URL="${PROTOCOL}://${PR_ID}.${DOMAIN}"; \
                    echo "DEBUG: Generated FINAL_API_URL: $FINAL_API_URL"; \
                else \
                    FINAL_API_URL="$API_URL"; \
                    echo "DEBUG: Failed to parse protocol/domain, using original API_URL"; \
                fi; \
            else \
                FINAL_API_URL="$API_URL"; \
                echo "DEBUG: No PR_ID found, using original API_URL"; \
            fi; \
        else \
            FINAL_API_URL="$API_URL"; \
            echo "DEBUG: No BRANCH_NAME provided, using original API_URL"; \
        fi; \
    else \
        FINAL_API_URL="$API_URL"; \
        echo "DEBUG: IS_COOLIFY is not true, using original API_URL"; \
    fi && \
    echo "DEBUG: Final API URL to be used: $FINAL_API_URL" && \
    sed -i "s|PRODUCTION_API_URL|$FINAL_API_URL|g" src/app/environments/environment.prod.ts

RUN npm run build --omit=dev

FROM nginx:alpine

COPY --from=build /app/dist/fintrack-front/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
