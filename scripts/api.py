import re
from flask import Flask, send_file, send_from_directory, request
from upload_flexible import upload_flexible
from upload_media import upload_image_from_path, upload_video_from_path
from get_campaigns_from_fb_api import get_campaigns_from_fb_api
from create_adset import create_ad_set
from upload_media_and_create import upload_media_and_create_ad
from update_file_dir import (
    get_adset_id_from_path,
    local_folder_name,
    update_campaign_list,
    get_campaign_path_from_id,
)
from configparser import ConfigParser
import dotenv
import os
import base64
import io

config_path = "../config.ini"
from flask_cors import CORS, cross_origin


dotenv.load_dotenv()

app = Flask(__name__)
cors = CORS(app, resources={r"*": {"origins": "http://localhost:*"}})

# Run update_campaign_list() on startup
with app.app_context():
    print("Updating campaign list on startup...")


@app.before_request  # Limit access to localhost
def limit_remote_addr():
    if request.remote_addr != "127.0.0.1":
        return {"error": "Access denied"}, 403


script_directory = os.path.dirname(os.path.abspath(__file__))
media_directory = os.path.dirname(script_directory) + "/media/"


@app.route("/")
def hello_world():
    return "Hello, World!"


@app.route("/update_file_dir")
def update_file_dir():

    try:
        update_campaign_list()
        return {"status": "File directory updated successfully"}
    except Exception as e:
        return {"error": str(e)}, 500


@app.route("/get_campaigns")
def get_campaigns():
    try:
        campaigns = update_campaign_list()
        active_campaigns = get_campaigns_from_fb_api(campaigns)
        return {"campaigns": active_campaigns}
    except Exception as e:
        return {"error": str(e)}, 500


@app.route("/get_image_paths/<campaign_id>")
def get_images(campaign_id):
    try:

        campaign_path = get_campaign_path_from_id(campaign_id)
        # Ensure campaign_path is within media_directory
        if not campaign_path.startswith(os.path.abspath(media_directory)):
            return {"error": "Invalid campaign name"}, 400

        files = get_file_children_recursively(campaign_path)

        arr_filepaths = []

        for filename in files:
            file_path = os.path.join(media_directory, filename)
            if os.path.isfile(file_path):
                arr_filepaths.append(filename)

        # Remove any files that have '_posted' in their filename
        arr_filepaths = [
            f
            for f in arr_filepaths
            if not os.path.splitext(os.path.basename(f))[0].endswith("_posted")
            and os.path.splitext(os.path.basename(f))[0] != ".DS_Store"
        ]

        # convert to relative paths
        arr_filepaths = [
            os.path.relpath(path, media_directory) for path in arr_filepaths
        ]

        return {"filepaths": arr_filepaths}
    except Exception as e:
        return {"error": str(e)}, 500


def get_file_children_recursively(directory):
    file_paths = []
    for root, _, files in os.walk(directory):
        for file in files:
            file_paths.append(os.path.join(root, file))
    return file_paths


@app.route("/create_flexible", methods=["POST"])
def create_flexible():
    try:
        num_created = 0
        data = request.get_json()
        video_hash_arr = []
        image_hash_arr = []

        for imagePath in data["selectedImages"]:
            image_path = os.path.join(media_directory, imagePath)
            if not os.path.exists(image_path):
                return {"message": f"error: Image {imagePath} does not exist"}, 400

            # Test for data type: image or video
            if image_path.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".webm")):
                video_id = upload_video_from_path(media_path=image_path)
                video_hash_arr.append({"video_id": video_id})
            else:
                image_hash = upload_image_from_path(media_path=image_path)
                image_hash_arr.append({"hash": image_hash})

            # Rename the file by appending '_posted' before the extension

            num_created += 1

        upload_flexible(
            adsetID=get_adset_id_from_path(data["selectedImages"][0]),
            headline=data["headline"],
            primary_text=data["primary_text"],
            description=data["description"],
            link=data["link"],
            image_hash_arr=image_hash_arr,
            video_hash_arr=video_hash_arr,
        )

        for imagePath in data["selectedImages"]:  # rename files after upload
            image_path = os.path.join(media_directory, imagePath)
            base, ext = os.path.splitext(image_path)
            new_image_path = base + "_posted" + ext
            os.rename(image_path, new_image_path)

        return {
            "message": f"{len(data['selectedImages'])} image{'s' if len(data['selectedImages']) != 1 else ''} uploaded successfully, and ad created"
        }, 200
        # data should be in body as json
        # Placeholder for ad creation logic
    except Exception as e:
        return {
            "message": f"Uploaded {num_created} / {len(data["selectedImages"])}, error: {str(e)}"
        }, 500


@app.route("/create_ad", methods=["POST"])
def create_ad():
    try:
        num_created = 0
        data = request.get_json()

        for imagePath in data["selectedImages"]:
            image_path = os.path.join(media_directory, imagePath)
            if not os.path.exists(image_path):
                return {"message": f"error: Image {imagePath} does not exist"}, 400

            # Test for data type: image or video
            if image_path.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".webm")):
                media_type = "video"
            else:
                media_type = "image"

            upload_media_and_create_ad(
                media_type=media_type,
                media_path=image_path,
                headline=data["headline"],
                primary_text=data["primary_text"],
                description=data["description"],
                link=data["link"],
                ad_count=num_created,
            )
            # Rename the file by appending '_posted' before the extension
            base, ext = os.path.splitext(image_path)
            new_image_path = base + "_posted" + ext
            os.rename(image_path, new_image_path)

            num_created += 1

        return {
            "message": f"{len(data['selectedImages'])} ad{'s' if len(data['selectedImages']) != 1 else ''} created successfully"
        }, 200
        # data should be in body as json
        # Placeholder for ad creation logic
    except Exception as e:
        return {
            "message": f"Created {num_created} / {len(data["selectedImages"])}, error: {str(e)}"
        }, 500


@app.route("/create_adset/<campaign_id>", methods=["POST"])
def create_adset(campaign_id):
    try:
        data = request.get_json()

        if "name" in data:
            data["name"] = data["name"].replace("/", "-")

        # Check if data["name"] is valid as a part of a path
        invalid_path_chars = r'[<>:"/\\|?*\x00-\x1F]'
        if not data.get("name") or re.search(invalid_path_chars, data["name"]):
            return {"message": "Invalid adset name for file path"}, 400

        config_obj = ConfigParser()
        config_obj.read(config_path)

        for i in range(data["num_adsets"]):
            new_name = f"{data["name"]} {i + 1}"

            params={
                "name": f"{new_name}",
                "campaign_id": campaign_id,
                "optimization_goal": "OFFSITE_CONVERSIONS",
                "status": "ACTIVE",
                "billing_event": "IMPRESSIONS",
                "attribution_spec": [
                    {"event_type": "CLICK_THROUGH", "window_days": 7},
                    {"event_type": "VIEW_THROUGH", "window_days": 1},
                ],
                "targeting": {
                    "geo_locations": {"countries": data["countries"]},
                    "targeting_automation": {"advantage_audience": 1},
                    "brand_safety_content_filter_levels": [
                        "FACEBOOK_RELAXED",
                        "AN_RELAXED",
                        "FEED_RELAXED",
                    ],
                },
                # "bid_strategy": "LOWEST_COST_WITHOUT_CAP",
                "promoted_object": {
                    "custom_event_type": "PURCHASE",
                    "pixel_id": config_obj["ACCOUNT"]["meta_pixel_id"],
                    # Replace with your actual pixel ID
                },
                "start_time": data["start_time"],
                **({"end_time": data["end_time"]} if "end_time" in data else {}),
            }
            
            if "daily_min_spend" in data and data["daily_min_spend"] > 0:
                params["daily_min_spend_target"] = data["daily_min_spend"]


            adset_id = create_ad_set(
                params = params
                
            )

            # create the folder directly rather than updating the whole file directory
            campaign_folder = get_campaign_path_from_id(campaign_id)
            local_folder = local_folder_name(new_name, adset_id)
            os.makedirs(os.path.join(campaign_folder, local_folder), exist_ok=True)
            print(f"Created folder: {local_folder}")

        return {
            "message": f"{data['num_adsets']} adset{'s' if data['num_adsets'] != 1 else ''} created successfully"
        }, 200

        # Placeholder for adset creation logic
        # You would typically call a function to create the adset here
        # For example: create_ad_set(campaign_id, data)

    except Exception as e:
        return {"message": str(e)}, 500


@app.route("/get_image/<path:filename>")
def get_image(filename):

    return send_from_directory(
        media_directory, filename
    )  # safe join already implemented
