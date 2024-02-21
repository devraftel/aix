import os
import requests
from typing import Optional, Annotated, Union
from pydantic import BaseModel
from enum import Enum

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)


class SessionStatus(str, Enum):
    ACTIVE = "active"
    REVOKED = "revoked"
    ENDED = "ended"
    EXPIRED = "expired"
    REMOVED = "removed"


class ClerkSession(BaseModel):
    object: str
    id: str
    user_id: str
    client_id: str
    actor: dict | None
    status: SessionStatus
    last_active_at: int
    expire_at: int
    abandon_at: int
    updated_at: int
    created_at: int


class InactiveSessionError(HTTPException):
    """Exception raised when the session status is not active."""

    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Session is not active."
        )


class Clerk:
    def __init__(self):
        print("Initializing Clerk with configuration settings.")
        self.CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
        self.CLERK_FRONTEND_API_URL = os.environ.get("CLERK_API_FRONTEND_URL")
        self.CLERK_BACKEND_API_URL = os.environ.get("CLERK_API_BACKEND_URL")

    def get_session_details(
        self, token: Annotated[str | None, Depends(oauth2_scheme)]
    ) -> ClerkSession | InactiveSessionError | None:
        if not token:
            return None

        print(f"Attempting to get user session with token: {token}")
        try:
            response = requests.get(
                f"{self.CLERK_BACKEND_API_URL}/sessions/{token}",
                headers={"Authorization": f"Bearer {self.CLERK_SECRET_KEY}"},
            )
            response.raise_for_status()

            data = response.json()
            session = ClerkSession(**data)

            if session.status == "active":
                return session

        except requests.exceptions.HTTPError as http_err:
            print(
                f"HTTP {response.status_code} Error occurred during user session retrieval. Error message: {http_err}",
            )
            raise HTTPException(
                status_code=response.status_code,
                # detail=f"HTTP ({response.status_code}) Error occurred during user session retrieval. Error message: {response.json()['errors'][0]['message']}",
                detail=err.response.json().get("errors", [{"message": str(err)}])[0][
                    "message"
                ],
            )
        except requests.exceptions.RequestException as err:
            print(f"Request Exception: An error occurred during the request: {err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Request Exception: An error occurred during the request: {err}",
            )
        except Exception as err:
            print(f"Unexpected Exception: An unexpected error occurred: {err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Unexpected Exception: An unexpected error occurred: {err}",
            )
        raise InactiveSessionError()

    # def get_oauth_user(self, token: Annotated[str | None, Depends(oauth2_scheme)]):
    #     if not token:
    #         return None
    #     print(f"Attempting to get current user with token {token}")

    #     res = requests.get(
    #         "https://clerk.kly.lol/oauth/userinfo",
    #         headers={"Authorization": f"Bearer {self.CLERK_SECRET_KEY}"},
    #     )

    #     if res.status_code == 200:
    #         user = res.json()
    #         print(f"Successfully retrieved current user with token {user}")
    #         return user
    #     else:
    #         print(f"Invalid authentication credentials")
    #         raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Invalid authentication credentials",
    #             headers={"WWW-Authenticate": "Bearer"},
    #         )
