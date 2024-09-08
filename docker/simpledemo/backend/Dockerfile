# Build stage
FROM openjdk:21-slim as build

# Set the working directory in the container
WORKDIR /app

# Copy the Gradle files
COPY build.gradle settings.gradle gradlew ./
COPY gradle ./gradle

# Copy the project source
COPY src ./src

# Build the application
RUN ./gradlew build -x test

# Runtime stage
FROM openjdk:21-slim

WORKDIR /app

# Copy the built artifact from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8080

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/app/app.jar"]