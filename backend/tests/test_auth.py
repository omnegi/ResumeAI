def test_register_and_login(client):
    # 1. Test user registration
    reg_response = client.post(
        "/auth/register",
        json={
            "full_name": "Test Candidate",
            "email": "testcandidate@example.com",
            "password": "securepassword123"
        }
    )
    assert reg_response.status_code == 201
    data = reg_response.json()
    assert data["email"] == "testcandidate@example.com"
    assert "id" in data

    # 2. Test duplicate registration block
    dup_response = client.post(
        "/auth/register",
        json={
            "full_name": "Test Candidate",
            "email": "testcandidate@example.com",
            "password": "securepassword123"
        }
    )
    assert dup_response.status_code == 400

    # 3. Test user login (OAuth2 form expects 'username' field)
    login_response = client.post(
        "/auth/login",
        data={
            "username": "testcandidate@example.com",
            "password": "securepassword123"
        }
    )
    assert login_response.status_code == 200
    login_data = login_response.json()
    assert "access_token" in login_data
    assert login_data["token_type"] == "bearer"

    # 4. Test auth me validation
    token = login_data["access_token"]
    me_response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_response.status_code == 200
    me_data = me_response.json()
    assert me_data["email"] == "testcandidate@example.com"
    assert me_data["full_name"] == "Test Candidate"


def test_login_wrong_password(client):
    """Login with wrong credentials should return 401."""
    resp = client.post(
        "/auth/login",
        data={
            "username": "nonexistent@example.com",
            "password": "wrongpassword"
        }
    )
    assert resp.status_code == 401


def test_me_without_token(client):
    """Accessing /auth/me without a token should return 401."""
    resp = client.get("/auth/me")
    assert resp.status_code == 401
