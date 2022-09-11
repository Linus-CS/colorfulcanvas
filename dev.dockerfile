FROM rust
COPY ./server/* /dev/server/
COPY ./client/* /dev/client/
WORKDIR /dev/server/
CMD cargo run
