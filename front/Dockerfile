FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

ARG API_URL
ARG COOLIFY_BRANCH

ENV API_URL=$API_URL
ENV COOLIFY_BRANCH=$COOLIFY_BRANCH

RUN echo "DEBUG: COOLIFY_BRANCH='$COOLIFY_BRANCH', API_URL='$API_URL'" && \
    if [ -n "$COOLIFY_BRANCH" ]; then \
        echo "DEBUG: Detected Coolify deployment with branch: $COOLIFY_BRANCH"; \
        PR_ID=$(echo "$COOLIFY_BRANCH" | sed -n 's|^pull/\([0-9]*\)/head$|\1|p'); \
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
            echo "DEBUG: No PR_ID found in branch name, using original API_URL"; \
        fi; \
    else \
        FINAL_API_URL="$API_URL"; \
        echo "DEBUG: Not a Coolify deployment, using original API_URL"; \
    fi && \
    echo "DEBUG: Final API URL to be used: $FINAL_API_URL" && \
    echo "DEBUG: Contents of environment file before replacement:" && \
    cat src/app/environments/environment.prod.ts && \
    sed -i "s|PRODUCTION_API_URL|$FINAL_API_URL|g" src/app/environments/environment.prod.ts && \
    echo "DEBUG: Contents of environment file after replacement:" && \
    cat src/app/environments/environment.prod.ts

RUN npm run build --omit=dev

FROM nginx:alpine

COPY --from=build /app/dist/fintrack-front/browser /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
