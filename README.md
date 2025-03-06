# kicker-ui

[kicker-backend](https://github.com/oblassgit/kicker-backend)

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
OR

### Grab the backend project to host the full stack app
[kicker-backend](https://github.com/oblassgit/kicker-backend)

### Setup the project on a linux machine like this
```
kicker/
├─ frontend/ <-- kicker-ui
├─ backend/ <-- kicker-backend
├─ docker-compose.yml
```

### Use this docker-compose.yml 

```yml
version: "3.8"

services:
  mariadb:
    image: mariadb:latest
    container_name: mariadb_container
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: kicker
      MYSQL_USER: kicker_user
      MYSQL_PASSWORD:
    ports:
      - "3306:3306"
    networks:
      - myapp-network
    volumes:
      - mariadb_data:/var/lib/mysql

  backend:
    build: ./backend
    container_name: springboot_container
    restart: always
    depends_on:
      - mariadb
    environment:
      SPRING_DATASOURCE_URL: jdbc:mariadb://mariadb:3306/kicker
      SPRING_DATASOURCE_USERNAME: kicker_user
      SPRING_DATASOURCE_PASSWORD: 
    ports:
      - "8080:8080"
    networks:
      - myapp-network

  frontend:
    build: ./frontend
    container_name: vuejs_container
    restart: always
    depends_on:
      - backend
    networks:
      - myapp-network

  nginx:
    image: nginx:latest
    container_name: nginx_proxy
    restart: always
    ports:
      - "443:443"  # HTTPS
      - "80:80"
    volumes:
      - # mount custom nginx.conf here
      - # mount certificates for ssl here
    networks:
      - myapp-network
    depends_on:
      - frontend
      - backend

volumes:
  mariadb_data:

networks:
  myapp-network:
    driver: bridge
```
