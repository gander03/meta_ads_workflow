import requests
import os
import datetime

save_path_prefix = "temp/image_"


def download_img(image_url):
    try:
        response = requests.get(image_url)
        response.raise_for_status()  # Raise an error for bad responses

        save_path = (
            f"{save_path_prefix}{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        )

        # Ensure the directory exists
        os.makedirs(os.path.dirname(save_path), exist_ok=True)

        with open(save_path, "wb") as file:
            file.write(response.content)
        print(f"Image downloaded successfully and saved to {save_path}")

        return save_path
    except requests.exceptions.RequestException as e:
        print(f"Error downloading image: {e}")
