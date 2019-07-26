#!/usr/bin/env sh

# Create resume and then run Jekyll site
# This uses https://github.com/there4/markdown-resume

cd "$(dirname "$0")/.."

# Make resume PDF
alias md2resume="docker run -v ${PWD}:/resume there4/markdown-resume:2.3.1 md2resume"
md2resume pdf --template modern ./assets/resume.md .
