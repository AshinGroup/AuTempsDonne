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

# Traveling Salesman Problem 
class RoadmapService:
    def __init__(self) -> None:
        self.location_service = LocationService()


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
        pairs = cdist(locations, locations)
        max_dist = pairs.ravel().max()
        for i in range(locations.shape[0]):
            pairs[i, i] = max_dist
        perm = []
        while len(perm) < locations.shape[0]:
            last = perm[-1] if perm else None
            arg = np.unravel_index(np.argmin(pairs), pairs.shape)
            next_index = arg[1] if arg[0] != last else arg[0]
            perm.append(next_index)
            pairs[next_index, :] = max_dist
            pairs[:, next_index] = max_dist
        print(perm)
        return perm


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
        points, distance, distance_units, time = self.get_direction_details(locations=locations)
        folium.PolyLine(points, weight=5, opacity=1).add_to(m)
        
        sw, ne = self.get_map_zoom(points)
        m.fit_bounds([sw, ne])
        time = datetime.now()
        formatted_time = time.strftime('%Y-%m-%d_%H_%M_%f')
        path = f"roadmap_{formatted_time}.html"
        m.save(path)
        return path, distance, distance_units, time

    def get_map_html(self, filepath: str):
        f = open(filepath, "r")
        return f.read() 

    def delete_map(self, filepath: str):
        if os.path.exists(filepath):
            os.remove(filepath)

    def generate_roadmap(self, locations_id: int):
        locations = list()
        for id in locations_id:
            locations.append(self.location_service.select_one_by_id(location_id=id))
        # locations = self.location_service.select_all_by_id(locations_id=locations_id)
        coordinates_array = self.transform_locations(locations)
        optimal_order = self.get_optimal_order_index(locations=coordinates_array)
        ordered_locations = self.get_ordered_locations(locations=locations, optimal_order=optimal_order)
        path , distance, distance_units, time = self.create_map(locations=ordered_locations)
        response = {
            'locations': [location.json_rest() for location in ordered_locations],
            'distance': distance,
            'distance_units': distance_units,
            'time': time,
            'map':  self.get_map_html(path),
        }
        return response


