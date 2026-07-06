FROM node:20-slim AS builder

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy dependency configs
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source and build production bundle
COPY . .
RUN npm run build

# --- Production Nginx Stage ---
FROM nginx:alpine

# Copy built bundle assets from builder stage to Nginx html server directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to support SPA routing (Vite Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
