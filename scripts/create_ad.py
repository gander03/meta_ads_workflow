from utils.authenticate import authenticate

my_account = authenticate()


def generate_ad(params, creative_params):
    creative_id = generate_ad_creative(params=creative_params)
    params["creative"] = {"creative_id": creative_id}

    fields = []

    response = my_account.create_ad(fields=fields, params=params)
    ad_id = response["id"]

    print("Ad created with ID:", ad_id)


def generate_ad_creative(params):
    fields = []

    response = my_account.create_ad_creative(fields=fields, params=params)
    creative_id = response["id"]
    print("Ad Creative created with ID:", creative_id)
    return creative_id


def generate_flexible_ad(
    ad_params,
    creative_params,
    link,
    image_hash_arr,
    video_hash_arr,
    texts_arr=[],
):
    ad_params["creative_asset_groups_spec"] = {
        "groups": [
            {
                "images": image_hash_arr,
                "videos": video_hash_arr,
                "texts": texts_arr,
                "call_to_action": {
                    "type": "SHOP_NOW",
                    "value": {
                        "link": link,
                    },
                },
            }
        ]
    }

    generate_ad(ad_params, creative_params)
