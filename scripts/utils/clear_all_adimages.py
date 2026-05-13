from authenticate import authenticate

## IMPORTANT: This script will delete all ad images from your Facebook Ad Account.
## Use with caution and ensure you have backups if necessary.
## Will not delete any images that are currently in use by an ad.

my_account = authenticate()

image_list = my_account.get_ad_images()

for image in image_list:
    params = {
        "hash": image["hash"],
    }
    try:
        my_account.delete_ad_images(params=params)
        print(f"Deleting image with hash: {image['hash']}")
    except Exception as e:
        print(f"Error deleting image with hash {image['hash']}")
