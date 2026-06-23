#!/bin/bash
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"
/usr/bin/ruby -rwebrick -e "WEBrick::HTTPServer.new(:Port => 8765, :DocumentRoot => '$DIR').start"
