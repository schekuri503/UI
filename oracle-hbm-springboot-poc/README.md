# oracle-hbm-springboot-poc

Spring Boot 2.7.x + Java 11 sample using Hibernate `.hbm.xml` mappings (no `@Entity` annotations) against
Oracle Autonomous DB. Includes a local H2 profile for quick testing.

## Prerequisites

- Java 11
- Maven 3.8+

## Run locally with H2

```bash
cd oracle-hbm-springboot-poc
mvn spring-boot:run
```

The app starts on `http://localhost:8080` and auto-loads sample data from `schema.sql` and `data.sql`.

## Run against Oracle Autonomous DB

### Wallet-based connection

1. Download the wallet zip from Oracle Cloud.
2. Unzip to a local folder (for example: `/opt/wallets/myadb`).
3. Export environment variables:

```bash
export ORACLE_JDBC_URL="jdbc:oracle:thin:@myadb_high?TNS_ADMIN=/opt/wallets/myadb"
export ORACLE_USERNAME=ADMIN
export ORACLE_PASSWORD=your_password
```

4. Start the app with the Oracle profile:

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=oracle
```

### Non-wallet JDBC URL

If your Autonomous DB is configured for non-wallet access, you can set a standard JDBC URL:

```bash
export ORACLE_JDBC_URL="jdbc:oracle:thin:@//adb.us-ashburn-1.oraclecloud.com:1522/your_service"
export ORACLE_USERNAME=ADMIN
export ORACLE_PASSWORD=your_password
mvn spring-boot:run -Dspring-boot.run.profiles=oracle
```

## API Endpoints

- `GET /api/customers?limit=10`
- `GET /api/customers/{id}`
- `GET /api/products?limit=10`
- `GET /api/products/{id}`
- `GET /api/orders?limit=10`
- `GET /api/orders/{id}`
- `GET /api/order-lines?limit=10`
- `GET /api/order-lines/{id}`

## Postman

1. Open Postman.
2. Import `postman/oracle-hbm-springboot-poc.postman_collection.json`.
3. Use the `baseUrl` variable (default `http://localhost:8080`).
