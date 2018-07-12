FROM node:alpine

ADD . /app
WORKDIR /app

ENV NODE_ENV=production
ENV DB_URI=postgres://platform:platform@database:5432/platform
ENV SECRET=wowthisismysecret
ENV ADMIN=remicaumette,despacito2
ENV BASE_URL=localhost

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
