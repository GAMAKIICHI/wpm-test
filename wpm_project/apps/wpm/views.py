from django.shortcuts import render, redirect
from django.conf import settings
import json, logging, os
from django.http import JsonResponse

logger = logging.getLogger()

def index(request):

    fileLocation = os.path.join(settings.BASE_DIR, 'static', 'words', 'words.json')
    mode = loadWords(fileLocation, "easy")

    if request.method == "POST":
        mode = json.loads(request.body).get("mode")
        data = loadWords(fileLocation, mode)

        return JsonResponse({"message": "Data received successfully", "words": f"{data}"})
        
    return render(request, "wpm/wpm_test.html")

def loadWords(fileLocation, difficulty):
    try:
        with open(fileLocation, 'r') as file:
            data = json.load(file)

            if difficulty.lower() not in data:
                raise KeyError(f"Difficulty '{difficulty}' not found in JSON.")

            filteredData = data[difficulty.lower()]

            if not filteredData:
                raise ValueError("Unable to find any words for given difficulty")

            return filteredData

    except Exception as err:
        logger.error(f"An error has occured: {err}")