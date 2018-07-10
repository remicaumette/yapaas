FROM node:alpine AS build
ADD . /app
WORKDIR /app

RUN npm install
ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
