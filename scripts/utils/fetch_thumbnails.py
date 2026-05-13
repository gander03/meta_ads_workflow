from utils.authenticate import authenticate
from facebook_business.adobjects.advideo import AdVideo
import time


my_account = authenticate()


# according to multiple threads, there is no way to set default thumbnail for videos through the API
# so we will fetch the first thumbnail of the video and use it as the default thumbnail
def fetch_thumbnail_url(video_id, index=0):
    for i in range(100):  # repeat until the thumbnail is available
        time.sleep(2)
        ad_video = AdVideo(video_id).api_get()
        thumbnails = ad_video.get_thumbnails()

        if index < len(thumbnails):
            return thumbnails[index]["uri"]
            
        else:
            time.sleep(2)
            continue


    raise ValueError(
        "Video ID not found or thumbnails not available after 100 attempts"
    )
