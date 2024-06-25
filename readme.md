


## Steps to Run
### 1. Setting up the DHT Network
- To set up a private DHT network, install the `hyperdht` package globally:
    ```
    npm install -g hyperdht
    ```
- Run the first bootstrap node:
    ```
    hyperdht --bootstrap --host 127.0.0.1 --port 30001
    ```
- Install dependencies:
    ```
    npm install
    ```
### 2. Running the Server

- Start the server:
    ```
    node server.js
    ```
- Note the public key printed in the console, which is needed for client configuration.

### 3. Running the Client
- Configure the `.env` file with the server's public key obtained in the previous step.
- Start the client:
    ```
    node test.js

    Also there is index.js to use the API if needed
    ```
