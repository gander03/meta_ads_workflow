from utils.authenticate import authenticate

my_account = authenticate()


def create_ad_set(params):
    fields = []
    response = my_account.create_ad_set(fields=fields, params=params)
    adset_id = response["id"]
    print("Ad Set created with ID:", adset_id)
    return adset_id
