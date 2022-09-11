FROM rust
COPY ./server/target/release/rust-server /app
COPY ./server/certs/* /app/certs/
COPY ./client/sites/* /app/sites/
COPY ./client/assets/* /app/assets/
WORKDIR /app
CMD ./rust-server
