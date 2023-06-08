FROM node:18 as builder
ENV NODE_ENV=development
USER node
WORKDIR /home/node/app
COPY --chown=node:node package.json ./
RUN  npm install
COPY --chown=node:node . .
RUN npm run build

FROM node:18 as runner
ENV NODE_ENV=production
USER node
WORKDIR /home/node/app
COPY --chown=node:node package.json ./
RUN npm install --only=production
COPY --chown=node:node --from=builder /home/node/app .
EXPOSE 3000
CMD ["node", "build/index.js"]