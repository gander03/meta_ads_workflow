from utils.authenticate import authenticate
import os

my_account = authenticate()

script_directory = os.path.dirname(os.path.abspath(__file__))
media_directory = os.path.dirname(script_directory) + "/media/"


def update_campaign_list():
    # get a list of all campaigns, then update the media directory

    campaigns = my_account.get_campaigns(fields=["id", "name", "status"], params={"effective_status": ["ACTIVE", "IN_PROCESS"]})

    print("Campaigns fetched:", len(campaigns))

    campaigns = [
        c for c in campaigns if c["status"] == "ACTIVE"
    ]  # only fetch active campaigns

    print("Active Campaigns:", len(campaigns))
    
    folders = [
        name
        for name in os.listdir(media_directory)
        if os.path.isdir(os.path.join(media_directory, name))
        and id_from_name(name) in [c["id"] for c in campaigns]
    ]

    for campaign in campaigns:
        campaign_id = campaign["id"]
        campaign_name = campaign["name"]

        # Check if the folder exists
        local_folder = local_folder_name(campaign_name, campaign_id)
        if local_folder not in folders:
            # Create the folder if it does not exist
            os.makedirs(os.path.join(media_directory, local_folder), exist_ok=True)
            print(f"Created folder: {local_folder}")

    return campaigns


def get_campaign_path_from_id(campaign_id):
    # Get the path of the campaign folder based on the campaign ID
    for folder in os.listdir(media_directory):
        if id_from_name(folder) == campaign_id:
            return os.path.join(media_directory, folder)
    raise ValueError(f"Campaign with ID {campaign_id} not found in media directory.")


def local_folder_name(name, id):
    # Convert the name to a valid local folder name
    # Replace spaces with underscores and remove special characters
    return f"{name.replace(' - ', '-').replace(' ', '_').replace('/', '_').replace('/', '_')}_{id}"


def id_from_name(folder_name):
    # Extract the ID from the folder name
    parts = folder_name.split("_")
    if len(parts) > 1:
        return parts[-1]  # last part is the ID
    return None


def get_adset_id_from_path(media_path):
    # Extract the adset ID from the media path
    # Assuming the media path is structured like: media/campaign_name_adset_name_adset_id/
    parts = media_path.split(os.sep)
    if len(parts) < 3:
        raise ValueError("Invalid media path format")

    adset_folder = parts[-2]  # Get the second last part which is the adset folder
    adset_id = id_from_name(adset_folder)

    if not adset_id:
        raise ValueError("Adset ID not found in the media path")

    return adset_id


def get_adset_name_from_path(media_path):
    # Extract the adset name from the media path
    # Assuming the media path is structured like: media/campaign_name_adset_name_adset_id/
    parts = media_path.split(os.sep)
    if len(parts) < 3:
        raise ValueError("Invalid media path format")

    adset_folder = parts[-2]  # Get the second last part which is the adset folder
    adset_name = "_".join(adset_folder.split("_")[:-1])  # Remove the ID part

    return adset_name
