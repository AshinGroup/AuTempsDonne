import numpy as np
import numpy.random
import math
import matplotlib.pyplot as plt
from scipy.spatial.distance import cdist

# Fonction pour calculer la distance entre deux points en utilisant les coordonnées de latitude et longitude
def distance(coord1, coord2):
    lat1, lon1 = coord1
    lat2, lon2 = coord2
    return math.sqrt((lat2 - lat1)**2 + (lon2 - lon1)**2)

def distance_ville(v1, v2):
    return distance(v1, v2)

def distance_tour(villes, permutation):
    tour = distance_ville(villes[permutation[0]], villes[permutation[-1]])
    for i in range(0, len(permutation) - 1):
        tour += distance_ville(villes[permutation[i]], villes[permutation[i + 1]])
    return tour

def ameliore_tour_renversement(villes, perm=None):
    perm = (perm.copy() if perm is not None
            else list(range(villes.shape[0])))
    dist_min = distance_tour(villes, perm)
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
        dist = distance_tour(villes, perm)
        if dist < dist_min:
            dist_min = dist
            cont = True
            nb_perm += 1
            nb_iter = 0
        else:
            perm = p0
            cont = False
    return dist_min, nb_perm, perm

def dessine_tour(villes, perm):
    fig, ax = plt.subplots(1, 1, figsize=(4, 4))
    ax.plot(villes[perm, 0], villes[perm, 1], 'b-o')
    ax.plot([villes[perm[0], 0], villes[perm[-1], 0]],
            [villes[perm[0], 1], villes[perm[-1], 1]], 'b-o')
    ax.set_title("dist=%f" % distance_tour(villes, perm))
    # plt.show()
    print("dist = ",distance_tour(villes, perm))
    return ax

def build_permutation(villes):
    pairs = cdist(villes, villes)
    max_dist = pairs.ravel().max()
    for i in range(villes.shape[0]):
        pairs[i, i] = max_dist
    arg = numpy.argmin(pairs, axis=1)
    arg_dist = [(pairs[i, arg[i]], i, arg[i]) for i in range(villes.shape[0])]
    mn = min(arg_dist)
    perm = list(mn[1:])
    pairs[perm[0], :] = max_dist
    pairs[:, perm[0]] = max_dist
    while len(perm) < villes.shape[0]:
        last = perm[-1]
        arg = numpy.argmin(pairs[last:last+1])
        perm.append(arg)
        pairs[perm[-2], :] = max_dist
        pairs[:, perm[-2]] = max_dist
    return perm



# Exemple d'utilisation avec des coordonnées de latitude et de longitude
villes = np.array([
    [40.7128, -74.0060],   # New York, USA
    [34.0522, -118.2437],  # Los Angeles, USA
    [41.8781, -87.6298],   # Chicago, USA
    [29.7604, -95.3698],   # Houston, USA
    [33.4484, -112.0740],  # Phoenix, USA
    [37.7749, -122.4194],  # San Francisco, USA
    [51.5074, -0.1278],    # Londres, Royaume-Uni
    [48.8566, 2.3522],     # Paris, France
    [55.7558, 37.6176],    # Moscou, Russie
    [35.6895, 139.6917],   # Tokyo, Japon
    [31.2304, 121.4737],   # Shanghai, Chine
    [-33.8688, 151.2093],  # Sydney, Australie
    [37.5665, 126.9780],   # Séoul, Corée du Sud
    [-23.5505, -46.6333],  # São Paulo, Brésil
    [-34.6037, -58.3816],  # Buenos Aires, Argentine
    [-12.0464, -77.0428],  # Lima, Pérou
    [19.4326, -99.1332],   # Mexico, Mexique
])


# dist, nb_perm, perm = ameliore_tour_renversement(villes)
# print("Distance minimale trouvée :", dist)
# print("Nombre de permutations effectuées :", nb_perm)
# print("Permutation optimale :", perm)


# perm = list(range(villes.shape[0]))
# print(dessine_tour(villes, perm));
for i in range(10):
    print(f"Test {i} :")
    perm = build_permutation(villes)
    dessine_tour(villes, perm);
    dist, nb_perm, perm = ameliore_tour_renversement(villes, perm)
    print("nb perm", nb_perm)
    dessine_tour(villes, perm);
    print(" ")
