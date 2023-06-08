import pymongo as pm
import numpy as np
import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import sys

# IDEA: use BERT to convert text into vectors of numbers, then apply the SVM method and use the cosine function to get the closest vectors for each element 



#############################################################################################

class Product:
    """
        Class that represents a product present in the Fauxica database
    """
    _id: str
    name: str
    price: float
    description: str
    available: int
    rating: float
    url: str
    
    def setFromJSON(self, file: dict):
        """
            Function to set the instance attributes from a JSON file passed

        Args:
            file dictionary: the JSON dictionary to retrieve data from
        """
        self._id = file['_id']
        self.name = file['name']
        self.price = float(file['price'])
        self.description = file['description']
        self.available = file['available']
        self.rating = file['rating']


def retrieveFromDB():
    """
        Function to retrieve data from the mongodb local database

    Returns:
        NDArray[Product]: the array of Product elements containing the objects retrieved from the db
    """
    client = pm.MongoClient('localhost', 27017)
    db = client["fauxica"]
    coll = db["Products"]
    cursor = coll.find()
    products = []
    for prod in cursor:
        products.append(prod)
    products = np.asarray(products)
    for i in range (len(products)):
        p = Product()
        p.setFromJSON(products[i])
        products[i] = p
    return products


def vectorize(products):
    """
        Function to vectorize the products' descriptions

    Args:
        products (NDArray[Products]): Numpy array of products to vectorize

    Returns:
        List[Tensor]: The vectorized descriptions
    """
    # Create a list containing every description
    descriptions = []
    for element in products:
        descriptions.append(element.description)
    # model to convert sentences in vectors using BERT
    model = SentenceTransformer('distilbert-base-nli-mean-tokens')
    # vectorize the descriptions with BERT
    res = model.encode(descriptions, show_progress_bar=False)
    return res


def reccomend(df, cos_sim_data, index):
    """
        Function to reccomend the 5 most similar products (by description) to the index element of the dataframe

    Args:
        df (DataFrame): Dataframe containing the instances of the products
        cos_sim_data (DataFrame): cosine similarity between every pair of elements in the products dataframe
        index (int): index of the element selected

    Returns:
        dictionary: dictionary containing the reccomended elements' ids
    """
    # orders the elements in the index-th row in a descending way, turns it into a list and takes the first 5 (1 to 6 excluding itself)
    recc_idx = cos_sim_data.loc[index].sort_values(ascending=False).index.tolist()[1:6]
    # take the reccomended elements' ids
    recc_prod = df['_id'].loc[recc_idx].values
    res = {'IDs': recc_prod, 'Idx': recc_idx}
    return res


def getIndexFromID(products, id: str):
    """
        Function to return the index of the element selected in the database

    Args:
        products (NDArray): Array of products
        id (str): id of the selected element

    Returns:
        int: index of the selected element in the array
    """
    for i in range(len(products)):
        if (products[i]._id == id):
            return i
        
    return -1 # if it's not in the db then return an error...


if __name__ == "__main__":
    # sys.argv[0] is the program name
    selectedId = sys.argv[1]
    products = retrieveFromDB()
    idx = getIndexFromID(products, selectedId)
    if idx == -1:
        print("error: search of the element in the db didn't succeed")
        print("error code: -1")
        exit(-1) # ...and exit the program with a -1 error message 
    # creates a DF from the vector: vars(p) returns a dictionary from p for every product in the vector
    prods = pd.DataFrame([vars(p) for p in products])
    embedded = np.array(vectorize(products))
    sim = pd.DataFrame(cosine_similarity(embedded))
    rec = reccomend(prods, sim, idx)
    for el in rec['IDs']:
        print(el)

