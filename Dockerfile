# Stage 1: Build
FROM maven:3.8.8-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn -B -DskipTests package

# Stage 2: Run
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/clinic-app.jar ./clinic-app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/clinic-app.jar"]

