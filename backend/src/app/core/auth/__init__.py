import requests
from typing import Optional, Annotated
from datetime import datetime, timezone
from jose import JWTError, jwt, jwk
from pydantic import BaseModel

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from api.config import settings

# from api.public.user.models import UserCreate, UserSignupResponse, UserCredentials
from api.utils.errors import (
    HTTPError,
    BadRequest,
    NotFound,
    Unauthorized,
    Forbidden,
    UnprocessableEntity,
    OK,
)
from api.utils.logger import logger_config
from api.auth.model import LoginResponse


logger = logger_config(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
optiona_oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


class Clerk:
    def __init__(self):
        logger.debug("Initializing Clerk with configuration settings.")
        self.token = settings.CLERK_SECRET_KEY
        self.CLERK_BACKEND_API_URL = settings.CLERK_BACKEND_API_URL
        self.CLERK_FRONTEND_API_URL = settings.CLERK_FRONTEND_API_URL
        self.CLERK_JWKS_URL = settings.CLERK_JWKS_URL

    def get_user_details(self, user_id: str):
        logger.debug(f"Retrieving user information for user_id: {user_id}")
        response = requests.get(
            f"{self.CLERK_BACKEND_API_URL}/users/{user_id}",
            headers={
                "Authorization": f"Bearer {self.token}",
            },
        )

        if response.status_code == 200:
            logger.info(f"User information retrieved for user_id: {user_id}")

            data = response.json()
            return {
                "email_address": data["email_addresses"][0]["email_address"],
                "first_name": data["first_name"],
                "last_name": data["last_name"],
                "last_login": datetime.fromtimestamp(
                    data["last_sign_in_at"] / 1000, tz=datetime.now(timezone.utc).tzinfo
                ),
            }, True
        else:
            logger.error(
                f"Failed to retrieve user information for user_id: {user_id}. Error: {response.text}"
            )

            return {
                "email_address": "",
                "first_name": "",
                "last_name": "",
                "last_login": None,
            }, False

    def get_jwks(self):
        logger.debug("Fetching JWKS.")
        response = requests.get(f"{self.CLERK_JWKS_URL}")
        if response.status_code == 200:
            logger.info("JWKS fetched successfully.")
            jwks_data = response.json()
        else:
            logger.error(f"Failed to fetch JWKS. Error: {response.text}")

            raise HTTPException(
                status_code=response.status_code,
                detail=f"Failed to fetch JWKS from Clerk. Error message: {response.text}",
                headers={"Content-Type": "application/json"},
            )
        return jwks_data

    def create_user(self, user):
        user_data = {
            "email_address": [f"{user.email_address}"],
            "username": f"{user.username}",
            "password": f"{user.password}",
            "skip_password_checks": True,
            "skip_password_requirement": False,
            "created_at": f"{datetime.now(timezone.utc).isoformat()}",
        }
        logger.debug(f"Registering new user: {user_data}")

        try:
            response = requests.post(
                f"{self.CLERK_BACKEND_API_URL}/users",
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Content-Type": "application/json",
                },
                json=user_data,
            )

        except requests.exceptions.HTTPError as http_err:
            data = response.json()
            logger.error(
                f"HTTP Error occurred during user registration. Error: {http_err}; {data['errors'][0]['message']}"
            )
            # logger.error(f"HTTP Error during user registration. Error: {http_err}")
            raise HTTPError(
                response.status_code,
                f"{data['errors'][0]['message']}",
            )
        except requests.exceptions.RequestException as err:
            logger.error(f"Request Exception during user registration. Error: {err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Request Exception during user registration. Error: {err}",
            )
        except Exception as err:
            logger.error(f"Unexpected error during user registration. Error: {err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected error during user registration. Error: {err}",
            )
        else:
            logger.info("User registered successfully.")
            data = response.json()
            return data

    def authenticate_user(self, user) -> LoginResponse:
        logger.info(f"Attempting to authenticate user: {user.userIdentifier}")

        data = {
            "strategy": "password",
            "identifier": f"{user.userIdentifier}",
            "password": f"{user.password}",
        }

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": f"Bearer {self.token}",
        }

        try:
            response = requests.post(
                f"{self.CLERK_FRONTEND_API_URL}/v1/client/sign_ins",
                headers=headers,
                data=data,
            )

            response.raise_for_status()

        except requests.exceptions.HTTPError as http_err:
            logger.error(
                f"HTTP {response.status_code} Error occurred during user authentication. Error message: {http_err}",
            )
            raise HTTPError(
                response.status_code,
                f"HTTP ({response.status_code}) Error occurred during user authentication. Error message: {response.json()['errors'][0]['message']}",
            )
        except requests.exceptions.RequestException as err:
            logger.error(
                f"Request Exception: An error occurred during the request: {err}"
            )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Request Exception: An error occurred during the request: {err}",
            )
        except Exception as err:
            logger.info(
                f"Unexpected Exception: An unexpected error occurred: {response.json()} {err}"
            )
            logger.error(f"Unexpected Exception: An unexpected error occurred: {err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected Exception: An unexpected error occurred: {err}",
            )
        else:
            logger.info("Successfully authenticated user.")
            data = response.json()
            jwt = self.fetch_jwt_token(data["client"]["sessions"][0]["id"])  # type: ignore

            return {
                "token": jwt["jwt"],  # type: ignore
                "user_id": data["client"]["sessions"][0]["user"]["id"],  # type: ignore
                "username": data["client"]["sessions"][0]["user"]["username"],  # type: ignore
                "image_url": data["client"]["sessions"][0]["user"]["image_url"],  # type: ignore
                "session_id": data["client"]["sessions"][0]["id"],  # type: ignore
            }

    def fetch_jwt_token(self, user_session: str):
        logger.info(f"Attempting to fetch JWT token for user session: {user_session}")
        response = requests.post(
            f"{self.CLERK_BACKEND_API_URL}/sessions/{user_session}/tokens/kly_test_jwt",
            headers={
                "Authorization": f"Bearer {self.token}",
            },
        )
        if response.status_code == 200:
            logger.info("Successfully fetched JWT token.")
            data = response.json()
            return data
        else:
            logger.error(
                f"Failed to fetch JWT token. Error message: {response.status_code} {response.json()}"
            )
            return None

    # def session_end(self, session_id: str):
    #     logger.info("Attempting to signout user.")

    #     try:
    #         response = requests.post(
    #             f"{self.CLERK_BACKEND_API_URL}/sessions/{session_id}/revoke",
    #             headers={
    #                 "Authorization": f"Bearer {self.token}",
    #             },
    #         )

    #         response.raise_for_status()
    #     except requests.exceptions.HTTPError as http_err:
    #         data = response.json()
    #         logger.error(
    #             f"HTTP Error occurred during user signout. Error: {http_err}; {data}"
    #         )
    #         raise HTTPError(
    #             response.status_code,
    #             f"HTTP Error occurred during user signout. Error: {http_err}",
    #         )
    #     except requests.exceptions.RequestException as err:
    #         logger.error(
    #             f"Request Exception occurred during user signout. Error: {err}"
    #         )
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail=f"Request Exception occurred during user signout. Error: {err}",
    #         )
    #     except Exception as err:
    #         logger.error(f"Unexpected error occurred during user signout. Error: {err}")
    #         raise HTTPException(
    #             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    #             detail=f"Unexpected error occurred during user signout. Error: {err}",
    #         )
    #     else:
    #         logger.info(f"Response: {response.status_code} {response.json()}")

    #         data = response.json()
    #         return {"message": data["status"]}

    def create_oauth(self):
        logger.info("Creating OAuth client.")

        payload = {
            "name": "Kly-GPT",
            "callback_url": "https://chat.openai.com/g/g-4eaeLwHyZ-smart-url-shortener-kly-lol",
            "scopes": "profile email public_metadata",
            "public": False,
        }

        response = requests.post(
            f"{self.CLERK_BACKEND_API_URL}/oauth_applications",
            headers={
                "Authorization": f"Bearer {self.token}",
            },
            json=payload,
        )

        pass


class JWTAuthentication:
    def __init__(self, token: str = Depends(oauth2_scheme)):
        self.token = token

    def authenticate_user_token(self):
        logger.info(f"Attempting to authenticate user token: {self.token}")
        try:
            token = self.token
        except IndexError:
            logger.error("Bearer token not provided.")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Bearer token not provided.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        user = self.decode_and_validate_jwt(token)
        clerk = Clerk()
        logger.info(f"User: {user}")
        info, found = clerk.get_user_details(user)
        if not user:
            return None
        # else:
        #     if found:
        #         user.email = info["email_address"]
        #         user.first_name = info["first_name"]
        #         user.last_name = info["last_name"]
        #         user.last_login = info["last_login"]
        #     user.save()
        logger.info(f"Successfully authenticated user token for user: {user}")
        return user, None

    def get_public_key(jwks_url, token_kid):
        jwks = requests.get(jwks_url).json()
        key = next((key for key in jwks["keys"] if key["kid"] == token_kid), None)
        if key:
            return jwt.jwk.construct(key)
        return None

    def decode_and_validate_jwt(self, token: str):
        clerk = Clerk()
        jwks_data = clerk.get_jwks()

        # public_key = ALGORITHMS.RSA.from_jwk(jwks_data["keys"][0])
        # ----

        headers = jwt.get_unverified_headers(token)
        kid = headers["kid"]
        key_index = next(
            (index for (index, d) in enumerate(jwks_data["keys"]) if d["kid"] == kid),
            None,
        )

        if key_index is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Public key not found.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        public_key = jwk.construct(jwks_data["keys"][key_index])

        # ----
        try:
            payload = jwt.decode(
                token,
                public_key.to_pem(),
                algorithms=["RS256"],
            )
        except JWTError as e:
            error_message = str(e)
            if "Signature has expired" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            elif "Error decoding signature" in error_message:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token decode error.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token.",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token.",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id


def get_current_user(token: str = Depends(oauth2_scheme)):
    logger.info(f"Attempting to get current user with token")
    jwt_auth = JWTAuthentication(token)
    user, _ = jwt_auth.authenticate_user_token()
    if not user:
        logger.error(f"Invalid authentication credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    logger.info(f"Successfully retrieved current user with token")
    return user


def get_current_user_optional(
    token: Annotated[str | None, Depends(optiona_oauth2_scheme)]
):
    if not token:
        return None
    logger.info(f"Attempting to get current user with token {token}")

    res = requests.get(
        "https://clerk.kly.lol/oauth/userinfo",
        headers={"Authorization": f"Bearer {token}"},
    )

    if res.status_code == 200:
        user = res.json()
        logger.info(f"Successfully retrieved current user with token {user}")
        return user
    else:
        logger.error(f"Invalid authentication credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # jwt_auth = JWTAuthentication(token)
    # user, _ = jwt_auth.authenticate_user_token()
    # if not user:
    #     logger.error(f"Invalid authentication credentials")
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="Invalid authentication credentials",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    # logger.info(f"Successfully retrieved current user with token")
    # return user
