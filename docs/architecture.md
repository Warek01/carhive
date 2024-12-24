# CarHive architecture

The platform is implemented in a client-server, microservice architecture. The platform has currently the following components:
- Gateway
- Reverse proxy
- In-memory cache
- Account service
- Listing service
- Recommendation service
- Scraping service
- Scraping workers
- Web interface
- Account relational database
- Listing relational database

## Why NestJS

NestJS is a popular Node.js framework with accent on modularity, scalability and ease of setup/deployment. It provides a handful of abstraction
mechanisms out of the box and has a mature ecosystem and a package repository.

The communication between microservices is currently implemented via HTTP/1.1 which is the basic setup for a NestJS project, however switching to
a more advanced communication protocol is very easy since the implementations are abstracted by the controller pattern. In future TCP, gRPC or other
protocols can be adopted.

## Gateway

The responsibility of the gateway is to validate the input and pass it further to the required microservice. It uses cache for read or CPU intensive requests
like recommendations generation. The gateway has no additional responsibilities other than simple input validation, calling microservices and 
validating request authorization by checking the token.
