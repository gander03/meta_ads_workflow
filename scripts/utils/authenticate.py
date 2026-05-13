from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount

import os
from dotenv import load_dotenv


# class Authenticator:
#     my_account: AdAccount = None

#     @staticmethod
#     def load_account():
#         load_dotenv()
#         my_app_id = os.getenv("APP_ID")
#         my_app_secret = os.getenv("APP_SECRET")
#         my_access_token = os.getenv("ACCESS_TOKEN")
#         FacebookAdsApi.init(my_app_id, my_app_secret, my_access_token)
#         Authenticator.my_account = AdAccount(os.getenv("MY_ACCOUNT"))

#     def getAccount() -> AdAccount:
#         if Authenticator.my_account is None:
#             Authenticator.load_account()
#         return Authenticator.my_account


def authenticate():
    load_dotenv()
    my_app_id = os.getenv("APP_ID")
    my_app_secret = os.getenv("APP_SECRET")
    my_access_token = os.getenv("ACCESS_TOKEN")
    FacebookAdsApi.init(my_app_id, my_app_secret, my_access_token)
    my_account = AdAccount(os.getenv("MY_ACCOUNT"))
    return my_account
