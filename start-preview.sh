#!/bin/bash
# Lancement rapide du serveur local pour prévisualiser le site du mariage
PORT=8080
echo "=========================================================="
echo "💍 Site Vitrine Mariage Tuborg & Yacine"
echo "Ouverture du serveur local sur le port $PORT..."
echo "Lien : http://localhost:$PORT"
echo "=========================================================="

if command -v python3 &>/dev/null; then
  python3 -m http.server $PORT
elif command -v python &>/dev/null; then
  python -m SimpleHTTPServer $PORT
elif command -v npx &>/dev/null; then
  npx serve -p $PORT
else
  echo "Veuillez ouvrir directement le fichier index.html dans votre navigateur."
fi
