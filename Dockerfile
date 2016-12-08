FROM php:apache

# Install App
WORKDIR /var/www/html
COPY . /var/www/html
