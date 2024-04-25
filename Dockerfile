FROM node:lts-alpine

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install
RUN npm install serve -g
# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

ENV VITE_APP_NAME="FANALYST"
ENV VITE_APP_VERSION="0.0.1"
ENV VITE_APP_DEMO="backend"
ENV VITE_APP_FULL_NAME="FANALYST BACKEND"
ENV VITE_APP_API_URL="http://localhost:3010/"
ENV VITE_APP_SASS_COMPONENTS_PATH="src/assets/sass/core/components"
ENV VITE_APP_YOUTUBE_LINK="https://www.youtube.com/"
ENV VITE_APP_GITHUB_LINK="https://github.com/"
ENV VITE_APP_TWITTER_LINK="https://twitter.com"
ENV VITE_APP_INSTAGRAM_LINK="https://www.instagram.com"
ENV VITE_APP_FACEBOOK="https://www.facebook.com"
ENV VITE_APP_DRIBBBLE="https://dribbble.com"

EXPOSE 3000
# Run the Vite preview command
CMD ["serve", "-s", "dist"]
