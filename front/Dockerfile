FROM node:23-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts

COPY . .

RUN npm run build --omit=dev

FROM nginx:alpine

COPY --from=build /app/dist/fintrack-front/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
