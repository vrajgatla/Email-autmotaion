FROM openjdk:11-jre-slim

WORKDIR /app

# Copy the Maven wrapper and pom.xml first for better caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Make mvnw executable
RUN chmod +x mvnw

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Copy the built JAR
COPY target/*.jar app.jar

EXPOSE 8080

CMD ["java", "-jar", "app.jar"] 