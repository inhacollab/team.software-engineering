import json

# Load the json file
with open('data/myfile_12225252.json','r') as json_file:
    ourjson = json.load(json_file)

print("The access token is: {}".format(ourjson['access_token'])) 
print("The token expires in {} seconds.".format(ourjson['expires_in']))
