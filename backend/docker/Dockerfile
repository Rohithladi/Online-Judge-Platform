FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    build-essential \
    openjdk-11-jdk \
    python3 \
    python3-pip \
    && apt-get clean

WORKDIR /code

COPY cpp_runner.sh /cpp_runner.sh
COPY java_runner.sh /java_runner.sh
COPY python_runner.sh /python_runner.sh

RUN chmod +x /cpp_runner.sh /java_runner.sh /python_runner.sh
