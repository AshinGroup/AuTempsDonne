import requests
from requests.structures import CaseInsensitiveDict

url =" https://api.geoapify.com/v1/routing?waypoints=49.266798660303806,4.015207106327807|49.26724369633115,4.016633129984598|49.26766849970397,4.018121154669643|49.267796614288926,4.019288840706963|49.26760781373193,4.020001852535415|49.266798660303806,4.015207106327807&mode=light_truck&format=json&apiKey=d548c5ed24604be6a9dd0d989631f783"
headers = CaseInsensitiveDict()
headers["Accept"] = "application/json"

resp = requests.get(url, headers=headers)

data = resp.json()

geometry = data['results'][0]['geometry']

waypoints = list()
for itinerary in geometry:
    for waypoint in itinerary:
        waypoints.append([waypoint['lat'], waypoint['lon']])

print(waypoints)