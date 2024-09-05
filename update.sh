#!/bin/bash
cd /var/www/aos
git pull
screen -S annanode -X quit
screen -dmS annanode python3 /var/www/aos/main.py
