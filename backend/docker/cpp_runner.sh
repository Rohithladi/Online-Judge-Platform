#!/bin/bash
g++ code.cpp -o code.out
if [ $? -ne 0 ]; then
    echo "Compilation Error"
    exit 1
fi
./code.out < input.txt
