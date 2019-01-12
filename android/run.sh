#!/bin/bash

./gradlew ${1:-installDevMinSdkDevKernelDebug} --stacktrace && adb shell am start -n org.musicoin.musicoin/host.exp.exponent.MainActivity
