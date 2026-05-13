from create_ad import generate_flexible_ad
from upload_media_and_create import generate_creative_params


def upload_flexible(
    adsetID, headline, primary_text, description, link, image_hash_arr, video_hash_arr
):

    ad_params = {
        "name": f"Flexible Ad",  # generate ad name
        "adset_id": adsetID,  # should prompt user for the adsetid
        "status": "ACTIVE",  #  might need to change to ACTIVE later
    }

    if len(image_hash_arr) == 0:
        creative_params = generate_creative_params(
            "video",
            headline=headline,
            primary_text=primary_text,
            description=description,
            link=link,
            hash_id=video_hash_arr[0]["video_id"],
        )

    elif len(video_hash_arr) == 0:
        raise ValueError("At least one image or video must be provided.")

    else:
        creative_params = generate_creative_params(
            "image",
            headline=headline,
            primary_text=primary_text,
            description=description,
            link=link,
            hash_id=image_hash_arr[0]["hash"],
        )

    generate_flexible_ad(
        ad_params=ad_params,  # Placeholder for ad parameters
        creative_params=creative_params,  # Placeholder for creative parameters
        image_hash_arr=image_hash_arr,
        video_hash_arr=video_hash_arr,
        texts_arr=[
            {
                "text": primary_text,
                "text_type": "primary_text",
            },
            {
                "text": headline,
                "text_type": "headline",
            },
            {
                "text": description,
                "text_type": "description",
            },
        ],
        link=link
    )
