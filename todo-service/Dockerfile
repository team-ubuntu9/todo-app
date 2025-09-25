FROM node:18-slim

# Installer OpenSSL et les dépendances nécessaires pour Prisma
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    openssl \
    libssl3 \
    ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Génère le client Prisma dans l'environnement du conteneur
RUN npx prisma generate

# Copier le fichier .env.docker vers .env pour que dotenv le trouve
RUN cp .env.docker .env

EXPOSE 3001

CMD ["npm", "run", "dev"]