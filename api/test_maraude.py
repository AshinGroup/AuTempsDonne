from model.location import Location
import numpy as np
import numpy.random
import math
import matplotlib.pyplot as plt
from scipy.spatial.distance import cdist


def distance(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    return math.sqrt((lat2 - lat1)**2 + (lon2 - lon1)**2)


def city_distance(v1, v2):
    return distance(v1, v2)


def turn_distance(locations: list, permutation):
    turn = city_distance(locations[permutation[0]], locations[permutation[-1]])
    for i in range(0, len(permutation) - 1):
        turn += city_distance(locations[permutation[i]], locations[permutation[i + 1]])
    return turn


def improve_reversal_turn(locations: list, perm=None):
    perm = (perm.copy() if perm is not None
            else list(range(locations.shape[0])))
    dist_min = turn_distance(locations, perm)
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
        dist = turn_distance(locations, perm)
        if dist < dist_min:
            dist_min = dist
            cont = True
            nb_perm += 1
            nb_iter = 0
        else:
            perm = p0
            cont = False
    return dist_min, nb_perm, perm


def draw_turn(locations: list, perm):
    fig, ax = plt.subplots(1, 1, figsize=(4, 4))
    ax.plot(locations[perm, 0], locations[perm, 1], 'b-o')
    ax.plot([locations[perm[0], 0], locations[perm[-1], 0]],
            [locations[perm[0], 1], locations[perm[-1], 1]], 'b-o')
    ax.set_title("dist=%f" % turn_distance(locations, perm))
    # plt.show()
    print("dist = ", turn_distance(locations, perm))
    


def build_permutation(locations: list):
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


def get_optimal_order(locations: list) -> list : 
    min_dist = -1
    optimal_order = list()
    for i in range(5):
        perm = build_permutation(locations)
        dist, nb_perm, perm = improve_reversal_turn(locations, perm)
       
        if min_dist == -1 or turn_distance(locations, perm) < min_dist:
            min_dist = turn_distance(locations, perm)
            optimal_order = perm
      
    return optimal_order
  

def transform_locations(locations: list) -> list:
    locations_coords = [[location.latitude, location.longitude] for location in locations]
    return np.array(locations_coords)


