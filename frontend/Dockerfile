# syntax=docker/dockerfile:1

# -------------------------------------------------------
# Stage 1: Build the React application
# -------------------------------------------------------
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first so Docker can cache npm ci
COPY package.json package-lock.json ./

RUN npm install

# Copy application source
COPY . .

# Public frontend configuration supplied during docker build
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Produce optimized static production files
RUN npm run build


# -------------------------------------------------------
# Stage 2: Serve the production build using Nginx
# -------------------------------------------------------
FROM nginx:stable-alpine AS runtime

# Replace the default Nginx site configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Vite normally produces /app/dist
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
