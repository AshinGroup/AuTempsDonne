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


# Traveling Salesman Problem 
class RoadmapService:
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
        arg = numpy.argmin(pairs, axis=1)
        arg_dist = [(pairs[i, arg[i]], i, arg[i]) for i in range(locations.shape[0])]
        mn = min(arg_dist)
        perm = list(mn[1:])
        pairs[perm[0], :] = max_dist
        pairs[:, perm[0]] = max_dist
        while len(perm) < locations.shape[0]:
            last = perm[-1]
            arg = numpy.argmin(pairs[last:last+1])
            perm.append(arg)
            pairs[perm[-2], :] = max_dist
            pairs[:, perm[-2]] = max_dist
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
        locations_coords = [[location.latitude, location.longitude] for location in locations]
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
    def get_direction_coordinates(self, locations):
        url = "https://api.geoapify.com/v1/routing?"
        waypoints_param = self.get_waypoints_parameter(locations=locations)
        api_key_param = f"?apiKey={os.getenv('GEOAPIFY_API_KEY')}"
        headers = CaseInsensitiveDict()
        headers["Accept"] = "application/json"

        response = requests.get(url + waypoints_param + api_key_param, headers)
        data = resp.json()

        geometry = data['results'][0]['geometry']
        coordinates = list()
        for itinerary in geometry:
            for coordinate in itinerary:
                coordinates.append([coordinate['lat'], coordinate['lon']])
        return coordinates


    def get_waypoints_parameter(self, locations):
        locations_list = [[location.latitude, location.longitude] for location in locations]
        locations_list.append([locations[0].latitude, locations[0].longitude])
        query = f"waypoints={locations_list.join('|')}"
        return query


    def get_map_zoom(self, data):
        df = pd.DataFrame(data, columns=['Lat', 'Long'])
        sw = df[['Lat', 'Lon']].min().values.tolist()
        ne = df[['Lat', 'Lon']].max().values.tolist()
        return sw, ne

    def create_map(self, locations: list[Location]):
        m = folium.Map()
        df = pd.DataFrame()

        # Marks
        for location in ordered_locations:
            point = [location.latitude, location.longitude]
            folium.Marker(point).add_to(m)
        
        # Line
        points = self.get_direction_coordinates(locations=ordered_locations)
        folium.PolyLine(points, weight=5, opacity=1).add_to(m)

        sw, ne = self.get_map_zoom(points)
        m.fit_bounds([sw, ne])
        m.save("img/image.html")
        return m


    def generate_roadmap(self, locations: list[Location]):
        coordinates_array = self.transform_locations(locations)
        optimal_order = self.get_optimal_order_index(locations=coordinates_array)
        ordered_locations = self.get_ordered_locations(locations=locations, optimal_order=optimal_order)
        self.create_map(locations=ordered_locations)



    # m = folium.Map(location=(45.5236, -122.6750))
    # m = folium.Map([45.35, -121.6972], zoom_start=12)

    # folium.Marker(
    #     location=[45.3288, -121.6625],
    #     tooltip="Click me!",
    #     popup="Mt. Hood Meadows",
    #     icon=folium.Icon(icon="cloud"),
    # ).add_to(m)

    # folium.Marker(
    #     location=[45.3311, -121.7113],
    #     tooltip="Click me!",
    #     popup="Timberline Lodge",
    #     icon=folium.Icon(color="green"),
    # ).add_to(m)

    # m.save("img/image.html")