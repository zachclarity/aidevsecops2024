

#Backend Java Spring Demo

Build the Docker image for the backend:

   ```
   docker build -t springboot-backend-openjdk21 .
   ```

3. Once the image is built, you can run the container:

   ```
   docker run -p 8080:8080 springboot-backend-openjdk21
   ```


## DockerFile

```dockerfile
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

```

Key points about this Dockerfile:

1. We're using `openjdk:21-slim` for both the build and runtime stages. This image is based on Debian and includes a minimal OpenJDK installation.
2. The `-slim` variant is used to keep the image size smaller, which is good for deployment and transfer times.
3. We're using a multi-stage build to keep the final image size as small as possible.

To use this Dockerfile:

1. Make sure you're in the `backend` directory of your project.

2. Build the Docker image for the backend:

   ```
   docker build -t springboot-backend-openjdk21 .
   ```

3. Once the image is built, you can run the container:

   ```
   docker run -p 8080:8080 springboot-backend-openjdk21
   ```

This will start your Spring Boot application using OpenJDK 21 inside a Docker container, accessible at `http://localhost:8080`.

To test if it's working, you can use curl in a new terminal window:

```
curl http://localhost:8080/hello
```

You should see the response: "Hello, World!"

Additional notes:

1. The Gradle configuration from the previous responses remains the same, as it's already set up for Java 21.

2. OpenJDK is fully compatible with the vast majority of Java applications, so you shouldn't encounter any issues switching from Oracle JDK to OpenJDK.

3. If you need to debug the container or want to see which exact version of OpenJDK is installed, you can run:

   ```
   docker run -it --rm openjdk:21-slim java -version
   ```

4. Remember that if you make any changes to your Spring Boot application code, you'll need to rebuild the Docker image before running a new container.

