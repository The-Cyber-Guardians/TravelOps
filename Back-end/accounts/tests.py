from django.test import SimpleTestCase
from django.urls import reverse


class ApiDocumentationTests(SimpleTestCase):
    def test_openapi_schema_is_available(self):
        response = self.client.get(reverse('schema'))

        self.assertEqual(response.status_code, 200)
        self.assertTrue(
            response['Content-Type'].startswith('application/vnd.oai.openapi')
        )

    def test_swagger_ui_is_available(self):
        response = self.client.get(reverse('swagger-ui'))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'swagger-ui')
