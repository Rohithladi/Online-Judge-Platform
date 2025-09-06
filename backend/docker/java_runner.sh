#!/bin/bash
javac Code.java
if [ $? -ne 0 ]; then
    echo "Compilation Error"
    exit 1
fi
java Code < input.txt
