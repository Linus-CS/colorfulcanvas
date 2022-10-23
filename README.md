# Colorfulcanvas a dynamic Shop

## General

* This is a repo containing a dynamic webshop aswell as a compatibale server written in Rust.
* No special technology was used to create the frontend, except vanilla html, css and typescript as the motor.
* Some dynamic features, require persistance of data along all users, which was accomplished by using a mongodb database.
* The project uses docker-compose to build containers for mongodb and the server.

## Helpful commands

* run `docker-compose -f dev-docker-compose-yml up` in the project root dir to get a development server going.
* run `docker-compose -f docker-compose-yml up` in the project root dir to get a server going.

| :exclamation:  Use with caution   |
|-----------------------------------------|
* run `./rebuild.sh` to delete all images and run development server after building images again.
* run `./rebuild.sh -r` to delete all images and run server after building images again.

## Structure

| :zap:  JS files are result of compiled TS files and should not be viewed as sourcefiles |
|-----------------------------------------|
* Under `/client/sites` you find all html, css and js files used in the frontend
* Under `/client/src` you find all ts files.
* Under `/client/assets` you find all assets used on the pages.

* Under `/server/main.rs` you find the server sourcefile.

* `./dev-docker-compose.yml` contains docker-compose configuration for the development server.
* `./docker-compose.yml` contains docker-compose configuration for the actual server.
* `./dev.dockerfile` contains the docker configuration for the development server image.
* `./dockerfile` contains the docker configuration for the actual server image.

* `./init-mongo.js` contains initialization configuration used by the mongodb container.

* `./rebuild.sh` is a shell script to delete all images, rebuild them and then start new containers.