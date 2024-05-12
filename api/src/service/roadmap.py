from model.location import Location
import numpy as np
import numpy.random
import math
import matplotlib.pyplot as plt
import folium
from scipy.spatial.distance import cdist
import pandas as pd
import requests
from requests.structures import CaseInsensitiveDict
from service.location import LocationService
import os
from datetime import datetime
from PIL import Image
import io
import selenium
from service.wasabi_s3 import WasabiS3
from service.pdf_file import PdfService
import time

# Traveling Salesman Problem 
class RoadmapService:
    def __init__(self) -> None:
        self.location_service = LocationService()
        self.wasabi_s3 = WasabiS3()
        self.pdf_service = PdfService()


    def distance(self, coord1, coord2):
        lat1, lon1 = coord1
        lat2, lon2 = coord2
        return math.sqrt((lat2 - lat1)**2 + (lon2 - lon1)**2)


    def turn_distance(self, locations: list, permutation):
        turn = self.distance(locations[permutation[0]], locations[permutation[-1]])
        for i in range(0, len(permutation) - 1):
            turn += self.distance(locations[permutation[i]], locations[permutation[i + 1]])
        return turn


    def improve_reversal_turn(self, locations: list, perm=None):
        if len(locations) == 2:
            return 0, 0, [0,1]
        
        perm = (perm.copy() if perm is not None
                else list(range(locations.shape[0])))
        dist_min = self.turn_distance(locations, perm)
        cont = True
        nb_perm, nb_iter = 0, 0
        while cont or nb_iter < len(perm) ** 2:
            nb_iter += 1
            p0 = perm.copy()
            a = numpy.random.randint(0, len(perm) - 2)
            b = numpy.random.randint(a + 1, len(perm) - 1)
            if a == 0:
                perm[0:b] = perm[b:0:-1]
                perm[b] = p0[0]
            else:
                perm[a:b+1] = perm[b:a-1:-1]
            dist = self.turn_distance(locations, perm)
            if dist < dist_min:
                dist_min = dist
                cont = True
                nb_perm += 1
                nb_iter = 0
            else:
                perm = p0
                cont = False
        return dist_min, nb_perm, perm


    def draw_turn(self, locations: list, perm):
        fig, ax = plt.subplots(1, 1, figsize=(4, 4))
        ax.plot(locations[perm, 0], locations[perm, 1], 'b-o')
        ax.plot([locations[perm[0], 0], locations[perm[-1], 0]],
                [locations[perm[0], 1], locations[perm[-1], 1]], 'b-o')
        ax.set_title("dist=%f" % self.turn_distance(locations, perm))
        # plt.show()
        print("dist = ", self.turn_distance(locations, perm))
        


    def build_permutation(self, locations: list):
        n = len(locations)
        dist_matrix = cdist(locations, locations)
        permutation = [0]  # Commencer avec le premier indice
        while len(permutation) < n:
            last_index = permutation[-1]
            # Exclure les indices déjà utilisés pour éviter les doublons
            remaining_indices = [i for i in range(n) if i not in permutation]
            # Trouver l'indice le plus proche du dernier indice dans la permutation
            next_index = min(remaining_indices, key=lambda x: dist_matrix[last_index][x])
            permutation.append(next_index)
        return permutation  


    def get_optimal_order_index(self, locations: list) -> list : 
        min_dist = -1
        optimal_order = list()
        for i in range(5):
            perm = self.build_permutation(locations)
            dist, nb_perm, perm = self.improve_reversal_turn(locations, perm)
        
            if min_dist == -1 or self.turn_distance(locations, perm) < min_dist:
                min_dist = self.turn_distance(locations, perm)
                optimal_order = perm

        return optimal_order
    

    def transform_locations(self, locations: list) -> list:
        locations_coords = [[float(location.latitude), float(location.longitude)] for location in locations]
        return np.array(locations_coords)


    def get_ordered_locations(self, locations: list[Location], optimal_order: list[int]):
        ordered_locations = list()
        start_index = optimal_order.index(0)
        if start_index != 0:
            for i in range(start_index, len(optimal_order)):
                ordered_locations.append(locations[optimal_order[i]])
            for i in range(start_index):
                ordered_locations.append(locations[optimal_order[i]])
        else:
            for i in range(len(optimal_order)):
                ordered_locations.append(locations[optimal_order[i]])
        return ordered_locations


    # Points path
    def get_direction_details(self, locations):
        url = "https://api.geoapify.com/v1/routing"
        waypoints_param = self.get_waypoints_parameter(locations=locations)
        api_key_param = f"&apiKey={os.getenv('GEOAPIFY_API_KEY')}"
        headers = CaseInsensitiveDict()
        headers["Accept"] = "application/json"
      
        response = requests.get(url + waypoints_param + "&mode=drive" + api_key_param, headers)
        data = response.json()
    
        geometry = data['features'][0]['geometry']['coordinates']
        
        details = data['features'][0]['properties']
        distance = details['distance']
        distance_units = details['distance_units']
        time = details['time']
        coordinates = list()
        
        for itinerary in geometry:
            for coordinate in itinerary:
                coordinates.append([coordinate[1], coordinate[0]])
        return coordinates, distance, distance_units, time


    def get_waypoints_parameter(self, locations):
        locations_list = [[location.latitude, location.longitude] for location in locations]
        locations_list.append([locations[0].latitude, locations[0].longitude])
        parameters = list()
        for coordinates in locations_list:
            parameters.append(','.join(coordinates))
        
        query = f"?waypoints={'|'.join(parameters)}"
        return query


    def get_map_zoom(self, data):
        df = pd.DataFrame(data, columns=['Lat', 'Lon'])
        sw = df[['Lat', 'Lon']].min().values.tolist()
        ne = df[['Lat', 'Lon']].max().values.tolist()
        return sw, ne

    def create_map(self, locations: list[Location]):
        m = folium.Map()
        print(locations)
        # Marks
        for i in range(len(locations)):
            description = f"{'Starting Point : ' if i == 0 else f'Location {i} : '}{locations[i].address}"
            point = [locations[i].latitude, locations[i].longitude]
            icon = folium.Icon(
                color="green" if i == 0 else "blue",
                icon="flag" if i == 0 else "star"
            )
            folium.Marker(
                location=point,
                popup=description,
                icon=icon    
            ).add_to(m)

        # Line
        points, distance, distance_units, time_seconds = self.get_direction_details(locations=locations)
        folium.PolyLine(points, weight=5, opacity=1).add_to(m)
        
        sw, ne = self.get_map_zoom(points)
        m.fit_bounds([sw, ne])
        formatted_time = time.strftime("%Hh%M", time.gmtime(time_seconds))
        path = f"tmp/roadmap.html"
        if not os.path.exists("tmp"):
            os.makedirs("tmp")
        m.save(path)
        self.map_to_png(map=m)
        return path, distance, distance_units, formatted_time

    def get_map_html(self, filepath: str):
        f = open(filepath, "r")
        return f.read() 

    def delete_map(self, filepath: str):
        if os.path.exists(filepath):
            os.remove(filepath)

    def map_to_png(self, map): 
        img_data = map._to_png(5)
        img = Image.open(io.BytesIO(img_data))
        if not os.path.exists("tmp"):
            os.makedirs("tmp")
        img.save('tmp/map.png')


    def generate_roadmap(self, locations_id: int, type: str) -> dict :
        for id in locations_id:
            self.location_service.select_one_by_id(location_id=id)
        locations = self.location_service.select_all_by_id(locations_id=locations_id)
        coordinates_array = self.transform_locations(locations)
        optimal_order = self.get_optimal_order_index(locations=coordinates_array)
        ordered_locations = self.get_ordered_locations(locations=locations, optimal_order=optimal_order)
        path , distance, distance_units, total_time = self.create_map(locations=ordered_locations)
        roadmap_src = self.wasabi_s3.upload_file(folder=f"roadmap/{type}", file_path=path, type=f"{type}_roadmap", extension="html")
        pdf_src = self.pdf_service.generate_roadmap_pdf(time=total_time, distance=distance, distance_units=distance_units, locations=ordered_locations, type=type)
        self.delete_map(path)
        response = {
            'locations': [location.json_rest() for location in ordered_locations],
            'distance': distance,
            'distance_units': distance_units,
            'time': total_time,
            'roadmap_src': roadmap_src,
            'pdf_src': pdf_src
        }
        return response


