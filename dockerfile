FROM node:20-slim
WORKDIR /app
COPY . .
RUN npm install
RUN npm install -g typescript
RUN npm install -g nodemon
CMD ["npm", "run","start"] 
