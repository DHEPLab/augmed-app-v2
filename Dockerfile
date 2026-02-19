FROM node:lts-alpine AS builder
RUN apk add --update --no-cache g++ make py3-pip
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

# Copy built React app to nginx html directory
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx config template (envsubst substitutes $PORT and $API_URL at startup)
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 8080

# nginx:alpine image auto-runs envsubst on /etc/nginx/templates/*.template
# and outputs to /etc/nginx/conf.d/, then starts nginx
CMD ["nginx", "-g", "daemon off;"]
