from configparser import ConfigParser
from utils.authenticate import authenticate
import os
from facebook_business.adobjects.adcreative import AdCreative

config_path = "config.ini"

my_account = authenticate()


def update_config():
    config_obj = ConfigParser()

    # Check if the config file exists, create it if it doesn't


    with open(config_path, "w") as f:
        with open("configexample.ini", "r") as example_file:
            f.write(example_file.read())

    config_obj.read(config_path)

    pixel_id = selectFromList(
        my_account.get_ads_pixels(fields=["id", "name"]),
        "Select a Pixel ID to use for the campaign: ",
        id_key="id",
        name_key="name",
    )
    print(f"Selected Pixel ID: {pixel_id}")

    instagram_user_id = selectFromList(
        my_account.get_ad_creatives(fields=[AdCreative.Field.instagram_user_id]),
        "Select an Instagram Account ID to use for the campaign: ",
        id_key="instagram_user_id",
    )
    print(f"Selected Ad Account ID: {instagram_user_id}")

    config_obj["ACCOUNT"] = {
        "meta_pixel_id": pixel_id,
        "instagram_user_id": instagram_user_id,
    }

    # Write the changes back to the config file
    with open(config_path, "w") as configfile:
        config_obj.write(configfile)

    print("Configuration updated successfully.")


def selectFromList(list, prompt, id_key="id", name_key=None):
    print("Available options:")
    selection_arr = []
    for idx, item in enumerate(list):
        id = item[id_key]
        if id in selection_arr:
            continue
        if name_key and name_key in item:
            print(f"{idx}: Name: {item[name_key]} (ID: {item[id_key]})")
        else:
            print(f"{idx}: (ID: {item[id_key]})")
        selection_arr.append(item[id_key])
    while True:
        try:

            selection = int(input(prompt))
            if 0 <= selection < len(selection_arr):
                return selection_arr[selection]
            else:
                print("Invalid selection. Please enter a valid index.")
        except ValueError:
            print("Please enter a number.")


update_config()
