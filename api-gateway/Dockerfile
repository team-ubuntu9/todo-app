FROM node:18-alpine

# Installer wget pour les health checks
RUN apk add --no-cache wget

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 3002

# Commande de démarrage
CMD ["npm", "start"]
