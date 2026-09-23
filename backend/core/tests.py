from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class HealthCheckTests(APITestCase):
    """
    Automated test suite for the /api/v1/health/ endpoint.
    """

    def setUp(self):
        self.health_url = reverse('core:health-check')

    def test_health_check_returns_200(self):
        """Verify GET /api/v1/health/ returns HTTP 200."""
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_health_check_response_body(self):
        """Verify JSON response payload is exact: {'status': 'ok'}."""
        response = self.client.get(self.health_url)
        self.assertEqual(response.data, {"status": "ok"})

    def test_health_check_accessible_without_auth(self):
        """Verify endpoint is publicly accessible without authentication."""
        self.client.credentials()  # Explicitly ensure no credentials
        response = self.client.get(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {"status": "ok"})

    def test_health_check_post_method_not_allowed(self):
        """Verify POST method returns 405 Method Not Allowed."""
        response = self.client.post(self.health_url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_health_check_put_method_not_allowed(self):
        """Verify PUT method returns 405 Method Not Allowed."""
        response = self.client.put(self.health_url, {})
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_health_check_delete_method_not_allowed(self):
        """Verify DELETE method returns 405 Method Not Allowed."""
        response = self.client.delete(self.health_url)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_health_check_direct_path(self):
        """Verify direct path /api/v1/health/ resolves and responds with 200."""
        response = self.client.get('/api/v1/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"status": "ok"})
