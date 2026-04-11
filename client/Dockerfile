FROM node:24.14.1-alpine3.23 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM base AS development
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS build
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]