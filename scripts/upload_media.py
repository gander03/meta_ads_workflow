from utils.authenticate import authenticate
from utils.download_img import download_img
import os

my_account = authenticate()


def upload_image(media_url):
    # seems like SDK only accepts image upload and not url supply, so temporarily download the image
    path = download_img(media_url)

    fields = []
    params = {
        "filename": path,
    }
    response = my_account.create_ad_image(fields=fields, params=params)
    image_hash = response["hash"]
    print("Image uploaded with hash:", image_hash)

    if os.path.exists(path):
        os.remove(path)
    return image_hash


def upload_image_from_path(media_path):
    fields = []
    params = {
        "filename": media_path,
    }
    response = my_account.create_ad_image(fields=fields, params=params)
    image_hash = response["hash"]
    print("Image uploaded with hash:", image_hash)
    return image_hash


def upload_video_from_path(media_path):
    fields = []
    params = {
        "filename": media_path,
    }
    response = my_account.create_ad_video(fields=fields, params=params)

    video_id = response["id"]
    print("Video uploaded with ID:", video_id)

    return video_id


def upload_video(media_url):

    fields = []
    params = {
        "file_url": media_url,
    }
    response = my_account.create_ad_video(fields=fields, params=params)
    video_id = response["id"]
    print("Video uploaded with ID:", video_id)
    return video_id
