from utils.authenticate import authenticate
import os

my_account = authenticate()


def get_campaigns_from_fb_api(campaigns):
    # get a list of all campaigns, then update the media directory

    campaigns = [
        c for c in campaigns if c["status"] == "ACTIVE"
    ]  # only fetch active campaigns
    campaign_list = []

    for campaign in campaigns:
        campaign_id = campaign["id"]
        campaign_name = campaign["name"]
        campaign_list.append({"id": campaign_id, "name": campaign_name})

    return campaign_list
