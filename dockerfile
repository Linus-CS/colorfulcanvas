FROM rust
COPY ./server/target/release/rust-server /app
COPY ./server/certs/* /app/certs/
COPY ./client/sites/*.js /app/client/sites/
COPY ./client/sites/*.css /app/client/sites/
COPY ./client/sites/*.html /app/client/sites/
WORKDIR /app
CMD ./rust-server
