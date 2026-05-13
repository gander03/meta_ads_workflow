from update_file_dir import get_adset_id_from_path, get_adset_name_from_path
from utils.test_data import testImageURL, testAdsetID, testVideoURL
from upload_media import upload_video, upload_image_from_path, upload_video_from_path
from create_ad import generate_ad
from utils.fetch_thumbnails import fetch_thumbnail_url
from configparser import ConfigParser

import os
from dotenv import load_dotenv
from utils.authenticate import authenticate

my_account = authenticate()
config_path = "../config.ini"


load_dotenv()


def upload_media_and_create_ad(
    media_type, media_path, headline, primary_text, description, link, ad_count
):

    adsetID = get_adset_id_from_path(media_path)
    print(f"Adset ID from path: {adsetID}")

    ad_params = {
        "name": f"{"Ad #"}{ad_count + 1}",  # generate ad name
        "adset_id": adsetID,  # should prompt user for the adsetid
        "status": "ACTIVE",  #  might need to change to ACTIVE later
    }

    if media_type == "video":
        hash_id = upload_video_from_path(media_path=media_path)

    elif media_type == "image":
        hash_id = upload_image_from_path(media_path=media_path)

    creative_params = generate_creative_params(
        media_type=media_type,
        headline=headline,
        primary_text=primary_text,
        description=description,
        link=link,
        hash_id=hash_id,
    )
    generate_ad(ad_params, creative_params)


def generate_creative_params(
    media_type, headline, primary_text, description, link, hash_id
):

    config_obj = ConfigParser()
    config_obj.read(config_path)

    if media_type == "video":
        video_id = hash_id
        return {
            "object_story_spec": {
                "page_id": os.getenv("FB_PAGE_ID"),
                "instagram_user_id": config_obj["ACCOUNT"]["instagram_user_id"],
                # threads_user_id NOT DONE
                "video_data": {
                    "call_to_action": {
                        "type": "SHOP_NOW",
                        "value": {
                            "link": link,
                        },
                    },
                    "title": headline,
                    "message": primary_text,
                    "link_description": description,
                    "video_id": video_id,
                    "image_url": fetch_thumbnail_url(video_id),  # default thumbnail
                },
                "asset_feed_spec": {"optimization_type": "LOCALIZED_PLACEMENTS"},
            },
        }

    elif media_type == "image":
        image_hash = hash_id
        return {
            "object_story_spec": {
                "page_id": os.getenv("FB_PAGE_ID"),
                "instagram_user_id": config_obj["ACCOUNT"]["instagram_user_id"],
                # threads_user_id NOT DONE
                "link_data": {
                    "link": link,
                    "name": headline,
                    "message": primary_text,
                    "description": description,
                    "image_hash": image_hash,
                    "call_to_action": {
                        "type": "SHOP_NOW",
                    },
                },
                "asset_feed_spec": {"optimization_type": "LOCALIZED_PLACEMENTS"},
            },
        }

    else:
        raise ValueError("Unsupported media type. Use 'video' or 'image'.")
