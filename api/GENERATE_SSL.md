### Following Steps is for Mac OS
* `sudo openssl genrsa -out ./localhost.key 2048`
* `sudo openssl rsa -in ./localhost.key -out ./localhost.key.rsa`
* `sudo vim ./localhost.conf`
Copy following contents 
```javascript
[req]
default_bits = 1024
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = local.api.nextgraphqladmin.com
DNS.2 = *.nextgraphqladmin.com
```

* `sudo openssl req -new -key ./localhost.key.rsa -subj "/C=/ST=/L=/O=/CN=localhost/" -out ./localhost.csr -config ./localhost.conf`
* `sudo openssl x509 -req -extensions v3_req -days 365 -in ./localhost.csr -signkey ./localhost.key.rsa -out ./localhost.crt -extfile ./localhost.conf`
* `sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain ./localhost.crt`


#### Update .env file 
```
HTTPS_KEY=./localhost.key
HTTPS_CERT=./localhost.crt
```
#### Resource:
https://www.webconsol.com/post/how-to-generate-ssl-certificate-locally-for-macos
